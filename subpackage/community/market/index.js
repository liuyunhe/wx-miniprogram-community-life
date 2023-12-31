const $api = require('../../../utils/api.js').API;
const App = getApp();
const custId = wx.getStorageSync("custId")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataType: "",
    dataTypeAll: "1",
    scrollHeight: null, // 列表容器高度
    listType: "all",
    listAll: [],
    list: [],
    page: 1,
    pageSize: 10,
    appointData: {
      page: 1,
      pageSize: 10,
      status: ""
    },
    appointDataAll: {
      page: 1,
      pageSize: 10,
      status: ""
    },
    totalPagesAll: 1,
    no_more_all: false, // 没有更多数据
    isLoadingAll: true, // 是否正在加载中
    totalPages: 1,
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    baseImageUrl: App.globalData.imgUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setListHeight()
    console.log("dataType=====",this.data.dataType);
    if (this.data.no_more_all) return
    this.appointListAll(false, null, this.data.dataTypeAll)
    if (this.data.no_more) return
    this.appointList(false, null, this.data.dataType)
  },
  handleClickSwitch(e) {
    const {
      type: listType
    } = e.currentTarget.dataset
    this.setData({
      listType
    })
  },
  handleConnect(e) {
    const {
      phone: phoneNumber
    } = e.currentTarget.dataset
    console.log(String(phoneNumber))
    if (!phoneNumber) {
      wx.showToast({
        title: "暂无联系方式",
        icon: "none"
      })
      return
    }
    wx.makePhoneCall({
      phoneNumber: String(phoneNumber)
    })
  },
  appointListAll(isPage, page, state) {
    let _this = this
    page = page || 1
    _this.data.appointDataAll.page = page
    _this.data.appointDataAll.state = state
    _this.setData({
      appointDataAll: _this.data.appointDataAll
    })
    console.log("_this.data.appointDataAll=>", _this.data.appointDataAll)
    $api.getGoodsList(_this.data.appointDataAll).then((res) => {
      if (res.state) {
        res.value.rows.forEach((item) => {
          if (item.goodsImage) {
            item.goodsImage = JSON.parse(item.goodsImage)[0]
          }
        })
        if (isPage == true) {
          _this.setData({
            listAll: _this.data.list.concat(res.value.rows),
            totalPagesAll: res.value.totalPages,
            isLoadingAll: false
          })
        } else {
          _this.setData({
            listAll: res.value.rows,
            totalPagesAll: res.value.totalPages,
            isLoadingAll: false
          })
        }
        console.log("list=====>", _this.data.list)
      } else {
        wx.showToast({
          title: res.message,
          icon: "none"
        })
      }
    })
  },
  appointList(isPage, page, state) {
    let _this = this
    page = page || 1
    _this.data.appointData.page = page
    _this.data.appointData.state = state
    _this.setData({
      appointData: {
        ..._this.data.appointData,
        custId
      }
    })
    console.log("_this.data.appointData=>", _this.data.appointData)
    $api.getGoodsList(_this.data.appointData).then((res) => {
      if (res.state) {
        res.value.rows.forEach((item) => {
          if (item.goodsImage) {
            item.goodsImage = JSON.parse(item.goodsImage)[0]
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
      } else {
        wx.showToast({
          title: res.message,
          icon: "none"
        })
      }
    })
  },
  //进入详情
  details(e) {
    console.log(e)
    let goodsId = e.currentTarget.dataset.item.goodsId
    let state = e.currentTarget.dataset.item.state
    // if (goodsId && state != "3") {
    wx.navigateTo({
      url: "/subpackage/community/market/publish?goodsId=" + goodsId
    })
    // let param = {
    //   id:goodsId
    // }
    // $api.getGoodsDetail(param).then((res)=>{
    //   console.log("666res",res)
    // })
    // }
  },
  detailsAll(e) {
    console.log(e)
    let goodsId = e.currentTarget.dataset.item.goodsId
    let state = e.currentTarget.dataset.item.state
    if (goodsId && state != "3") {
      wx.navigateTo({
        url: `/subpackage/community/market/publish?goodsId=${goodsId}&type=all`
      })
      // let param = {
      //   id:goodsId
      // }
      // $api.getGoodsDetail(param).then((res)=>{
      //   console.log("666res",res)
      // })
    }
  },
  /**
   * 下拉到底加载数据
   */
  bindDownLoadAll() {
    // 已经是最后一页
    if (this.data.appointData.page >= this.data.totalPages) {
      this.setData({
        no_more_all: true
      })
      return false
    }
    // 加载下一页列表
    this.appointListAll(true, ++this.data.appointData.page, this.data.dataTypeAll)
  },
  bindDownLoad() {
    // 已经是最后一页
    if (this.data.appointData.page >= this.data.totalPages) {
      this.setData({
        no_more: true
      })
      return false
    }
    // 加载下一页列表
    this.appointList(true, ++this.data.appointData.page, this.data.dataType)
  },
  //下架商品
  delist(e) {
    console.log(e)
    if (e.currentTarget.dataset.id) {
      let delistParam = {
        goodsId: e.currentTarget.dataset.id,
        state: "3"
      }
      $api.GoodsListUpdate(delistParam).then((res) => {
        console.log(res)
        this.appointList(false, null, this.data.dataType)
      })
    }
  },
  delete(e) {
    console.log(e)
    if (e.currentTarget.dataset.id) {
      let delistParam = {
        goodsId: e.currentTarget.dataset.id,
        state: "4"
      }
      $api.GoodsListUpdate(delistParam).then((res) => {
        console.log(res)
        this.appointList(false, null, this.data.dataType)
      })
    }
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
  //切换顶部tap时的事件
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
    _this.appointList(false, null, e.currentTarget.dataset.type)
  },

  //商品发布  $api.goodPublish
  publish() {
    let pubilshUrl = "/subpackage/community/market/publish"
    wx.navigateTo({
      url: pubilshUrl
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