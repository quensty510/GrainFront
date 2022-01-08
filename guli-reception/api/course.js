import request from '@/utils/request'
export default {
  // 课程条件分页查询
  getCourseList(pageNum, pageSize, queryObject) {
    return request({
      url: `/eduService/course/front/getFrontCourseList/${pageNum}/${pageSize}`,
      method: 'post',
      data: queryObject
    })
  },
  // 查询课程分类
  getCourseTree() {
    return request({
      url: `/eduService/edu-subject/getAllSubject`,
      method: 'get'
    })
  },
  // 查询课程详情
  getCourseDetail(courseId) {
    return request({
      url: `/eduService/course/front/getFrontCourseInfo/${courseId}`,
      method: 'get'
    })
  }
}
