<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- /课程详情 开始 -->
    <section class="container">
      <section class="path-wrap txtOf hLh30">
        <a href="/" title class="c-999 fsize14">首页</a>
        \
        <a href="/course" title class="c-999 fsize14">{{
          courseDetail.subjectLevelOne
        }}</a>
        \
        <span class="c-333 fsize14">{{ courseDetail.subjectLevelTwo }}</span>
      </section>
      <div>
        <article class="c-v-pic-wrap" style="height: 357px">
          <section id="videoPlay" class="p-h-video-box">
            <img
              :src="courseDetail.cover"
              :alt="courseDetail.subjectLevelTwo"
              class="dis c-v-pic"
              style="height: 357px"
            />
          </section>
        </article>
        <aside class="c-attr-wrap">
          <section class="ml20 mr15">
            <h2 class="hLh30 txtOf mt15">
              <span class="c-fff fsize24">{{
                courseDetail.subjectLevelTwo
              }}</span>
            </h2>
            <section class="c-attr-jg">
              <span class="c-fff">价格：</span>
              <b class="c-yellow" style="font-size: 24px">{{
                courseDetail.price
              }}</b>
            </section>
            <section class="c-attr-mt c-attr-undis">
              <span class="c-fff fsize14"
                >主讲： {{ courseDetail.teacherName }}&nbsp;&nbsp;&nbsp;</span
              >
            </section>
            <section class="c-attr-mt of">
              <span class="ml10 vam">
                <em class="icon18 scIcon" />
                <a class="c-fff vam" title="收藏" href="#">收藏</a>
              </span>
            </section>
            <section v-if="isPurchased ||Number(courseDetail.price) === 0" class="c-attr-mt">
              <a @click.prevent="scrollToPlay()" href="#" title="立即观看" class="comm-btn c-btn-3">立即观看</a>
            </section>
            <section v-else class="c-attr-mt">
              <a @click="createOrders()" href="#" title="立即购买" class="comm-btn c-btn-3">立即购买</a>
            </section>
          </section>
        </aside>
        <aside class="thr-attr-box">
          <ol class="thr-attr-ol">
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">购买数</span>
                <br />
                <h6 class="c-fff f-fM mt10">{{ courseDetail.buyCount }}</h6>
              </aside>
            </li>
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">课时数</span>
                <br />
                <h6 class="c-fff f-fM mt10">{{ courseDetail.lessonNum }}</h6>
              </aside>
            </li>
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">浏览数</span>
                <br />
                <h6 class="c-fff f-fM mt10">{{ courseDetail.viewCount }}</h6>
              </aside>
            </li>
          </ol>
        </aside>
        <div class="clear" />
      </div>
      <!-- /课程封面介绍 -->
      <div class="mt20 c-infor-box">
        <article class="fl col-7">
          <section class="mr30">
            <div class="i-box">
              <div>
                <section id="c-i-tabTitle" class="c-infor-tabTitle c-tab-title">
                  <a name="c-i" class="current" title="课程详情">课程详情</a>
                </section>
              </div>
              <article class="ml10 mr10 pt20">
                <div>
                  <h6 class="c-i-content c-infor-title">
                    <span>课程介绍</span>
                  </h6>
                  <div class="course-txt-body-wrap">
                    <section class="course-txt-body">
                      <p v-html="courseDetail.description">
                        {{ courseDetail.description }}
                      </p>
                    </section>
                  </div>
                </div>
                <!-- /课程介绍 -->
                <div class="mt50">
                  <h6 class="c-g-content c-infor-title" id="chapter">
                    <span>课程大纲</span>
                  </h6>
                  <section class="mt20">
                    <div class="lh-menu-wrap">
                      <menu id="lh-menu" class="lh-menu mt10 mr10">
                        <ul>
                          <!-- 文件目录 -->
                          <li
                            v-for="chapter in chapterVideoList"
                            :key="chapter.id"
                            class="lh-menu-stair"
                          >
                            <a
                              :title="chapter.title"
                              href="javascript: void(0)"
                              class="current-1"
                            >
                              <em class="lh-menu-i-1 icon18 mr10" />{{
                                chapter.title
                              }}
                            </a>
                            <ol class="lh-menu-ol" style="display: block">
                              <li
                                v-for="section in chapter.section"
                                :key="section.id"
                                class="lh-menu-second ml30"
                              >
                                <a
                                  :title="section.title"
                                  :href="'/player/' + section.videoSourceId"
                                  target="_blank"
                                >
                                  <span class="fr">
                                    <i class="free-icon vam mr10">免费试听</i>
                                  </span>
                                  <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em
                                  >{{ section.title }}
                                </a>
                              </li>
                            </ol>
                          </li>
                        </ul>
                      </menu>
                    </div>
                  </section>
                </div>
                <!-- /课程大纲 -->
              </article>
            </div>
          </section>
          <!-- 评论--开始 -->
          <div>
            <el-form
              :model="userComment"
              label-width="80px"
              class="commentForm"
            >
              <el-form-item
                label="评论"
                prop="content"
              >
                <el-input
                  type="content"
                  v-model="userComment.content"
                  autocomplete="off"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitComment(userComment)"
                  >发表</el-button
                >
              </el-form-item>
            </el-form>
            <ul class="commentBox">
              <li v-for="comment in comments" :key="comment.id">
                <img :src="comment.avatar" class="avatar" />
                <a>{{ comment.nickname }}：</a>
                <span>{{ comment.content }}</span>
                <span class="date">{{ comment.gmtModified }}</span>
              </li>
            </ul>
            <el-pagination
              layout="prev, pager, next"
              class="pageBox"
              :total="total"
              :page-size="pageSize"
              :current-page="current"
              @current-change="commentsLoad"
            >
            </el-pagination>
          </div>
          <!-- 评论--结束 -->
        </article>
        <aside class="fl col-3">
          <div class="i-box">
            <div>
              <section class="c-infor-tabTitle c-tab-title">
                <a title href="javascript:void(0)">主讲讲师</a>
              </section>
              <section class="stud-act-list">
                <ul style="height: auto">
                  <li>
                    <div class="u-face">
                      <a href="#">
                        <img
                          :src="courseDetail.avatar"
                          width="50"
                          height="50"
                          alt
                        />
                      </a>
                    </div>
                    <section class="hLh30 txtOf">
                      <a class="c-333 fsize16 fl" href="#">{{
                        courseDetail.teacherName
                      }}</a>
                    </section>
                    <section class="hLh20 txtOf">
                      <span class="c-999">{{ courseDetail.intro }}</span>
                    </section>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </aside>
        <div class="clear" />
      </div>
    </section>
    <!-- /课程详情 结束 -->
  </div>
