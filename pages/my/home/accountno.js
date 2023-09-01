// pages/my/home/setup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [{
        id: 1,
        url: '/state/images/shui1.png',
        title: '水费'
      },
      {
        id: 2,
        url: '/state/images/ranqi1.png',
        title: '燃气费'
      },
      {
        id: 3,
        url: '/state/images/reli1.png',
        title: '热力费'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  getPage(e) {
    const id = e.currentTarget.dataset.id;
    if (id == '1') {
      getApp().globalData.payImg = '/state/images/shui1.png'
      getApp().globalData.payName = '水费'
      wx.navigateTo({
        url: '/pages/index/payment/index?type=sf',
      })
    } else if (id == '2') {
      getApp().globalData.payImg = '/state/images/ranqi1.png'
      getApp().globalData.payName = '燃气费'
      wx.navigateTo({
        url: '/pages/index/payment/index?type=rqf',
      })
    } else if (id == '3') {
      getApp().globalData.payImg = '/state/images/reli1.png'
      getApp().globalData.payName = '热力费'
      wx.navigateTo({
        url: '/pages/index/payment/index?type=rlf',
      })
    }
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