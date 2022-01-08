import request from '@/utils/request'
export default {
  //生成订单
  createOrder(courseId) {
    return request({
      url: `/orderService/order/createOrder/${courseId}`,
      method: 'post'
    })
  },
  //根据订单号查询订单信息
  getOrderInfo(orderNum) {
    return request({
      url: `/orderService/order/getOrderInfo/${orderNum}`,
      method: 'get'
    })
  },
  //生成微信支付二维码
  createCode(orderNum){
    return request({
      url: `/orderService/pay-log/createCode/${orderNum}`,
      method: 'get'
    })
  },
  //查询订单支付状态
  getOrderPayStatus(orderNum){
    return request({
      url: `/orderService/pay-log/getOrderPayStatus/${orderNum}`,
      method: 'get'
    })
  }
}
