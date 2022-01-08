import request from "@/utils/request";

export default {
  //1、讲师列表（条件分页查询）
  getTeacherListPage(pageNum, pageSize, teacherQuery) {
    return request({
      //   url: '/eduService/teacher/page/' + pageNum + '/' + pageSize,
      url: `/eduService/teacher/pageCondition/${pageNum}/${pageSize}`,
      method: "post",
      data: teacherQuery
    });
  },
  //2、根据ID逻辑删除讲师
  removeDataById(id) {
    return request({
      url: `/eduService/teacher/remove/${id}`,
      method: "delete"
    });
  },
  //3、添加讲师
  addTeacher(teacher) {
    return request({
      url: `/eduService/teacher/addTeacher`,
      method: "post",
      data: teacher
    });
  },
  //数据回显，根据id查询讲师信息
  getTeacherInfo(id) {
    return request({
      url: `/eduService/teacher/getTeacher/${id}`,
      method: "get"
    });
  },

  updateTeacher(teacher) {
    return request({
      url: `/eduService/teacher/updateTeacher`,
      method: "post",
      data: teacher
    });
  }
};
