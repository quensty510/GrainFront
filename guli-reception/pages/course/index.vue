<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- /课程列表 开始 -->
    <section class="container">
      <header class="comm-title">
        <h2 class="fl tac">
          <span class="c-333">全部课程</span>
        </h2>
      </header>
      <section class="c-sort-box">
        <section class="c-s-dl">
          <dl>
            <dt>
              <span class="c-999 fsize14">课程类别</span>
            </dt>
            <dd class="c-s-dl-li">
              <ul class="clearfix">
                <li :class="{active:oneIndex == -1}">
                  <a title="全部" href="#" @click="queryAll()">全部</a>
                </li>
                <li v-for="(subject,index) in subjectNestedList" :key="index" :class="{active:oneIndex == index}">
                  <a :title="subject.title" href="#" @click="querySubSubject(subject,index)">{{ subject.title }}</a>
                </li>
              </ul>
            </dd>
          </dl>
          <dl>
            <dt>
              <span class="c-999 fsize14"/>
            </dt>
            <dd class="c-s-dl-li">
              <ul class="clearfix">
                <li v-for="(item,index) in subSubjectList" :key="index" :class="{active:twoIndex == index}">
                  <a :title="item.title" href="#" @click="querySubject(item.id,index)">{{ item.title }}</a>
                </li>
              </ul>
            </dd>
          </dl>
          <div class="clear"/>
        </section>
        <div class="js-wrap">
          <section class="fr">
            <span class="c-ccc">
              <i class="c-master f-fM">1</i>/
              <i class="c-666 f-fM">1</i>
            </span>
          </section>
          <section class="fl">
            <ol class="js-tap clearfix">
              <li :class="{'current bg-orange':buyCountSort!=''}">
                <a title="销量" href="javascript:void(0);" @click="searchBuyCount()">销量
                  <span :class="{hide:buyCountSort==''}">↓</span>
                </a>
              </li>
              <li :class="{'current bg-orange':gmtCreateSort!=''}">
                <a title="最新" href="javascript:void(0);" @click="searchGmtCreate()">最新
                  <span :class="{hide:gmtCreateSort==''}">↓</span>
                </a>
              </li>
              <li :class="{'current bg-orange':priceSort!=''}">
                <a title="价格" href="javascript:void(0);" @click="searchPrice()">价格&nbsp;
                  <span :class="{hide:priceSort==''}">↓</span>
                </a>
              </li>
            </ol>
          </section>
        </div>
        <div class="mt40">
          <!-- /无数据提示 开始-->
          <section v-if="data.total == 0" class="no-data-wrap">
            <em class="icon30 no-data-ico">&nbsp;</em>
            <span class="c-666 fsize14 ml10 vam">没有相关数据，小编正在努力整理中...</span>
          </section>
          <!-- /无数据提示 结束-->
          <article v-if="data.total > 0" class="comm-course-list">
            <ul id="bna" class="of">
              <li v-for="item in data.items" :key="item.id">
                <div class="cc-l-wrap">
                  <section class="course-img">
                    <img :src="item.cover" :alt="item.title" class="img-responsive">
                    <div class="cc-mask">
                      <a :href="'/course/' + item.id" title="开始学习" class="comm-btn c-btn-1">开始学习</a>
                    </div>
                  </section>
                  <h3 class="hLh30 txtOf mt10">
                    <a :title="item.title" :href="'/course/' + item.id" class="course-title fsize18 c-333">{{ item.title }}</a>
                  </h3>
                  <section class="mt10 hLh20 of">
                    <span v-if="Number(item.price) === 0" class="fr jgTag bg-green">
                      <i class="c-fff fsize12 f-fA">免费</i>
                    </span>
                    <span class="fl jgAttr c-ccc f-fA">
                      <i class="c-999 f-fA">{{ item.viewCount }}人学习</i>                      |
                      <i class="c-999 f-fA">9634评论</i>
                    </span>
                  </section>
                </div>
              </li>
            </ul>
            <div class="clear"/>
          </article>
        </div>
        <!-- 公共分页 开始 -->
        <div>
          <div class="paging">
            <!-- undisable这个class是否存在，取决于数据属性hasPrevious -->
            <a
              :class="{undisable: !data.hasPrevious}"
              href="#"
              title="首页"
              @click.prevent="gotoPage(1)">首</a>
            <a
              :class="{undisable: !data.hasPrevious}"
              href="#"
              title="前一页"
              @click.prevent="gotoPage(data.current-1)">&lt;</a>
            <a
              v-for="page in data.pages"
              :key="page"
              :class="{current: data.current == page, undisable: data.current == page}"
              :title="'第'+page+'页'"
              href="#"
              @click.prevent="gotoPage(page)">{{ page }}</a>
            <a
              :class="{undisable: !data.hasNext}"
              href="#"
              title="后一页"
              @click.prevent="gotoPage(data.current+1)">&gt;</a>
            <a
              :class="{undisable: !data.hasNext}"
              href="#"
              title="末页"
              @click.prevent="gotoPage(data.pages)">末</a>
            <div class="clear"/>
          </div>
        </div>
        <!-- 公共分页 结束 -->
      </section>
    </section>
    <!-- /课程列表 结束 -->
  </div>
