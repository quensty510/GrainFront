import request from '@/utils/request'
export default {
  // 获取视频播放凭证
  getVideoPlayAuth(videoId) {
    return request({
      url: `/edu-vod/video/getVideoPlayAuth/${videoId}`,
      method: 'get'
    })
  }
}
