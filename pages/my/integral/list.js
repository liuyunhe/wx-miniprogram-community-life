const $api = require("../../../utils/api.js").API
Page({
  /**
   * 页面的初始数据
   */
  data: {
    points: "",
    list: [],
    appointData: {
      page: 1,
      pageSize: 10
    },
    totalPages: 1,
    no_more: false, // 没有更多数据
    isLoading: true // 是否正在加载中
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
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
    const points = wx.getStorageSync("points")
    this.setData({
      points
    })
    this.getPointsDetailList()
  },
  setListHeight() {
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = Math.floor(rpx * 320), // tap高度
      scrollHeight = systemInfo.windowHeight - tapHeight // swiper高度
    this.setData({
      scrollHeight
    })
  },

  getPointsDetailList(isPage, page) {
    let _this = this
    page = page || 1
    _this.data.appointData.page = page
    _this.setData({
      appointData: _this.data.appointData
    })
    $api.getPointsDetailList(_this.data.appointData).then((res) => {
      if (res.state) {
        if (isPage == true) {
          _this.setData({
            list: _this.data.list.concat(res.value.rows),
            totalPages: res.value.totalPages,
            isLoading: false
          })
        } else {
          _this.setData({
            list: res.value.rows,
            totalPages: res.value.totalPages,
            isLoading: false
          })
          if (res.value.page === res.value.totalPages) { 
            this.setData({
              no_more: true
            })
          }
        }
      } else {
        wx.showToast({
          title: res.message,
          icon: "none"
        })
      }
    })
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad() {
    // 已经是最后一页
    console.log(11111111111)
    if (this.data.appointData.page >= this.data.totalPages) {
      this.setData({
        no_more: true
      })
      return false
    }
    // 加载下一页列表
    this.getPointsDetailList(true, ++this.data.appointData.page)
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
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})