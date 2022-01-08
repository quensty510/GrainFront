import request from '@/utils/request'
export default {
  // 讲师分页查询
  getList(pageNum, pageSize) {
    return request({
      url: `/eduService/teacher/front/getFrontTeacher/${pageNum}/${pageSize}`,
      method: 'post'
    })
  },
  // 讲师详情
  getTeacherInfo(teacherId) {
    return request({
      url: `/eduService/teacher/front/getTeacherFrontInfo/${teacherId}`,
      method: 'get'
    })
  }
}
