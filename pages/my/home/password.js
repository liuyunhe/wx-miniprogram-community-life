// pages/my/home/password.js
const App = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showNowPassword: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    if (options.type == 1) { 
      this.setData({
        showNowPassword:false
      })
      wx.setNavigationBarTitle({
        title: "设置支付密码"
      })
    }
  },


  /**
   * 表单提交
   */
  saveData: function (e) {
    let _this = this,
      values = e.detail.value

    // 表单验证
    if (!_this.validation(values)) {
      App.showError(_this.data.error)
      return false
    }
    wx.setStorageSync("PAY_PASSWORD", values.new_password)
    wx.showToast({
      title: this.data.showNowPassword ? "修改成功" : "设置成功",
      icon: "success",
      duration: 2000,
      success: () => {
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }
    })
  },

  /**
   * 表单验证
   */
  validation: function (values) {
    const _this = this
    if (values.now_password === "") {
      this.data.error = "当前密码不能为空"
      return false
    }
    if (values.new_password === "") {
      this.data.error = "新密码不能为空"
      return false
    }
    if (values.enter_password === "") {
      this.data.error = "确认新密码不能为空"
      return false
    }
    if (this.data.showNowPassword) { 
      if (values.now_password !== wx.getStorageSync('PAY_PASSWORD')) { 
        this.data.error = "当前密码输入不正确"
        return false
      }
    }
    if (values.enter_password !== values.new_password) {
      this.data.error = "确认密码需和新密码一致"
      return false
    }
    if (
      _this.data.showNowPassword &&
      values.now_password == values.new_password
    ) {
      this.data.error = "新密码不能和旧密码相同"
      return false
    }
    return true
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

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
  onShareAppMessage() {}
})