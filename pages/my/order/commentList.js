const $api = require("../../../utils/api.js").API
const $baseUrl = require("../../../utils/api.js").baseUrl
const App = getApp()

Page({
  data: {
    serviceId: null,
    scrollHeight: null,
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    appointData: {
      page: 1,
      pageSize: 5
    },
    totalPages: 1,
    list: [],
    nickName: "",
    avatarUrl: "",
    imgUrl: App.globalData.imgUrl,
    repairId: "",
    stars: [1, 1, 1, 0, 0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let _this = this
    const { serviceId } = option
    this.setData({
      serviceId
    })
    // 设置商品列表高度
    _this.setListHeight()
  },
  onShow: function () {
    this.setData({
      list: [],
      no_more: false,
      isLoading: true,
      totalPages: 1,
      stars: [1, 1, 1, 0, 0]
    })
    this.getCommentList()
  },

  getCommentList: function (isPage, page) {
    let _this = this
    page = page || 1
    _this.data.appointData.page = page
    _this.setData({
      appointData: _this.data.appointData
    })
    const params = {
      serviceId: this.data.serviceId,
      ..._this.data.appointData
    }
    $api.getServiceCommentList(params).then((res) => {
      if (res.state) {
        res.value.rows.map((item) => {
          const star1 = Array(item.commentStart).fill(1)
          const star2 = Array(5 - item.commentStart).fill(0)
          item.starsGroup = [...star1, ...star2]
          item.commentImage = JSON.parse(item.commentImage)
            ? JSON.parse(item.commentImage)
            : []
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

  /**
   * 设置商品列表高度
   */
  setListHeight: function () {
    let _this = this
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight - 10
        })
      }
    })
  },
  /**
   * 下拉到底加载数据
   */
  bindDownLoad: function () {
    // 已经是最后一页
    if (this.data.appointData.page >= this.data.totalPages) {
      this.setData({
        no_more: true
      })
      return false
    }
    // 加载下一页列表
    this.getCommentList(true, ++this.data.appointData.page)
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog")
  },

  showDialog(e) {
    this.setData({
      repairId: e.currentTarget.dataset.item.repairId
    })
    console.log(this.data.repairId)
    this.dialog.showDialog()
  },

  //取消事件
  _cancelEvent() {
    console.log("你点击了取消")
    this.dialog.hideDialog()
  },
  //确认事件
  _confirmEvent() {
    console.log("你点击了确定")
    this.dialog.hideDialog()
    this.setData({
      list: [],
      no_more: false,
      isLoading: true,
      totalPages: 1
    })
    this.getCommentList()
  }
})
