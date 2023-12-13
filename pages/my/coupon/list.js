// pages/my/newMarket/index.js
const $api = require("../../../utils/api.js").API
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataType: "0",
    tapData: [
      {
        id: "0",
        name: "未使用"
      },
      {
        id: "1",
        name: "已使用"
      },
      {
        id: "2",
        name: "已失效"
      }
    ],
    scrollHeight: null,
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    list: [],
    pageData: {
      page: 1,
      pageSize: 10,
      status: ""
    },
    totalPages: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this
    if (options.dataType) {
      _this.setData({
        dataType: options.dataType
      })
    } else {
      _this.setData({
        dataType: "0"
      })
    }
    _this.setListHeight()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getCouponList()
  },

  /**
   * 设置商品列表高度
   */
  setListHeight() {
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = Math.floor(rpx * 100), // tap高度
      scrollHeight = systemInfo.windowHeight - tapHeight // swiper高度
    this.setData({
      scrollHeight
    })
  },

  // 切换Tab
  bindHeaderTap(e) {
    let _this = this
    _this.data.pageData.status = e.currentTarget.dataset.id
    _this.setData({
      dataType: e.currentTarget.dataset.id,
      isLoading: true,
      no_more: false,
      orderList: [],
      pageData: _this.data.pageData,
    })
    _this.getCouponList()
  },
  getCouponList(isPage, page) {
    let _this = this
    page = page || 1
    _this.data.pageData.page = page
    _this.setData({
      pageData: _this.data.pageData
    })
    $api.getCouponList(_this.data.pageData).then((res) => {
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
    if (this.data.pageData.page >= this.data.totalPages) {
      this.setData({
        no_more: true
      })
      return false
    }
    // 加载下一页列表
    this.getCouponList(true, ++this.data.pageData.page)
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