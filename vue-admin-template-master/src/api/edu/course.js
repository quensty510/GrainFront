import request from '@/utils/request'

export default{
    //添加课程信息
    addCourseInfo(courseInfo){
        return request({
            url: `/eduService/edu-course/addCourseInfo`,
            method: 'post',
            data: courseInfo
        })
    },
    //查询所有讲师用以显示
    getListTeacher(){
        return request({
            url: `/eduService/teacher/findAll`,
            method: 'get'
        })
    },
    //根据课程id查询课程信息
    getCourseInfoById(courseId){
        return request({
            url: `/eduService/edu-course/getCourseInfo/${courseId}`,
            method: 'get'
        })
    },
    //修改课程信息
    updateCourseInfo(courseInfo){
        return request({
            url: `/eduService/edu-course/updateCourseInfo`,
            method: 'put',
            data: courseInfo
        })
    },
    //根据课程id查询课程发布信息
    getCoursePublishInfo(courseId){
        return request({
            url: `/eduService/edu-course/getCoursePublisInfo/${courseId}`,
            method: 'get'
        })
    },
    //发布课程
    publish(courseId){
        return request({
            url: `/eduService/edu-course/publish/${courseId}`,
            method: 'put'
        })
    },
    //获取课程列表
    getCourseList(){
        return request({
            url: `/eduService/edu-course/courseList`,
            method: 'get'
        })
    },
    //删除课程
    deleteCourseById(courseId){
        return request({
            url: `/eduService/edu-course/deleteCourse/${courseId}`,
            method: 'delete'
        })
    },
    //根据条件分页查询课程列表
    getCourseListCondition(pageNum, pageSize, courseQuery){
        return request({
            url: `/eduService/edu-course/pageCondition/${pageNum}/${pageSize}`,
            method: "post",
            data: courseQuery
          });
    }
}