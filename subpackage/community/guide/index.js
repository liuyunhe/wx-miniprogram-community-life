// pages/community/notice/index.js
const $api = require('../../../utils/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataType: '',
    scrollHeight: null, // 列表容器高度
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    totalPages: 1,
    // 数据源
    guideList:[],
    pageParam:{
      page: 1,
      pageSize: 10,
      status: ''
    }
  },
  // 跳转至指南详情
  guideDetails(item){
    // console.log("公告数据====>",item.currentTarget.dataset.detail)
    // console.log("item====>",item)
    let detailInfo = item.currentTarget.dataset.detail
     console.log("detailInfo====>",detailInfo)
    wx.navigateTo({
      url: "/subpackage/community/guide/particulars?guideId=" + detailInfo.guideId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const dataType = options.dataType
    if(dataType){
      this.setData({
        dataType
      })
    }
    this.setListHeight();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  /**
   * 下拉到底加载数据
   */
  bindDownLoad() {
    // 已经是最后一页
    if (this.data.pageParam.page >= this.data.totalPages) {
      this.setData({
        no_more: true
      });
      return false;
    }
    // 加载下一页列表
    this.showGuideList(true, ++this.data.pageParam.page);
  },
  /**
   * 设置指南列表高度
   */
  setListHeight() {
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = Math.floor(rpx * 100), // tap高度
      bannerHeight = Math.floor(rpx * 280), // tap高度
      scrollHeight = systemInfo.windowHeight - tapHeight - bannerHeight // swiper高度
    this.setData({
      scrollHeight
    });
  },
  /* 展示指南列表 */
  showGuideList(isPage,pageConfig){
    let _this = this
    let pageParam = null
    if(pageConfig){
      pageParam = pageConfig
    }else{
      pageParam={
        page: 1,
        pageSize: 10,
        status: ''
      }
    }
    $api.getCommunityGuideList(pageParam).then((res)=>{
      let guideListTmp = res.value.rows;
      for(let i=0;i<guideListTmp.length;i++){
        if(guideListTmp[i].content){
          let context = guideListTmp[i].content;
          context = _this.subNoticeContext(context);
          guideListTmp[i].content = context;
        }
      }
      for(let i=0;i<guideListTmp.length;i++){
        if(guideListTmp[i].title){
          let title = guideListTmp[i].title;
          title = _this.subNoticeContext(title);
          guideListTmp[i].title = title;
        }
      }

      if(isPage == true){
        _this.setData({
          guideList: _this.data.guideList.concat(guideListTmp),
          totalPages: res.value.totalPages,
          isLoading: false,
        })
      }else{
        this.setData({
          guideList: guideListTmp
        })
      }
    })
  },

    //截取社区公告信息，多于指定标题字数，省略号显示
    subNoticeContext(noticeTitle) {
      let subSize = 20;
      let noticeTitleSub = '';
      if (noticeTitle && noticeTitle.length <= subSize) {
        noticeTitleSub = noticeTitle;
      } else if (noticeTitle && noticeTitle.length > subSize) {
        noticeTitleSub = noticeTitle.substring(0, subSize) + "...";
      }
      return noticeTitleSub;
    },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.showGuideList(false,this.data.pageParam)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})