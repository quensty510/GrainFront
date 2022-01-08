<template>
  <div class="app-container">
    <h2 style="text-align: center;">{{operation}}</h2>

    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px;"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          @change="subjectLevelOneChanged"
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
        >
          <el-option
            v-for="subject in subjectNested"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in secSubject"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          ref="teacherSelect"
          v-model="courseInfo.teacherId"
          placeholder="请选择"
        >
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/eduoss/fileoss/upload'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from "@/api/edu/course";
import subject from "@/api/edu/subject";
import Tinymce from "@/components/Tinymce"; //引入组件

export default {
  components: { Tinymce }, //声明组件
  data() {
    return {
      operation: '发布新课程',
      saveBtnDisabled: false,
      teacherList: [],
      subjectNested: [],
      secSubject: [],
      BASE_API: "http://localhost:9001",
      courseId: "",
      courseInfo: {
        title: "",
        subjectId: "",
        subjectParentId: "",
        teacherId: "",
        lessonNum: 0,
        description: "",
        cover: "",
        price: 0
      }
    };
  },
  created() {
    this.init();
  },
  watch: {
    //监听
    //路由发生变化执行
    $route(to, from) {
      this.init();
    }
  },
  methods: {
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id;
        this.operation = '修改课程信息'
        this.getCourseInfo(this.courseId);
      } else {
        this.getTeachers();
        //初始化一级分类
        this.getPrimarySubject();
        this.courseInfo = {};
        this.courseInfo.cover = "https://edu-demo-oss.oss-cn-beijing.aliyuncs.com/2021/11/25/defaultCoverImg.jpg";
        this.description = "";
      }
    },
    //跳转到第二步
    saveOrUpdate() {
      if (this.courseId) {
        this.updateCourse();
      } else {
        this.saveCourse();
      }
    },
    saveCourse() {
      course.addCourseInfo(this.courseInfo).then(result => {
        this.$router.push({ path: `/course/chapter/${result.data.courseId}` });
        this.$message({
          type: "success",
          message: "添加课程信息成功"
        });
      });
    },
    updateCourse() {
      course.updateCourseInfo(this.courseInfo).then(result => {
        this.$router.push({ path: `/course/chapter/${this.courseId}` });
        this.$message({
          type: "success",
          message: "修改课程信息成功"
        });
      });
    },
    //查询所有讲师
    getTeachers() {
      course.getListTeacher().then(result => {
        this.teacherList = result.data.list;
      });
    },
    //查询所有一级分类
    getPrimarySubject() {
      subject.getSubjectListTree().then(result => {
        this.subjectNested = result.data.list;
      });
    },
    //显示二级分类
    subjectLevelOneChanged(parentId) {
      for (let i = 0; i < this.subjectNested.length; i++) {
        if (parentId === this.subjectNested[i].id) {
          this.secSubject = this.subjectNested[i].children;
          this.courseInfo.subjectId = "";
        }
      }
    },
    //封面上传之前调用
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //封面上传成功之后
    handleAvatarSuccess(res, file) {
      console.log(res); // 上传响应
      console.log(URL.createObjectURL(file.raw)); // base64编码
      this.$forceUpdate();//强制刷新资源，图片快速回显
      this.courseInfo.cover = res.data.url;
      this.$message({
        type: "success",
        message: "上传封面成功"
      });
    },
    getCourseInfo(courseId) {
      course.getCourseInfoById(courseId).then(result => {
        this.courseInfo = result.data.courseInfo;
        // 初始化分类列表
        subject.getSubjectListTree().then(responseSubject => {
          this.subjectNested = responseSubject.data.list;
          for (let i = 0; i < this.subjectNested.length; i++) {
            if (this.courseInfo.subjectParentId === this.subjectNested[i].id) {
              this.secSubject = this.subjectNested[i].children;
            }
          }
        });
        // 获取讲师列表
        this.getTeachers();
      });
    }
  }
};
</script>

<style scoped>
.avatar-uploader img {
  width: 200px;
  height: 200px;
}
.tinymce-container {
  line-height: 29px;
}
</style>
