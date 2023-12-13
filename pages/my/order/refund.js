const $api = require("../../../utils/api.js").API
const App = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderId: "",
    goodsId: "",
    formData: {},
    orderType: "",
    totalNum: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    let totalNum = ""
    const { orderId, goodsId, type: orderType } = options
    if (orderType == 3 || orderType == 4) totalNum = options.totalNum
    this.setData({
      orderId,
      goodsId,
      orderType,
      totalNum
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.uploadImg = this.selectComponent("#uploadImg")
  },
  handleItemChange(e) {
    let _this = this
    var values = _this.data.formData
    // 表单验证
    if (!_this.validation(values)) {
      App.showError(_this.data.error)
      return false
    }
    values.orderId = _this.data.orderId
    values.refundReasonWapImg = JSON.stringify(e.detail)
    if (this.data.orderType == 1) {
      $api.refundServiceOrder(values).then((res) => {
        if (res.state) {
          wx.showToast({
            title: "提交成功",
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack()
          }, 1000)
        } else {
          wx.showToast({
            title: res.message,
            icon: "none"
          })
        }
      })
    }
    if (this.data.orderType == 3 || this.data.orderType == 4) {
      values.goodsId = _this.data.goodsId
      values.refundReasonWap = ""
      values.custId = wx.getStorageSync("custId")
      values.totalNum = this.data.totalNum
      const url = this.data.orderType == 3 ? "returnOrder" : "returnJFOrder"
      $api[url](values).then((res) => {
        if (res.state) {
          wx.showToast({
            title: "提交成功",
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack()
          }, 1000)
        } else {
          wx.showToast({
            title: res.message,
            icon: "none"
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

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
  onShareAppMessage() {},
  /**
   * 表单提交
   */
  saveData: function (e) {
    console.log("saveData ===>", e)
    let _this = this
    _this.setData({
      formData: e.detail.value
    })
    _this.uploadImg.uploadImg()
  },

  /**
   * 表单验证
   */
  validation: function (values) {
    if (values.refundReasonWapExplain === "") {
      this.data.error = "申请退款原因不能为空"
      return false
    }
    return true
  }
})
