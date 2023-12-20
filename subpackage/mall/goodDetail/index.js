// pages/my/newMarket/index.js
const $api = require("../../../utils/api.js").API
const shoppingCart = getApp().globalData.shoppingCart
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    imgNewsData: [],
    goodsDetail: null,
    cartCount: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      id: options.id,
      goodType: options.goodType
    })
    this.getStoreGoodsDetal(this.data.id, this.data.goodType)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getMallChartCount()
  },
  async getMallChartCount() {
    const cartCount = await app.getMallChartCount()
    this.setData({
      cartCount
    })
  },

  handleClickPreview(event) {
    const { index } = event.currentTarget.dataset
    const imageUrls = this.data.imgNewsData.map((item) => item.url)
    wx.previewImage({
      current: imageUrls[index],
      urls: imageUrls
    })
  },

  // 查询商品详情
  getStoreGoodsDetal(id, goodType) {
    let url = ""
    if (goodType == 0) {
      url = "getStoreGoodsDetal"
    } else {
      url = "getStoreJFGoodsDetal"
    }
    $api[url]({ id }).then((res) => {
      if (res.state) {
        const sliderImage = res.value.sliderImage
          ? JSON.parse(res.value.sliderImage)
          : []
        const imgNewsData = sliderImage.map((item) => {
          return {
            url: item.url
          }
        })
        this.setData({
          goodsDetail: res.value,
          imgNewsData
        })
      }
    })
  },

  handleClickBtnService() {
    wx.navigateTo({
      url: `/pages/my/home/feedback?type=good&orgId=${this.data.goodsDetail.orgId}`
    })
  },

  // 加入购物车
  addToChart() {
    if (this.data.goodsDetail.stock < 1) {
      wx.showToast({
        title: "当前库存不足",
        icon: "error",
        duration: 2000
      })
      return
    }
    this.setData({
      goodsDetail: {
        ...this.data.goodsDetail,
        stock: --this.data.goodsDetail.stock
      }
    })
    const custId = wx.getStorageSync("custId")
    const params = {
      custId,
      goodsId: this.data.goodsDetail.goodsId,
      quantity: 1,
      checked: "1"
    }
    $api.addGoodsToChart(params).then((res) => {
      if (res.state) {
        this.getMallChartCount()
        wx.showToast({
          title: "加入购物车成功",
          icon: "success",
          duration: 2000
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: "none",
          duration: 2000
        })
      }
    })
  },

  // 下单
  goOrder() {
    if (this.data.goodsDetail.stock < 1) {
      wx.showToast({
        title: "当前库存不足",
        icon: "error",
        duration: 2000
      })
      return
    }
    const good = [
      {
        goodsId: this.data.goodsDetail.goodsId,
        merchantId: this.data.goodsDetail.merchantId,
        goodsName: this.data.goodsDetail.goodsName,
        price:
          this.data.goodType == 0
            ? this.data.goodsDetail.price
            : this.data.goodsDetail.pointsPrice,
        image: this.data.goodsDetail.image,
        quantity: 1
      }
    ]
    shoppingCart.list = good
    shoppingCart.totalPrice =
      this.data.goodType == 0
        ? this.data.goodsDetail.price
        : this.data.goodsDetail.pointsPrice
    shoppingCart.totalNum = 1
    console.log(getApp().globalData.shoppingCart)
    wx.navigateTo({
      url: `/subpackage/mall/confirmOrder/index?from=2&&goodType=${this.data.goodType}`
    })
  },

  goGoodComment(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/subpackage/mall/goodDetail/comment?goodsId=${id}&&goodType=${this.data.goodType}`
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
