import request from "@/utils/request";
export default {
  // 评论分页查询
  getComments(courseId, pageNum, pageSize) {
    return request({
      url: `/eduService/edu-comment/getComments/${courseId}/${pageNum}/${pageSize}`,
      method: "get",
    });
  },
  publishComment(comment) {
    return request({
      url: `/eduService/edu-comment/publishComment`,
      method: "post",
      data: comment,
    });
  },
  // 根据token获取用户信息
  getLoginInfo() {
    return request({
      url: `/ucenter/member/getUserProfile`,
      method: "get",
    });
  },
};
