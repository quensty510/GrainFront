<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="Banner名称">
        <el-input v-model="banner.title" />
      </el-form-item>
      <el-form-item label="Banner跳转路径">
        <el-input v-model="banner.linkUrl" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number
          v-model="banner.sort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="上传Banner">
        <el-upload
          ref="upload"
          list-type="picture-card"
          :action="BASE_API + '/eduoss/fileoss/upload'"
          :multiple="false"
          :limit="1"
          :on-preview="handlePictureCardPreview"
          :on-success="upload"
          :auto-upload="false"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="save"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ImageCropper from "@/components/ImageCropper";
import banner from "@/api/edu/banner";
import PanThumb from "@/components/PanThumb";

export default {
  components: { ImageCropper, PanThumb },

  data() {
    return {
      banner: {
        title: "",
        linkUrl: '',
        sort: 0,
        imageUrl: ""
      },
      dialogVisible: false,
      dialogImageUrl: "",
      saveBtnDisabled: false, // 保存按钮是否禁用
      BASE_API: process.env.BASE_API //获取dev.env.js中的内容
    };
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    save() {
      this.$refs.upload.submit();
    },
    upload(response) {
      this.banner.imageUrl = response.data.url;
      banner
        .addBanner(this.banner)
        .then(result => {
          return this.$message({
            type: "success",
            message: "添加成功!"
          });
        })
        .then(resposne => {
          // 回到列表页面，路由跳转
          this.$router.push({ path: "/banner/list" });
        })
        .catch(response => {
          // console.log(response)
          this.$message({
            type: "error",
            message: "添加失败"
          });
        });
    }
  }
};
</script>
