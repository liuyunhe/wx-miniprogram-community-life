// pages/service/subscribe/index.js
const $api = require('../../../utils/api.js').API;
const approx = getApp().globalData.approx
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsData: [
      // { id: 1, title: '计划生育' },
      // { id: 2, title: '老龄' },
      // { id: 3, title: '综合治理' },
      // { id: 4, title: '人力资源与技术保障' },
    ],
    isCheck: '',
    dataList: [],
    page: 1,
    pageSize: 10,
    totalPages: '',
    scrollHeight: ''
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
    this.setListHeight()
    this.getByTypeId()
  },
  // 查询字典接口
  getByTypeId() {
    let _this = this;
    $api.getByTypeId({
      typeId: '1595400173767495680'
    }).then(res => {
      if (res.state) {
        if (_this.data.isCheck == '') {
          _this.setData({
            newsData: res.value,
            isCheck: res.value[0].key
          })
        } else {
          _this.setData({
            newsData: res.value,
            isCheck: _this.data.isCheck
          })
        }
        _this.getList()
      }
    })
  },
  // 动态计算高度
  setListHeight() {
    const systemInfo = wx.getSystemInfoSync()
    const rpx = systemInfo.windowWidth / 750
    const tapHeight = Math.floor(rpx * 150)
    const scrollHeight = systemInfo.windowHeight - tapHeight
    this.setData({
      scrollHeight
    });
  },
  //切换tab栏
  change(e) {
    let key = e.currentTarget.dataset.key;
    console.log(key);
    this.setData({
      isCheck: key,
      page: 1
    })
    this.getList()
  },
  //获取数据
  getList() {
    const data = {
      page: this.data.page,
      pageSize: this.data.pageSize,
      assetType: this.data.isCheck
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
    approx.assetTypeName = value.assetTypeName
    approx.storeId = value.storeId
    approx.orgId = value.orgId
    approx.storeName = value.storeName
    approx.assetType = value.assetType
    approx.storeAddress = value.storeAddress
    approx.storeLatituge = value.storeLatituge
    approx.storeLongituge = value.storeLongituge
    approx.linkPhone = value.linkPhone
    approx.businessHours = value.businessHours
    wx.navigateTo({
      url: '/pages/index/approx/index?assetId=' + value.assetId,
    })
  },
  // 搜索
  goInstall() {
    getApp().globalData.inpValue = this.data.inpValue
    wx.navigateTo({
      url: '/pages/index/query/index',
    })
  },
  //获取input的值
  getValue(e) {
    this.setData({
      inpValue: e.detail.value
    })
  },
  // scroll-view触发底部方法
  scrollBotten(e) {
    console.log(e)
    if (this.data.totalPages > this.data.page) {
      this.setData({
        page: this.data.page + 1
      })
      this.getList(this.data.isCheck)
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none'
      })
    }
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