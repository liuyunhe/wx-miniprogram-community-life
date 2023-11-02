// pages/mall/confirmOrder/index.js
const $api = require("../../../utils/api.js").API
var util = require("../../../utils/util.js")
const App = getApp()
const shoppingCart = getApp().globalData.shoppingCart
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataList: {}, //地址
    isAddress: false,
    addressId: "",
    goodList: [], //商品列表
    totalPrice: 0,
    totalNum: 0,
    showCashier: false,
    payChannelType: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.addressId) {
      this.setData({
        addressId: options.addressId
      })
    }
    this.setData({
      from: options.from
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
    let _this = this
    _this.setData({
      dataList: {},
      isAddress: false
    })
    if (_this.data.addressId) {
      _this.getDetail(options.addressId)
    } else {
      _this.defaultAddress()
    }
    console.log(shoppingCart)
    this.setData({
      goodList: shoppingCart.list,
      totalPrice: shoppingCart.totalPrice,
      totalNum: shoppingCart.totalNum
    })
  },
  handleClickPay() {
    this.setData({
      showCashier: true
    })
  },
  handleChoosePayType(e) {
    const payChannelType = e.detail
    this.setData({
      payChannelType
    })
    this.handleAddStoreOrder()
  },
  // 重新选择地址时获取地址详情接口
  getDetail(addressId) {
    $api
      .addressDetail({
        addressId: addressId
      })
      .then((res) => {
        console.log(res)
        if (res.state) {
          this.setData({
            dataList: res.value
          })
          console.log(res.value)
        }
      })
  },
  // 获取默认地址接口
  defaultAddress() {
    let _this = this
    $api.defaultAddress().then((res) => {
      if (res.state) {
        if (res.hasOwnProperty("value")) {
          _this.setData({
            dataList: res.value,
            isAddress: true
          })
        } else {
          _this.setData({
            isAddress: false
          })
        }
        console.log("地址====", _this.data.dataList.length)
      }
    })
  },

  // 选择收货人
  goAddress() {
    wx.navigateTo({
      url: "/pages/service/address/index?isTo=" + 1
    })
  },

  //减少商品数量
  handleSubtractGoodNum(e) {
    this.checkQuantity(e, "subtract")
  },

  // 增加商品数量
  handleAddGoodNum(e) {
    this.checkQuantity(e, "add")
  },

  checkQuantity(e, type) {
    const goodsId = e.currentTarget.dataset.id
    console.log(goodsId)
    const goodList = this.data.goodList.map((item) => {
      if (item.goodsId === goodsId) {
        if (type === "add") {
          item.quantity++
        } else {
          if (item.quantity === 1) {
            // 删除商品
            wx.showToast({
              title: "商品数量不能为0！",
              icon: "none",
              duration: 2000
            })
          } else {
            item.quantity--
          }
        }
      }
      return item
    })
    this.setData({
      goodList
    })
    this.checkTotalPrice()
  },

  checkTotalPrice() {
    let totalPrice = 0
    let totalNum = 0
    this.data.goodList.forEach((element) => {
      totalPrice += element.price * element.quantity
      totalNum += element.quantity
    })
    this.setData({
      totalPrice,
      totalNum
    })
  },

  handleAddStoreOrder() {
    const custId = wx.getStorageSync("custId")
    const { contact, phone, address } = this.data.dataList
    const info = {
      custId,
      totalNum: this.data.totalNum,
      totalPrice: this.data.totalPrice,
      contact,
      phone,
      address,
      payPrice: this.data.totalPrice,
      payType: this.data.payChannelType
    }
    const shopMap = new Map()
    this.data.goodList.map((item) => {
      const { goodsId, quantity, price, merchantId } = item
      if (shopMap.has(merchantId)) {
        const goods = shopMap.get(merchantId)
        goods.push({
          goodsId,
          totalNum: quantity,
          totalPrice: price * quantity
        })
      } else {
        shopMap.set(merchantId, [
          {
            goodsId,
            totalNum: quantity,
            totalPrice: price * quantity
          }
        ])
      }
    })
    const params = [...shopMap.values()].map((item) => {
      return {
        ...info,
        orderGoodsDTOList: item
      }
    })
    const _this = this
    $api.addStoreOrder(params).then((res) => {
      if (res.state) {
        wx.showToast({
          title: "下单成功！",
          icon: "success",
          duration: 2000,
          success: () => {
            console.log(_this)
            if (_this.data.from === "1") {
              // 购物车状态更新
              const cartIds = _this.data.goodList.map((item) => item.cartId)
              console.log(params)
              $api.updateChartAfterPlaceOrder(cartIds).then((res) => {
                if (res.state) {
                }
              })
            }
            const { data_package, orderId, state } = res.value
            if (state === "100") {
              setTimeout(() => { 
                wx.redirectTo({
                  url: "/pages/my/order/index?dataType=3"
                })
              },2000)
            } else { 
              const payData = JSON.parse(data_package)
              console.log(payData, orderId)
              wx.requestPayment({
                timeStamp: payData.timeStamp,
                nonceStr: payData.nonceStr,
                package: payData.package,
                signType: payData.signType,
                paySign: payData.paySign,
                appId: payData.appId,
                success(res) {
                  console.log(res)
                  if (res.errMsg == "requestPayment:ok") {
                    // 返回商城列表
                    wx.redirectTo({
                      url: "/pages/my/order/index?dataType=3"
                    })
                  }
                },
                fail(err) {
                  // console.log(err)
                  App.showError("订单未支付", function () {
                    wx.redirectTo({
                      url: "/pages/my/order/index?dataType=3"
                    })
                  })
                },
                complete(res) {
                  console.log(res)
                }
              })
            }
            
          }
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

  //删除商品
  deleteGoodInChart(id) {
    const idList = [id]
    $api.deleteGoodInChart(idList).then((res) => {
      if (res.state) {
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
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})
