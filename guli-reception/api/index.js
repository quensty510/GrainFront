import request from '@/utils/request'
export default {
  getIndexData() {
    return request({
      url: `/eduService/front/index/getData`,
      method: 'get'
    })
  }
}
