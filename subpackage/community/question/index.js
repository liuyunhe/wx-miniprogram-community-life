// pages/service/subscribe/index.js
const $api = require('../../../utils/api.js').API;
const approx = getApp().globalData.approx;
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
    scrollHeight: "",
    baseImageUrl: App.globalData.imgUrl,
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
  //添加投诉
  addQuestion() {
    // let url = '/pages/community/question/feedback?type=question';
    let url = "/pages/my/home/feedback?type=question"
    wx.navigateTo({
      url: url
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
  appointList(isPage, page) {
    let _this = this
    page = page || 1
    _this.data.appointData.page = page
    _this.data.appointData.adviceType = "30"
    _this.data.appointData.orgId = wx.getStorageSync("orgCode")
    _this.setData({
      appointData: _this.data.appointData
    })
    console.log("_this.data.appointData=>", _this.data.appointData)
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
        console.log("list=====>", _this.data.list)
        _this.data.list.forEach((element) => {
          console.log("type of element.adviceImage", typeof element.adviceImage)
          // console.log("type of element.adviceImage",JSON.parse(element.adviceImage))
          console.log(App.globalData.imgUrl)
        })
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
    approx.orgId = value.orgId
    approx.storeId = value.storeId
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