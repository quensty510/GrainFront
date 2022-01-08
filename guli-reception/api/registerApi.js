import request from '@/utils/request'

export default {
  // 根据手机号发送验证码
  sendVerificationCode(phone) {
    return request({
      url: `/edu-msm/msm/send/${phone}`,
      method: 'get'
    })
  },
  // 用户注册
  submitRegister(formItem) {
    return request({
      url: `/ucenter/member/register`,
      method: 'post',
      data: formItem
    })
  }
}
