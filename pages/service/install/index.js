// pages/index/install/index.js
const $api = require('../../../utils/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    latituge: '',
    longituge: '',
    inpValue: '',
    page: 1,
    pageSize: 10,
    totalPages: '',  //接口返回的总页数
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
    const that = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res)
        that.setData({
          latituge: res.latitude,
          longituge: res.longitude
        })
        that.getList()
      },
      fail(err) {
        that.getList()
      }
    })

  },
  // 搜索
  search() {
    this.setData({
      page: 1
    })
    this.getList()
  },
  // 获取列表接口
  getList() {
    const data = {
      page: this.data.page,
      pageSize: this.data.pageSize,
      queryKey: this.data.inpValue,
      latituge: this.data.latituge,
      longituge: this.data.longituge
    }
    $api.serviceList(data).then(res => {
      if (res.state) {
        res.value.rows.map(item => { 
          item.url = JSON.parse(item.images)[0] ? JSON.parse(item.images)[0].url : ''
        })
        if (this.page > 1) {
          this.setData({
            dataList: this.data.dataList.concat(res.value.rows),
            totalPages: res.value.totalPages
          })
        } else {
          this.setData({
            dataList: res.value.rows,
            totalPages: res.value.totalPages
          })
        }
      }
    })
  },
  // 获取输入框的值
  getValue(e) {
    this.setData({
      inpValue: e.detail.value
    })
  },
  // 去详情
  goDetail(e) {
    console.log(1111111111111)
    wx.navigateTo({
      url: '/pages/service/installDetail/index?serviceid=' + e.currentTarget.dataset.serviceid,
    })
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
    console.log(22222222)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})