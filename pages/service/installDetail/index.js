// pages/index/installDetail/index.js
const $api = require('../../../utils/api.js').API;
const payData = getApp().globalData.payData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    html: `<div class="div_class">
    <h1>Title</h1>
    <p class="p">
      Life is&nbsp;<i>like</i>&nbsp;a box of
      <b>&nbsp;chocolates</b>.
    </p>
  </div>`,
    dataList: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res)
        that.getDetail(options.serviceid, res.latitude, res.longitude)
      },
      fail(err) {
        that.getDetail(options.serviceid)
      }
    })

  },
  // 立即下单
  goOrder() {
    payData.serviceId = this.data.dataList.serviceId
    payData.serviceName = this.data.dataList.serviceName
    payData.unitPrice = this.data.dataList.unitPrice
    payData.storeId = this.data.dataList.storeId
    payData.storeName = this.data.dataList.storeName
    payData.merchantId = this.data.dataList.merchantId
    payData.merchantName = this.data.dataList.merchantName
    payData.description = this.data.dataList.supplementaryNotes
    wx.navigateTo({
      url: '/pages/service/order/index'
    })
  },
  // 详情接口
  getDetail(id, latituge, longituge) {
    const data = {
      serviceId: id,
      latituge,
      longituge
    }
    $api.serviceDetail(data).then(res => {
      if (res.state) {
        res.value.attachJson = 'https://wxmini.openunion.cn/eip-portal/file/onlinePreviewController/v1/getFileById_159722923324'
        this.setData({
          dataList: res.value
        })
      }
    })
  },
  //打开地图
  goMap() {
    const that = this
    console.log(that.data.dataList.latituge)
    wx.openLocation({
      latitude: that.data.dataList.latituge,
      longitude: that.data.dataList.longituge,
      scale: 18
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