</template>

<script>
import courseApi from "@/api/course";
import commentApi from "@/api/comment";
import cookie from "js-cookie";
import orderApi from "@/api/order";

export default {
  data() {
    return {
      total: -1,
      current: -1,
      page: -1,
      pageSize: 4,
      comments: [],
      courseId: "",
      courseDetail: '',
      chapterVideoList: '',
      isPurchased: false,
      userComment: {
        content: "",
        teacherId: "",
        courseId: "",
        avatar: "",
        nickname: "",
        memberId: "",
      },
    };
  },
  asyncData({ params, error }) {
    return {courseId: params.id}
  },
  created() {
    this.initCourseDetail(this.courseId)
    this.commentsLoad(1);
  },
  methods: {
    //获取课程详情信息
    initCourseDetail(){
      courseApi.getCourseDetail(this.courseId).then((result) => {
        this.courseDetail=result.data.courseDetail,
        this.chapterVideoList=result.data.chapterVideoList,
        this.isPurchased = result.data.isPurchased
    });
    },
    //点击观看按钮跳转到章节视频区域
    scrollToPlay(){
      document.getElementById("chapter").scrollIntoView({
        behavior:"smooth",
        block:"center"
})
    },
    //加载评论
    commentsLoad(current) {
      commentApi
        .getComments(this.courseId, current, this.pageSize)
        .then((result) => {
          this.comments = result.data.commentPage.records;
          this.total = result.data.commentPage.total;
          this.page = result.data.commentPage.page;
          this.current = result.data.commentPage.current;
          this.pageSize = result.data.commentPage.size;
        });
    },
    getUserInfo() {
      return new Promise((resolve,reject) => {
      const userProfile = cookie.get("guli_ucenter");
      if (userProfile) {
        commentApi.getLoginInfo().then((result) => {
          resolve(result);
        });
      } else {
        this.$message({
          message: "评论前请登录",
          type: "warning",
        });
        this.$router.push("/login");
      }
      })
    },
    submitComment() {
      if(this.userComment.content === ''){
        this.$message({
          message: "评论不能为空",
          type: "warning",
        });
        return
      }
      this.userComment.teacherId = this.courseDetail.teacherId;
      this.userComment.courseId = this.courseId;
      this.getUserInfo().then(result => {
         this.userComment.avatar = result.data.userProfile.avatar;
          this.userComment.nickname = result.data.userProfile.nickname;
          this.userComment.memberId = result.data.userProfile.id;
          commentApi.publishComment(this.userComment).then(() => {
        this.$message({
          message: "发表成功",
          type: "success",
        });
        this.userComment.content = "";
        this.commentsLoad(1);
      });
      }) 
    },
    //生成订单
    createOrders(){
      const userProfile = cookie.get("guli_ucenter");
      if (!userProfile) {
        this.$message({
          message: "购买前请先登录",
          type: "warning",
        });
        return
      }
      orderApi.createOrder(this.courseId).then(result => {
        //获取返回的订单号
        //生成订单后跳转到订单页面
        this.$router.push({path: '/order/'+result.data.orderNum })
      })
    }
  },
};
</script>
<style>
.commentBox li * {
  height: 40px;
  line-height: 40px;
  vertical-align: middle;
}
.commentBox li {
  margin-bottom: 10px;
  border-bottom: 1px solid #999;
}
.commentBox li .date {
  float: right;
  font-size: 3px;
  font-weight: 100;
  color: #666;
}
.commentBox li .avatar {
  margin-right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 6px;
}
.pageBox {
  position: relative;
  left: 50%;
  transform: translateX(-20%);
}
.commentForm {
  display: flex;
  justify-content: space-evenly;
  margin: 10px 0;
}
.commentForm input {
  width: 640px;
}
</style>
