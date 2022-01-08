<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" :min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

          <!-- 头衔缩略图 -->
          <pan-thumb :image="teacher.avatar"/>
          <!-- 文件上传按钮 -->
          <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">{{avatarText}}
          </el-button>

          <!--
          v-show：是否显示上传组件
          :key：类似于id，如果一个页面多个图片上传控件，可以做区分
          :url：后台上传的url地址
          @close：关闭上传组件
          @crop-upload-success：上传成功后的回调 -->
          <image-cropper
              v-show="imagecropperShow"
              :width="300"
              :height="300"
              :key="imagecropperKey"
              :url="BASE_API+'/eduoss/fileoss/upload'"
              field="file"
              @close="close"
              @crop-upload-success="cropSuccess"/>

      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherService from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {

    components: { ImageCropper, PanThumb },

    data() {
        return {
        teacher: {
            name: '',
            sort: 0,
            level: 1,
            career: '',
            intro: '',
            avatar: ''
        },
        avatarText: '添加头像',
        saveBtnDisabled: false, // 保存按钮是否禁用
        imagecropperShow: false,
        imagecropperKey: 0,
        BASE_API: process.env.BASE_API //获取dev.env.js中的内容
        }
    },

    created(){
      this.init()
    },

    watch: {  //监听
      //路由发生变化执行
      $route(to, from){
        this.init()
      }
    },

    methods: {
      //关闭上传组件
      close(){
        this.imagecropperShow = false
        // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
      },

      //上传成功后的回调函数
      cropSuccess(data){
        this.imagecropperShow = false
        this.teacher.avatar = data.url
        // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
      },

      init(){
        if(this.$route.params && this.$route.params.id){
          const id = this.$route.params.id
          this.getInfo(id)
        this.avatarText = '更换头像'
        }else{
        this.avatarText = '添加头像'
          this.teacher = {}
        }
      },
      getInfo(id){
        teacherService.getTeacherInfo(id)
          .then(result => {
            this.teacher = result.data.teacher
          })
      },

      updateTeacher(){
        this.saveBtnDisabled = true
        teacherService.updateTeacher(this.teacher)
          .then(result => {
             return this.$message({
                  type: 'success',
                  message: '修改成功!'
             })
          }).then(() => {
              this.$router.push({ path: '/teacher/table' })
          })
      },

      saveOrUpdate() {
          this.saveBtnDisabled = true
          //根据teacher中是否有id选择调用add还是update
          if(this.teacher.id){
            this.updateTeacher()
          }else{
            this.saveTeacher()
          }
      },

      // 添加讲师
      saveTeacher() {
          teacherService.addTeacher(this.teacher)
            .then(result => {
              return this.$message({
                  type: 'success',
                  message: '添加成功!'
            })
        }).then(resposne => {
            // 回到列表页面，路由跳转
            this.$router.push({ path: '/teacher/table' })
        }).catch((response) => {
            // console.log(response)
            this.$message({
            type: 'error',
            message: '保存失败'
            })
        })
      }
    }
}
</script>