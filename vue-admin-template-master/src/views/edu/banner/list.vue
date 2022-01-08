<template>
  <div class="app-container">
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

      <el-table-column prop="title" label="名称" width="80" />

      <el-table-column prop="linkUrl" label="指向地址" width="150" />

      <el-table-column label="缩略图" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" height="100px" />
        </template>
      </el-table-column>

      <el-table-column prop="gmtCreate" label="添加时间" width="160" />

      <el-table-column prop="sort" label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
            >删除</el-button
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
import banner from "@/api/edu/banner";

export default {
  data() {
    return {
      listLoading: true,
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 4
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList(pageNum = 1) {
      this.pageNum = pageNum;
      this.listLoading = true;
      banner.getBannerList(this.pageNum, this.pageSize).then(result => {
        this.list = result.data.items;
        this.total = result.data.total;
        this.listLoading = false;
      });
    },
    removeDataById(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          banner.deleteBanner(id).then(() => {
            this.getList();
          });
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
        });
    }
  }
};
</script>
