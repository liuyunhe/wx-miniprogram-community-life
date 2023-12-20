// pages/mall/home/index.js
const $api = require("../../../utils/api.js").API
//获取应用实例
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mallType: "0",
    mallBannerImg: "/state/images/mall_banner_img1.png",
    mallInputValue: "", //输入框的值
    sortData: [],
    sortIconData: [],

    dataList: [],
    cartCount: 0,
    totalPages: 1,
    page: 1,
    pageSize: 10,
    noMoreGoods: false, //是否已经加载完所有商品

    JFdataList: [],
    JFtotalPages: 1,
    JFpage: 1,
    JFpageSize: 10,
    JFnoMoreGoods: false, //是否已经加载完所有商品

    navigate_type: "", //分类类型，是否包含二级分类
    slideWidth: "", //滑块宽
    slideLeft: 0, //滑块位置
    totalLength: "", //当前滚动列表总长
    slideShow: false,
    slideRatio: ""
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getCategoryListById()
    this.getStoreGoodsList()
    this.getStoreJFGoodsList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    const cartCount = await app.getMallChartCount()
    this.setData({
      cartCount
    })
  },

  handleSwithMallType(e) {
    console.log(e)
    const { type: mallType } = e.currentTarget.dataset
    this.setData({
      mallType
    })
  },

  // 查询商品类目
  getCategoryListById() {
    var systemInfo = wx.getSystemInfoSync()
    $api.getCategoryListById({ parentId: 1 }).then((res) => {
      if (res.state) {
        this.setData({
          sortData: res.value,
          windowHeight:
            app.globalData.navigate_type == 1
              ? systemInfo.windowHeight
              : systemInfo.windowHeight - 35,
          windowWidth: systemInfo.windowWidth,
          navigate_type: app.globalData.navigate_type
        })
        //计算比例
        this.getRatio()
      }
    })
  },

  //根据分类获取比例
  getRatio() {
    var self = this
    if (!self.data.sortData || self.data.sortData.length <= 5) {
      this.setData({
        slideShow: false
      })
    } else {
      var _totalLength = self.data.sortData.length * 150 //分类列表总长度
      var _ratio = (230 / _totalLength) * (750 / this.data.windowWidth) //滚动列表长度与滑条长度比例
      var _showLength = (750 / _totalLength) * 230 //当前显示红色滑条的长度(保留两位小数)
      this.setData({
        slideWidth: _showLength,
        totalLength: _totalLength,
        slideShow: true,
        slideRatio: _ratio
      })
    }
  },
  //slideLeft动态变化
  getleft(e) {
    this.setData({
      slideLeft: e.detail.scrollLeft * this.data.slideRatio
    })
  },

  // 查询商品列表
  getStoreGoodsList() {
    const params = {
      page: this.data.page,
      pageSize: this.data.pageSize
    }
    $api.getStoreGoodsList(params).then((res) => {
      if (res.state) {
        this.setData({
          dataList: [...this.data.dataList, ...res.value.rows],
          page: res.value.page,
          totalPages: res.value.totalPages
        })
      }
    })
  },

  // getMallChartCount() {
  //   $api.getMallChartCount().then((res) => {
  //     if (res.state) {
  //       this.setData({
  //         cartCount: res.value
  //       })
  //     }
  //   })
  // },

  // 搜索商品
  goInstall() {
    console.log(this.data.mallInputValue)
    // getApp().globalData.mallInputValue = this.data.mallInputValue
    // wx.navigateTo({
    //   url: '/pages/service/install/index',
    // })
  },
  // 获取输入框的值
  getValue(e) {
    this.setData({
      mallInputValue: e.detail.value
    })
  },

  handleFoucsInput() {
    wx.navigateTo({
      url: `/subpackage/mall/search/sort`
    })
  },

  goMallSort(e) {
    const id = e.currentTarget.dataset.id
    console.log(id)
    // getApp().globalData.sortId = id;
    wx.navigateTo({
      url: `/subpackage/mall/search/sort?categoryId=${id}`
    })
  },

  goGoodDetal(option) {
    const goodType = this.data.mallType
    const id = option.currentTarget.dataset.id
    // getApp().globalData.sortId = id;
    console.log(id)
    wx.navigateTo({
      url: `/subpackage/mall/goodDetail/index?id=${id}&goodType=${goodType}`
    })
  },

  goMallCart() {
    wx.navigateTo({
      url: `/subpackage/mall/shoppingCart/index`
    })
  },

  getStoreJFGoodsList() {
    const params = {
      page: this.data.JFpagepage,
      pageSize: this.data.JFpageSize
    }
    $api.getStoreJFGoodsList(params).then((res) => {
      if (res.state) {
        this.setData({
          JFdataList: [...this.data.JFdataList, ...res.value.rows],
          JFpage: res.value.page,
          JFtotalPages: res.value.totalPages
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
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.mallType == 0) {
      if (this.data.dataList.length === 0) return
      if (this.data.totalPages === this.data.page) {
        console.log("商品列表====已到最后一页")
        return
      } else {
        console.log("商品列表====加载下一页")
        this.setData({
          page: this.data.page + 1
        })
        this.getStoreGoodsList()
      }
    } else {
      if (this.data.JFdataList.length === 0) return
      if (this.data.JFtotalPages === this.data.JFpage) {
        console.log("积分商品列表====已到最后一页")
        return
      } else {
        console.log("积分商品列表====加载下一页")
        this.setData({
          JFpage: this.data.JFpage + 1
        })
        this.getStoreJFGoodsList()
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})
