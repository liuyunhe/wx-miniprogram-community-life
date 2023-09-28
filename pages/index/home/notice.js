const $api = require('../../../utils/api.js').API;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    noticeImage: "",
    noticeId: "",
    details: {},
    noticeContent: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      noticeId: options.id
    })
  },

  notice() {
    let _this = this
    var noticeId = {
      id: _this.data.noticeId
    }
    $api.noticeDetail(noticeId).then((res) => {
      _this.data.noticeContent = res.value.noticeContent.replace(
        /\<img/gi,
        '<img style="max-width:100%;height:auto" '
      )
      _this.setData({
        noticeImage: res.value.noticeImage ? JSON.parse(res.value.noticeImage)[0].url:'',
        details: res.value,
        noticeContent: _this.data.noticeContent
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.notice()
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