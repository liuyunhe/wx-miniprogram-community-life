// pages/my/home/card.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList: [{
        id: 0,
        img: '/state/images/zs-logo.png',
        name: '招商银行',
        type: '0',
        card_type: '储蓄卡',
        number:'6214****8977'
      },
      {
        id: 1,
        img: '/state/images/js-logo.png',
        name: '建设银行',
        type: '1',
        card_type: '储蓄卡',
        number:'6225****0056'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: "银行卡("+this.data.cardList.length+")",
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