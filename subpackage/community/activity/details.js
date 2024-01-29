// pages/community/activity/details.js
const $api = require('../../../utils/api.js').API;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    content: "",
    time: "",
    beginDate: "",
    endDate: "",
    createTime: "",
    activityId: "",
    showBtn: false,
    act_info_loaded: false,
    sigle_page: false,
    activityImage: "",
    dataType: "",
    signupBeginDateStr:"",
    signupDeadlineStr:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { activityId, dataType } = options
    this.setData({
      activityId,
      dataType
    })
    var q = wx.getEnterOptionsSync()
    if (q.scene == 1154) {
      // 朋友圈内打开“单页模式”
      this.setData({
        sigle_page: true
      })
    }
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    })
  },

  getActDetail() {
    this.setData({
      act_info_loaded: true
    })
    let param = {
      id: this.data.activityId
    }
    $api.getCommunityActivityDetail(param).then((res) => {
      console.log("详情接口返回：", res)
      if (res.value) {
        const signupDeadline = new Date(res.value.signupDeadline).getTime()
        const signupBeginDate = new Date(res.value.signupBeginDate).getTime()
        const showBtn =
          res.value.enableSignup == 1 && this.data.dataType !== "2"
        this.setData({
          activityId: res.value.activityId,
          title: res.value.title,
          content: res.value.content,
          // time: res.value.time,
          beginDate: res.value.beginDate,
          endDate: res.value.endDate,
          signupDeadlineStr: res.value.signupDeadline,
          signupBeginDateStr: res.value.signupBeginDate,
          createTime: res.value.createTime,
          activityImage: res.value.activityImage
            ? JSON.parse(res.value.activityImage)[0].url
            : "",
          activityId: this.data.activityId,
          showBtn,
          signupDeadline,
          signupBeginDate
        })
      } else {
        wx.showToast({
          title: "未查询到信息",
          icon: "error",
          duration: 2000,
          success: function () {}
        })
      }
    })
  },

  //报名
  activitySignUp() {
    const now = new Date().getTime()
    if (now < this.data.signupBeginDate) {
      wx.showToast({
        title: "未到报名时间",
        icon: "error",
        duration: 2000,
        success: function () {}
      })
    } else if (now > this.data.signupDeadline) {
      wx.showToast({
        title: "报名时间已过",
        icon: "error",
        duration: 2000,
        success: function () {}
      })
    } else {
      console.log("this.activityId", this.data.activityId)
      let _this = this
      wx.navigateTo({
        url:
          "/subpackage/community/activity/signUp?activityId=" +
          _this.data.activityId
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const pageLength = getCurrentPages().length
    console.log(getCurrentPages().length)
    if (pageLength === 1 && !wx.getStorageSync("token")) {
      wx.navigateTo({
        url: "/pages/login/login?type=1"
      })
      return
    }
    this.getActDetail()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: this.data.title,
      path: `/subpackage/community/activity/details?activityId=${this.data.activityId}`,
      imageUrl: this.data.activityImage
    }
  },
  onShareTimeline() {
    return {
      title: this.data.title,
      query: `activityId=${this.data.activityId}`,
      imageUrl: this.data.activityImage
    }
  }
})