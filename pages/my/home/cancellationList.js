const $api = require('../../../utils/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: {},
    qrCode: '',
    listData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      qrCode: decodeURIComponent(options.q)
    })
  },

  getPage(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: "/pages/my/home/cancellationDetails?item=" + JSON.stringify(item)
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
    let _this = this;
    var codeDate = {
      code: _this.data.qrCode,
    }
    $api.queryIsAppointForCode(codeDate).then(res => {
      if (res.state) {
        _this.setData({
          listData: res.value.appointVOS,
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
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