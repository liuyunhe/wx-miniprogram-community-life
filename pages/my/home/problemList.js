const $api = require('../../../utils/api.js').API;
const approx = getApp().globalData.approx
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataType: "10",
    tanData: [
      {
        id: "10",
        name: "反馈投诉"
      },
      {
        id: "20",
        name: "社区咨询"
      },
      {
        id: "30",
        name: "社区投诉"
      },
      {
        id: "40",
        name: "商城咨询"
      },
      {
        id: "50",
        name: "便民咨询"
      }
    ],
    scrollHeight: null, // 列表容器高度
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    baseImageUrl: App.globalData.imgUrl,
    list: [],
    appointData: {
      page: 1,
      pageSize: 10,
      status: "",
      adviceType: "10"
    },
    totalPages: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setListHeight()
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

  bindHeaderTap(e) {
    let _this = this
    _this.data.appointData.adviceType = e.currentTarget.dataset.id
    _this.setData({
      dataType: e.currentTarget.dataset.id,
      isLoading: true,
      no_more: false,
      orderList: [],
      appointData: _this.data.appointData
    })
    _this.appointList()
  },
  appointList(isPage, page) {
    let _this = this
    page = page || 1
    _this.data.appointData.page = page
    _this.setData({
      appointData: _this.data.appointData
    })
    $api.adviceList(_this.data.appointData).then((res) => {
      if (res.state) {
        res.value.rows.forEach((item) => {
          if (item.adviceImage) {
            item.adviceImage = JSON.parse(item.adviceImage)
          }
        })
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

  questionDetails(e) {
    console.log(e.currentTarget.dataset.detail)
    let adviceId = e.currentTarget.dataset.detail.adviceId
    if (adviceId) {
      wx.navigateTo({
        url: "/pages/my/home/problemDetails?adviceId=" + adviceId
      })
    }
  },

  cancel(e) {
    let _this = this
    var content = ""
    var successStr = ""
    if (e.currentTarget.dataset.status == "4") {
      content = "确认要取消该预约吗？"
      successStr = "取消成功"
    } else {
      content = "确认要删除该预约吗？"
      successStr = "删除成功"
    }
    wx.showModal({
      title: "友情提示",
      content: content,
      success(res) {
        if (res.confirm) {
          _this.appointUpdate(
            e.currentTarget.dataset.id,
            e.currentTarget.dataset.status,
            successStr
          )
          console.log("用户点击确定")
        } else if (res.cancel) {
          console.log("用户点击取消")
        }
      }
    })
  },

  appointUpdate(id, status, successStr) {
    let _this = this
    var upDate = {
      id: id,
      status: status
    }
    $api.appointUpdate(upDate).then((res) => {
      if (res.state) {
        _this.setData({
          list: [],
          isLoading: true,
          no_more: false
        })
        _this.appointList()
        wx.showToast({
          title: successStr
        })
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
    if (this.data.appointData.page >= this.data.totalPages) {
      this.setData({
        no_more: true
      })
      return false
    }
    // 加载下一页列表
    this.appointList(true, ++this.data.appointData.page)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.appointList()
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