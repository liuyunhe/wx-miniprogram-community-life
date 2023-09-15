// pages/service/subscribe/index.js
const $api = require('../../../utils/api.js').API;
const approx = getApp().globalData.approx
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    newsData: [
      { id: 1, name: "咨询列表" },
      { id: 2, name: "未回复咨询" },
      { id: 3, name: "已回复咨询" },
      { id: 4, name: "新增咨询" }
    ],
    isCheck: "",
    dataList: [],
    page: 1,
    pageSize: 10,
    totalPages: "",
    baseImageUrl: App.globalData.imgUrl,
    scrollHeight: "",
    list: [],
    appointData: {
      page: 1,
      pageSize: 10,
      status: ""
    },
    dataType: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setListHeight()
    this.appointList()
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

  appointList(isPage, page) {
    let _this = this
    page = page || 1
    _this.data.appointData.page = page
    _this.data.appointData.adviceType = "20"
    _this.data.appointData.orgId = wx.getStorageSync("orgId")
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
  //新增咨询
  addCounsel() {
    let url = "/pages/my/home/feedback?type=counsel"
    // let url = '/pages/community/question/feedback?type=counsel';
    wx.navigateTo({
      url: url
    })
  },
  //咨询详情
  counselDetails(item) {
    wx.showToast({
      title: "功能建设中...",
      icon: "none"
    })
    // wx.navigateTo({
    //   url: '/pages/community/counsel/details',
    // })
  },
  // 查询字典接口
  getByTypeId() {
    let _this = this
    $api
      .getByTypeId({
        typeId: "1595400173767495680"
      })
      .then((res) => {
        if (res.state) {
          if (_this.data.isCheck == "") {
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
    })
  },
  //切换tab栏
  change(e) {
    let _this = this
    _this.data.appointData.status = e.currentTarget.dataset.type
    _this.setData({
      dataType: e.currentTarget.dataset.type,
      isLoading: true,
      no_more: false,
      orderList: [],
      appointData: _this.data.appointData
    })
    _this.appointList()
  },
  //获取数据
  getList() {
    const data = {
      page: this.data.page,
      pageSize: this.data.pageSize,
      assetType: this.data.isCheck
    }
    $api.queryAssetBasicInfo(data).then((res) => {
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
      url: "/pages/index/approx/index?assetId=" + value.assetId
    })
  },
  // 搜索
  goInstall() {
    getApp().globalData.inpValue = this.data.inpValue
    wx.navigateTo({
      url: "/pages/index/query/index"
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
        title: "没有更多数据了",
        icon: "none"
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

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