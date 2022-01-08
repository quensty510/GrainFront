<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin-bottom: 40px;"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <!-- 添加章节 -->
    <el-button type="text" @click="openChapterDialog">添加章节</el-button>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapter.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改小节表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number
            v-model="video.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API + '/edu-vod/video/uploadAliyunVideo'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，<br />
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br />
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br />
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br />
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <!-- :disabled="saveVideoBtnDisabled" -->
        <el-button type="primary" @click="saveOrUpdateSection">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterNestedList" :key="chapter.id">
        <p>
          {{ chapter.title }}

          <span class="acts">
            <el-button type="text" @click="openSectionDialog(chapter.id)"
              >添加小节</el-button
            >
            <el-button type="text" @click="editChapter(chapter.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="deleteChapter(chapter.id)"
              >删除</el-button
            >
          </span>
        </p>

        <!-- 小节 -->
        <ul class="chanpterList videoList">
          <li v-for="section in chapter.section" :key="section.id">
            <p>
              {{ section.title }}
              <span class="acts">
                <el-button type="text" @click="editSection(section.id)"
                  >编辑</el-button
                >
                <el-button type="text" @click="deleteSection(section.id)"
                  >删除</el-button
                >
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next"
          >下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import chapter from "@/api/edu/chapter";
import section from "@/api/edu/section";

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: "", // 所属课程
      chapterNestedList: [], // 章节嵌套课时列表
      dialogChapterFormVisible: false, //章节弹窗
      dialogVideoFormVisible: false, //小节弹窗
      chapter: {
        //章节对象
        title: "",
        sort: 0
      },
      video: {
        //课时对象
        title: "",
        sort: 0,
        isFree: false,
        videoSourceId: "",
        videoOriginalName: ""
      },
      fileList: [], //上传文件列表
      BASE_API: process.env.BASE_API // 接口API地址
    };
  },

  created() {
    //获取路由中的课程id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getChapterVideo();
    }
  },

  methods: {
    //====================视频上传操作==========================
    //视频上传成功调用的方法
    handleVodUploadSuccess(response, file, fileList) {
      //视频id赋值
      this.video.videoSourceId = response.data.videoId;
      //视频名称赋值
      this.video.videoOriginalName = file.name;
      // console.log(fileList);
    },
    handleUploadExceed() {},
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //调用接口删除视频
    handleVodRemove() {
      section.deleteVideo(this.video.videoSourceId).then(result => {
        this.$message({
          type: "success",
          message: "删除视频成功"
        });
        this.video.videoSourceId = "";
        this.video.videoOriginalName = "";
      });
    },
    //====================视频上传操作==========================

    //==========================小节操作====================
    openSectionDialog(chapterId) {
      this.dialogVideoFormVisible = true;
      this.video = {};
      this.fileList = []
      this.video.chapterId = chapterId;
    },
    saveOrUpdateSection() {
      if (this.video.id) {
        this.updateSection();
      } else {
        this.saveSection();
      }
    },
    saveSection() {
      //设置课程id
      this.video.courseId = this.courseId;
      section.saveSection(this.video).then(result => {
        //关弹窗
        this.dialogVideoFormVisible = false;
        //提示
        this.$message({
          type: "success",
          message: "添加小节成功"
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    editSection(sectionId) {
      this.dialogVideoFormVisible = true;
      section.getSectionInfo(sectionId).then(result => {
        this.video = result.data.sectionInfo;
        if(this.video.videoOriginalName != null && this.video.videoOriginalName != ''){
          this.fileList = [{name: this.video.videoOriginalName}]
        }
      });
    },
    updateSection() {
      section.updateSection(this.video).then(result => {
        //关弹窗
        this.dialogVideoFormVisible = false;
        //提示
        this.$message({
          type: "success",
          message: "修改小节信息成功"
        });
        //刷新页面
        this.getChapterVideo();
      });
    },

    deleteSection(sectionId) {
      this.$confirm("此操作将永久删除该小节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          section.deleteSection(sectionId).then(result => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            //刷新页面
            this.getChapterVideo();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: result.message
          });
        });
    },
    //==========================小节操作====================

    openChapterDialog() {
      this.dialogChapterFormVisible = true;
      this.chapter = {};
    },

    previous() {
      console.log("previous");
      this.$router.push({ path: `/course/info/${this.courseId}` });
    },

    next() {
      this.$router.push({ path: `/course/publish/${this.courseId}` });
    },
    //==========================章节操作====================

    // 根据课程id查询章节和小节
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId).then(result => {
        this.chapterNestedList = result.data.allChapterVideo;
      });
    },
    saveOrUpdate() {
      if (this.chapter.id) {
        this.updateChapter();
      } else {
        this.addChapter();
      }
    },
    addChapter() {
      this.chapter.courseId = this.courseId;
      chapter.saveChapter(this.chapter).then(result => {
        //关弹窗
        this.dialogChapterFormVisible = false;
        //提示
        this.$message({
          type: "success",
          message: "添加章节成功"
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    editChapter(chapterId) {
      this.dialogChapterFormVisible = true;
      chapter.getChapterInfo(chapterId).then(result => {
        this.chapter = result.data.chapter;
      });
    },
    updateChapter() {
      this.chapter.courseId = this.courseId;
      chapter.updateChapter(this.chapter).then(result => {
        //关弹窗
        this.dialogChapterFormVisible = false;
        //提示
        this.$message({
          type: "success",
          message: "修改章节信息成功"
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    deleteChapter(chapterId) {
      this.$confirm("此操作将永久删除该章节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          chapter.deleteChapter(chapterId).then(result => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            //刷新页面
            this.getChapterVideo();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: result.message
          });
        });
      //==========================章节操作====================
    }
  }
};
</script>

<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  /* float: left; */
  clear: both;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}
.videoList p {
  /* float: left; */
  clear: both;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>
