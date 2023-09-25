// pages/login/scan.js
const $api = require("../../utils/api.js").API
const App = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: null, // 列表容器高度
    list: [],
    qrCode: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const qrCode = decodeURIComponent(options.qrCode)
    console.log(qrCode)
    this.setData({
      qrCode
    })
    this.setListHeight()
    this.getLogin()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  getLogin() {
    $api.getQRUserInfo({ qrCode: this.data.qrCode }).then((res) => {
      if (res.state) {
        console.log("getQRUserInfo==>", res)
        this.setData({
          list: res.value || []
        })
      } else {
        wx.showModal({
          title: "提示",
          content: res.message,
          showCancel: false,
          confirmColor: "#26a886",
          success(res) {}
        })
      }
    })
  },

  handleClickLogin(e) {
    const { account: accountNo } = e.currentTarget.dataset
    const params = {
      qrCode: this.data.qrCode,
      accountNo
    }
    $api.confirmQRLogin(params).then((res) => {
      if (res.state) {
        console.log(res)
        wx.showToast({
          title: "登录成功!",
          icon: "success",
          duration: 2000,
          success() {
            setTimeout(function () {
              wx.navigateBack()
            }, 2000)
          }
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: "none"
        })
      }
    })
  },

  // 动态计算高度
  setListHeight() {
    const systemInfo = wx.getSystemInfoSync()
    const rpx = systemInfo.windowWidth / 750
    const tapHeight = Math.floor(rpx * 200)
    console.log("systemInfo ===>", systemInfo)
    console.log("tapHeight ===>", tapHeight)
    const scrollHeight = systemInfo.windowHeight - tapHeight
    this.setData({
      scrollHeight
    })
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
  onShareAppMessage() {}
})