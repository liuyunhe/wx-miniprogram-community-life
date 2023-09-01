// pages/my/home/password.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 表单提交
   */
  saveData: function (e) {
    let _this = this,
      values = e.detail.value;

    // 表单验证
    if (!_this.validation(values)) {
      App.showError(_this.data.error);
      return false;
    }
  },

  /**
   * 表单验证
   */
  validation: function (values) {
    if (values.now_password === '') {
      this.data.error = '当前密码不能为空';
      return false;
    }
    if (values.new_password === '') {
      this.data.error = '新密码不能为空';
      return false;
    }
    if (values.enter_password === '') {
      this.data.error = '确认新密码不能为空';
      return false;
    }
    return true;
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