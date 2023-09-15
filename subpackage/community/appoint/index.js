// pages/community/appoint/index.js
const $api = require('../../../utils/api.js').API;
const approx = getApp().globalData.approx
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataType: "",
    scrollHeight: null, // 列表容器高度
    no_more: false, // 没有更多数据
    isLoading: false, // 是否正在加载中
    list: [],
    appointData: {
      page: 1,
      pageSize: 10,
      status: ""
    },
    page: 1,
    pageSize: 10,
    totalPages: "",
    currentCommunityOrgId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { currentCommunityOrgId } = options
    this.setData({
      currentCommunityOrgId
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
    this.setListHeight()
    this.getList(false)
  },
  // 动态计算高度
  setListHeight() {
    const systemInfo = wx.getSystemInfoSync()
    const rpx = systemInfo.windowWidth / 750
    const tapHeight = Math.floor(rpx * 150)
    const scrollHeight = systemInfo.windowHeight - tapHeight
    this.setData({
      scrollHeight
    })
  },
  bindHeaderTap(e) {
    let _this = this
    _this.data.appointData.status = e.currentTarget.dataset.type
    _this.setData({
      dataType: e.currentTarget.dataset.type,
      isLoading: true,
      no_more: false,
      orderList: [],
      appointData: _this.data.appointData
    })
    _this.getList(false)
  },
  //获取数据
  getList(isPage) {
    let _this = this
    const data = {
      page: this.data.page,
      pageSize: this.data.pageSize,
      assetType: "sq",
      orgId: this.data.currentCommunityOrgId
    }
    $api.queryAssetBasicInfo(data).then((res) => {
      console.log("res=>", res)
      if (isPage == true) {
        _this.setData({
          list: _this.data.list.concat(res.value.rows),
          totalPages: res.value.totalPages
        })
      } else {
        _this.setData({
          list: res.value.rows,
          totalPages: res.value.totalPages
        })
      }
    })
  },
  details(e) {
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
      url: "/pages/index/approx/index?assetId=" + value.assetId
    })
  },
  // scroll-view触发底部方法
  scrollBotten(e) {
    console.log(e)
    if (this.data.totalPages > this.data.page) {
      this.setData({
        page: this.data.page + 1
      })
      this.getList(true)
    } else {
      // wx.showToast({
      //   title: "没有更多数据了",
      //   icon: "none"
      // })
      this.setData({
        no_more: true
      })
    }
  },
  //预约
  appoint() {
    // wx.showToast({
    //   title: '功能建设中...',
    //   icon: 'none'
    // })
    wx.navigateTo({
      url: "/subpackage/community/appoint/appointList"
    })
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