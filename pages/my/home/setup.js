// pages/my/home/setup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [
      // {
      //   id: 0,
      //   url: '/state/images/zfmm.png',
      //   title: '支付密码'
      // },
      {
        id: 1,
        url: '/state/images/dizhi.png',
        title: '我的地址'
      },
      // {
      //   id: 2,
      //   url: '/state/images/card.png',
      //   title: '银行卡'
      // },
      {
        id: 3,
        url: '/state/images/fkts.png',
        title: '意见反馈'
      },
      {
        id: 4,
        url: '/state/images/gywm.png',
        title: '关于我们'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  getPage(e) {
    if (e.currentTarget.dataset.id == 0) {
      wx.navigateTo({
        url: '/pages/my/home/password',
      })
    } else if (e.currentTarget.dataset.id == 1) {
      wx.navigateTo({
        url: '/pages/service/address/index?isTo=' + 0,
      })
    } else if (e.currentTarget.dataset.id == 2) {
      wx.navigateTo({
        url: '/pages/my/home/card',
      })
    } else if (e.currentTarget.dataset.id == 3) {
      wx.navigateTo({
        url: '/pages/my/home/feedback',
      })
    } else if (e.currentTarget.dataset.id == 4) {
      wx.navigateTo({
        url: '/pages/my/home/about',
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