// pages/service/approxOrder/index.js
const $api = require('../../../utils/api.js').API;
const $getMyDay = require('../../../utils/util.js').getMyDay
const approx = getApp().globalData.approx
const { APPOINT_ADD_TMP_ID } = getApp().globalData.priTmplId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: {},
    assetName: '',
    userName: '',
    isEnter:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  // 预约服务
  appointAdd() {
    let _this = this;
    console.log("appointAdd");
    _this.setData({
      isEnter:true
    });
    wx.requestSubscribeMessage({
      tmplIds: [APPOINT_ADD_TMP_ID],
      success(res) {
        console.log("success=====", res)
        approx.custName = wx.getStorageSync("wechatNickName")
        $api.appointAdd(approx).then((res) => {
          if (res.state) {
            wx.showToast({
              title: "预约成功",
              icon: "success"
            })
            setTimeout(function () {
              _this.setData({
                isEnter: false
              })
              wx.switchTab({
                url: "/pages/index/home/index"
              })
            }, 500)
          } else {
            wx.showToast({
              title: res.message,
              icon: "none"
            })
            _this.setData({
              isEnter: false
            })
          }
        })
      },
      fail(res) {
        $api.appointAdd(approx).then((res) => {
          if (res.state) {
            wx.showToast({
              title: "预约成功",
              icon: "success"
            })
            setTimeout(function () {
              _this.setData({
                isEnter: false
              })
              wx.switchTab({
                url: "/pages/index/home/index"
              })
            }, 500)
          } else {
            wx.showToast({
              title: res.message,
              icon: "none"
            })
            _this.setData({
              isEnter: false
            })
          }
        })
        console.log("fail=====", res)
      },
      complete(res) {
        console.log("complete=====", res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let dataList = approx
    dataList.week = $getMyDay(new Date(dataList.appointDate))
    this.setData({
      assetContent: getApp().globalData.assetContent,
      assetName: dataList.assetName,
      dataList,
      userName: wx.getStorageSync('wechatNickName')
    })
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