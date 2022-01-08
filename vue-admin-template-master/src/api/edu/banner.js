import request from "@/utils/request";
export default {
  getBannerList(pageNum, pageSize) {
    return request({
      url: `/educms/admin/banner/pageBanner/${pageNum}/${pageSize}`,
      method: "get"
    });
  },
  addBanner(banner) {
    return request({
      url: `/educms/admin/banner/addBanner`,
      method: "post",
      data: banner
    });
  },
  deleteBanner(id){
    return request({
        url: `/educms/admin/banner/remove/${id}`,
        method: 'delete'
    })
  }
};
