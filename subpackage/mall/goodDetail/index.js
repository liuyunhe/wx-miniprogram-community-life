// pages/my/newMarket/index.js
const $api = require("../../../utils/api.js").API
const shoppingCart = getApp().globalData.shoppingCart
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    imgNewsData: [],
    goodsDetail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      id: options.id
    })
    this.getStoreGoodsDetal(this.data.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  // 查询商品详情
  getStoreGoodsDetal(id) {
    $api.getStoreGoodsDetal({ id }).then((res) => {
      if (res.state) {
        const sliderImage = res.value.sliderImage ? JSON.parse(res.value.sliderImage) : []
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
        price: this.data.goodsDetail.price,
        image: this.data.goodsDetail.image,
        quantity: 1
      }
    ]
    shoppingCart.list = good
    shoppingCart.totalPrice = this.data.goodsDetail.price
    shoppingCart.totalNum = 1
    console.log(getApp().globalData.shoppingCart)
    wx.navigateTo({
      url: "/subpackage/mall/confirmOrder/index?from=2"
    })
  },

  goGoodComment(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/subpackage/mall/goodDetail/comment?goodsId=${id}`
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
