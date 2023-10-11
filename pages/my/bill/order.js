const $api = require('../../../utils/api.js').API;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: null, // 列表容器高度
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    list: [],
    appointData: {
      page: 1,
      pageSize: 5,
      yearMonth: ""
    },
    totalPages: 1,
    month: "",
    typeStr: "筛选",
    array: [
      {
        id: 0,
        name: "水费"
      },
      {
        id: 1,
        name: "电费"
      },
      {
        id: 2,
        name: "燃气费"
      },
      {
        id: 3,
        name: "取暖费"
      }
    ],
    year: "",
    income:"",
    expenditure:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var nowDate = new Date()
    var month =
      nowDate.getMonth() + 1 < 10
        ? "0" + (nowDate.getMonth() + 1)
        : nowDate.getMonth() + 1
    this.setData({
      month: month,
      year: nowDate.getFullYear()
    })
    this.setListHeight()
  },

  bindDateChange(e) {
    var month = e.detail.value.split("-")[1]
    this.setData({
      month: month,
      year: e.detail.value.split("-")[0],
      no_more: false,
      isLoading: true,
      list: []
    })
    this.billList()
    this.getSummary()
  },

  bindPickerChange(e) {
    console.log(e.detail.value)
    this.setData({
      typeStr: this.data.array[e.detail.value].name
    })
  },

  details(e) {
    wx.navigateTo({
      url:
        "/pages/my/bill/details?item=" +
        JSON.stringify(e.currentTarget.dataset.item)
    })
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.billList()
    this.getSummary()
  },

  billList(isPage, page) {
    let _this = this
    page = page || 1
    _this.data.appointData.yearMonth =
      _this.data.year.toString() + _this.data.month
    _this.data.appointData.page = page
    _this.setData({
      appointData: _this.data.appointData
    })
    $api.billList(_this.data.appointData).then((res) => {
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
  getSummary() {
    const _this = this
    const { yearMonth } = _this.data.appointData
    $api.getSummary({ yearMonth }).then((res) => {
      if (res.state) {
        const expenditure = Number(res.value.expenditure / 100).toFixed(2)
        const income = Number(res.value.income / 100).toFixed(2)
        this.setData({
          expenditure,
          income
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
    this.billList(true, ++this.data.appointData.page)
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