<template>
  <div class="cart py-container">
    <!--主内容-->
    <div class="checkout py-container pay">
      <div class="checkout-tit">
        <h4 class="fl tit-txt">
          <span class="success-icon"></span
          ><span class="success-info"
            >订单提交成功，请您及时付款！订单号：{{ payObj.out_trade_no }}</span
          >
        </h4>
        <span class="fr"
          ><em class="sui-lead">应付金额：</em
          ><em class="orange money">￥{{ payObj.total_fee }}</em></span
        >
        <div class="clearfix"></div>
      </div>
      <div class="checkout-steps">
        <div class="fl weixin">微信支付</div>
        <div class="fl sao">
          <p class="red">请使用微信扫一扫。</p>
          <div class="fl code">
            <!-- <img id="qrious" src="~/assets/img/erweima.png" alt=""> -->
            <!-- <qriously value="weixin://wxpay/bizpayurl?pr=R7tnDpZ" :size="338"/> -->
            <qriously :value="payObj.code_url" :size="338" />
            <div class="saosao">
              <p>请使用微信扫一扫</p>
              <p>扫描二维码支付</p>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
        <!-- <p><a href="pay.html" target="_blank">> 其他支付方式</a></p> -->
      </div>
    </div>
  </div>
</template>
<script>
import orderApi from "@/api/order";

export default {
  //根据订单id生成微信支付二维码
  asyncData({ params, error }) {
    return orderApi.createCode(params.pid).then((result) => {
      return {
        payObj: result.data,
      };
    });
  },
  data() {
    return {
      timer: "",
    };
  },
  mounted() {
    //每格三秒查询一次支付状态
    this.timer = setInterval(() => {
      this.queryOrderPayStatus(this.payObj.out_trade_no);
    }, 3000);
  },
  methods: {
    //查询订单支付状态
    queryOrderPayStatus(orderNum) {
      orderApi.getOrderPayStatus(orderNum).then((result) => {
        if (result && result.success) {
          //支付成功清除定时器
          clearInterval(this.timer);
          this.$message({
            type: "success",
            message: "支付成功",
          });
          //跳回到课程详情页面
          this.$router.push({ path: "/course/" + this.payObj.course_id });
        }
      });
    },
  },
};
</script>