</template>
<script>
import courseApi from '@/api/course'
export default {
  data() {
    return {
      page: 1,
      data: {},
      subjectNestedList: [], // 一级分类列表
      subSubjectList: [], // 二级分类列表
      queryObject: {}, // 查询表单对象
      oneIndex: -1,
      twoIndex: -1,
      buyCountSort: '',
      gmtCreateSort: '',
      priceSort: ''
    }
  },
  created() {
    this.initCourseListFirst()
    this.initCourseTree()
  },
  methods: {
    // 查询第一页数据
    initCourseListFirst() {
      courseApi.getCourseList(1, 8, this.queryObject).then(result => {
        this.data = result.data
      })
    },
    // 查询课程分类
    initCourseTree() {
      courseApi.getCourseTree().then(result => {
        this.subjectNestedList = result.data.list
      })
    },
    // 分页切换方法
    gotoPage(page) {
      // if (page !== this.data.current && page > 0 && page <= this.data.pages) {
      courseApi.getCourseList(page, 8, this.queryObject).then(result => {
        this.data = result.data
      })
      // }
    },
    // 查询一级分类对应的二级分类
    querySubSubject(parentSubject, index) {
      this.oneIndex = index
      this.twoIndex = -1
      this.subSubjectList = parentSubject.children
      this.queryObject = {}
      this.queryObject.subjectParentId = parentSubject.id
      this.gotoPage(1)
    },
    querySubject(subjectId, index) {
      this.twoIndex = index
      this.queryObject.subjectId = subjectId
      this.gotoPage(1)
    },
    queryAll() {
      this.oneIndex = -1
      this.twoIndex = -1
      this.subSubjectList = {}
      this.queryObject = {}
      this.buyCountSort = ''
      this.gmtCreateSort = ''
      this.priceSort = ''
      this.gotoPage(1)
    },
    // 销量排序
    searchBuyCount() {
      this.buyCountSort = '1'
      this.gmtCreateSort = ''
      this.priceSort = ''

      this.queryObject.buyCountSort = this.buyCountSort
      this.queryObject.gmtCreateSort = this.gmtCreateSort
      this.queryObject.priceSort = this.priceSort

      this.gotoPage(1)
    },
    // 时间排序
    searchGmtCreate() {
      this.buyCountSort = ''
      this.gmtCreateSort = '1'
      this.priceSort = ''

      this.queryObject.buyCountSort = this.buyCountSort
      this.queryObject.gmtCreateSort = this.gmtCreateSort
      this.queryObject.priceSort = this.priceSort

      this.gotoPage(1)
    },
    // 价格排序
    searchPrice() {
      this.buyCountSort = ''
      this.gmtCreateSort = ''
      this.priceSort = '1'

      this.queryObject.buyCountSort = this.buyCountSort
      this.queryObject.gmtCreateSort = this.gmtCreateSort
      this.queryObject.priceSort = this.priceSort

      this.gotoPage(1)
    }
  }
}
</script>
<style>
.img-responsive{
  width: 280px;
  height: 150px;
}
.active {
    background: #bdbdbd;
  }
  .hide {
    display: none;
  }
  .show {
    display: block;
  }
</style>
