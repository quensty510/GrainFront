import request from "@/utils/request";
export default {
  //根据课程id获取章节和小节列表
  getAllChapterVideo(courseId) {
    return request({
      url: `/eduService/edu-chapter/getChapterVideo/${courseId}`,
      method: "get"
    });
  },

  saveChapter(chapter){
    return request({
      url: `/eduService/edu-chapter/addChapter`,
      method: 'post',
      data: chapter
    })
  },

  getChapterInfo(chapterId){
    return request({
      url: `/eduService/edu-chapter/getChapterInfo/${chapterId}`,
      method: 'get'
    })
  },

  updateChapter(chapter){
    return request({
      url: `/eduService/edu-chapter/updateChapter`,
      method: 'put',
      data: chapter
    })
  },

  deleteChapter(chapterId){
    return request({
      url: `/eduService/edu-chapter/deleteChapter/${chapterId}`,
      method: 'delete'
    })
  }

};
