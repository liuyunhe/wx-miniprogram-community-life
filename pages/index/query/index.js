// pages/index/query/index.js
const $api = require('../../../utils/api.js').API;
const approx = getApp().globalData.approx
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [
      { assetOrgName: '哈哈哈', assetOrgAddress: '山东省', assetBasicVOList: [{ assetName: '11111111111' }] }
    ],
    inpValue: '',
    page: 1,
    pageSize: 10,
    totalPages: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      inpValue: getApp().globalData.inpValue
    })
    this.getList()
  },
  //获取数据
  getList() {
    const data = {
      page: this.data.page,
      pageSize: this.data.pageSize,
      queryKey: this.data.inpValue
    }
    $api.queryAssetBasicInfo(data).then(res => {
      if (res.state) {
        this.setData({
          dataList: res.value.rows,
          totalPages: res.value.totalPages
        })
      }
    })
  },
  // 选择预约服务
  goApprox(e) {
    console.log(e)
    const value = e.currentTarget.dataset.value
    getApp().globalData.assetContent = value.assetContent
    approx.assetName = value.assetName
    approx.appointOrgId = value.assetOrgId
    approx.appointOrgName = value.assetOrgName
    approx.assetType = value.assetType
    wx.navigateTo({
      url: '/pages/index/approx/index?assetId=' + value.assetId,
    })
  },
  //获取input的值
  getValue(e) {
    this.setData({
      inpValue: e.detail.value
    })
  },
  // 搜索
  search() {
    this.setData({
      page: 1
    })
    this.getList()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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