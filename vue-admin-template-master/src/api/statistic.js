import request from "@/utils/request";
export default {
  //生成统计数据
  countRegisters(date) {
    return request({
      url: `/statisticService/statistics-daily/countRegisters/${date}`,
      method: "post"
    });
  },
  //获取统计数据
  getStatisticData(searchObj){
    return request({
        url: `/statisticService/statistics-daily/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
        method: "get"
      });
  }
};
