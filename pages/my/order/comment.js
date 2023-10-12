const $api = require("../../../utils/api.js").API
const App = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderId: null, // 订单id
    serviceId: null, // 服务id
    formData: {},
    type: "",
    stars: [1, 1, 1, 1, 1],
    starsNum: 5,
    isflag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { orderId, serviceId } = options
    this.setData({
      orderId,
      serviceId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.uploadImg = this.selectComponent("#uploadImg")
  },
  change_star(e) {
    const index = e.currentTarget.dataset.index
    const num = this.data.starsNum
    console.log(index, num)
    if (this.data.stars[index] === 1 && num === index + 1) {
      this.setData({
        stars: [0, 0, 0, 0, 0],
        starsNum: 0
      })
    } else {
      const star1 = Array(index + 1).fill(1)
      const star2 = Array(5 - (index + 1)).fill(0)
      const stars = [...star1, ...star2]
      this.setData({
        stars,
        starsNum: stars.reduce((total, current) => total + current, 0)
      })
    }
  },
  handleItemChange(e) {
    let _this = this
    var values = _this.data.formData
    values.commentImage = e ? JSON.stringify(e.detail) : ""
    values.commentStart = this.data.starsNum
    values.custId = wx.getStorageSync("custId")
    values.serviceId = this.data.serviceId
    values.orderId = this.data.orderId
    values.isAnonymity = this.data.isflag ? "1" : "0"

    // 表单验证
    if (!_this.validation(values)) {
      App.showError(_this.data.error)
      return false
    }
    console.log(values)
    $api.addServiceComment(values).then((res) => {
      if (res.state) {
        wx.showToast({
          title: "提交成功",
          duration: 2000,
          success: () => {
            setTimeout(() => {
              wx.navigateBack()
            }, 2000)
          }
        })
      } else {
        wx.showToast({
          title: res.message,
          duration: 2000,
          icon: "none",
          success: () => {
            setTimeout(() => {
              wx.navigateBack({ delta: 2 })
            }, 2000)
          }
        })
      }
    })
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
    if (values.commentContent === "") {
      this.data.error = "评价内容不能为空"
      return false
    }
    return true
  }
})
