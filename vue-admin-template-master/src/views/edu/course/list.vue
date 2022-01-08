<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程名称" />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="courseQuery.status"
          clearable
          placeholder="课程状态"
          style="width:120px"
        >
          <el-option :value="'Normal'" label="已发布" />
          <el-option :value="'Draft'" label="未发布" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select
          v-model="courseQuery.subject"
          clearable
          placeholder="课程分类"
          style="width:120px"
        >
          <el-option
            v-for="subject in subjectList"
            :key="subject.id"
            :value="subject.id"
            :label="subject.title"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="courseQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="courseQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()"
        >查询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      stripe
      highlight-current-row
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称" />

      <el-table-column label="课程状态" width="100">
        <template slot-scope="scope">
          {{ scope.row.status === "Normal" ? "已发布" : "未发布" }}
        </template>
      </el-table-column>

      <el-table-column prop="lessonNum" label="课时数" width="100" />

      <el-table-column prop="price" label="价格" width="100" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160" />

      <el-table-column prop="viewCount" label="浏览数量" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/' + scope.row.id">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              style="margin-bottom:10px"
              >编辑课程基本信息</el-button
            >
          </router-link>
          <router-link :to="'/course/chapter/' + scope.row.id">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              style="margin-bottom:10px"
              >编辑课程大纲</el-button
            >
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
            style="margin-bottom:10px"
            >删除课程信息</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      :current-page="pageNum"
      :page-size="pageSize"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>

<script>
import course from "@/api/edu/course";
import subject from "@/api/edu/subject";

export default {
  data() {
    return {
      listLoading: true,
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 4,
      courseQuery: {}, //条件封装对象
      subjectList: []
    };
  },
  created() {
    this.getList();
    this.getAllSubjectList();
  },
  methods: {
    getList(pageNum = 1) {
      this.pageNum = pageNum;
      this.listLoading = true;
      course
        .getCourseListCondition(this.pageNum, this.pageSize, this.courseQuery)
        .then(result => {
          // console.log(result)
          this.list = result.data.rows;
          this.total = result.data.total;
          this.listLoading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    resetData() {
      this.courseQuery = {};
      this.getList();
    },
    removeDataById(id) {
      this.$confirm("此操作将永久删除该课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          course.deleteCourseById(id).then(()=>{
            if (this.list.length <= 1) {
            this.getList(this.pageNum - 1);
          } else {
            this.getList(this.pageNum);
          }
          })
        
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
          this.getList();
        });
    },
    getAllSubjectList() {
      subject.getSubjectListTree().then(result => {
        this.subjectList = result.data.list;
      });
    }
  }
};
</script>

<style></style>
