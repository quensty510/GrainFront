import request from "@/utils/request";
export default {

  saveSection(section){
    return request({
      url: `/eduService/section/addSection`,
      method: 'post',
      data: section
    })
  },

  getSectionInfo(sectionId){
    return request({
      url: `/eduService/section/getSectionInfo/${sectionId}`,
      method: 'get'
    })
  },

  updateSection(section){
    return request({
      url: `/eduService/section/updateSection`,
      method: 'put',
      data: section
    })
  },

  deleteSection(sectionId){
    return request({
      url: `/eduService/section/deleteSection/${sectionId}`,
      method: 'delete'
    })
  },

  deleteVideo(videoId){
    return request({
      url: `/edu-vod/video/removeVideo/${videoId}`,
      method: 'delete'
    })
  }

};
