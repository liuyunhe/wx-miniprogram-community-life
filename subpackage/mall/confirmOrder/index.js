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
    goodType: "0",
    dataList: {}, //地址
    isAddress: false,
    addressId: "",
    goodList: [], //商品列表
    totalPrice: 0,
    totalNum: 0,
    showCashier: false,
    payChannelType: "",
    showYHQ: false,
    totalPriceMap: null,
    couponList: [],
    descountNum: 0,
    PAY_ORDER_SUCCESS: false //是否支付成功
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
    if (options.goodType) {
      this.setData({
        goodType: options.goodType
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
    if (this.data.PAY_ORDER_SUCCESS) {
      this.setData({
        PAY_ORDER_SUCCESS:false
      })
      // 返回商城列表
      wx.redirectTo({
        url: "/pages/my/order/index?dataType=3"
      })
    }
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

    this.buildTotalPriceMap()
    this.getShopCouponList()
    console.log(getCurrentPages())
  },
  // 建立店铺ID-店铺商品总价Map
  buildTotalPriceMap() {
    const totalPriceMap = new Map()
    this.data.goodList.map((item) => {
      if (totalPriceMap.has(item.merchantId)) {
        const totalPrice = totalPriceMap.get(item.merchantId)
        totalPrice += item.price * item.quantity
      } else {
        totalPriceMap.set(item.merchantId, item.price * item.quantity)
      }
    })
    this.setData({ totalPriceMap })
    console.log(this.data.totalPriceMap)
  },
  getShopCouponList() {
    const _this = this
    const totalPriceMap = this.data.totalPriceMap
    const ids = [...totalPriceMap.keys()]
    $api.getShopCouponList({ ids }).then((res) => {
      if (res.state) {
        this.formatCoupon(res.value)
      } else {
        wx.showToast({
          title: res.message,
          icon: "none"
        })
      }
    })
  },
  // 优惠券列表处理
  formatCoupon(couponList) {
    const totalPriceMap = this.data.totalPriceMap
    this.setData({
      couponList: couponList.map((item) => {
        let upwardsMinPrice = true
        if (item.useMinPrice) {
          upwardsMinPrice =
            totalPriceMap.get(item.merchantId) > item.useMinPrice
        }
        const active =
          totalPriceMap.get(item.merchantId) > item.couponPrice &&
          upwardsMinPrice
        return {
          ...item,
          checked: active,
          active
        }
      })
    })
    let descountNum = 0
    this.data.couponList.map((item) => {
      if (item.checked) {
        descountNum += item.couponPrice
      }
    })
    this.setData({
      descountNum
    })
  },
  // 优惠券组件提交触发
  handleChooseCoupon({ detail: { list, descount } }) {
    this.setData({
      showYHQ: false,
      couponList: list,
      descountNum: descount
    })
  },
  // 点击下单调出收银台
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

  handleClickPayJF() {
    const custId = wx.getStorageSync("custId")
    const { contact, phone, address } = this.data.dataList
    const info = {
      custId,
      totalNum: this.data.totalNum,
      totalPointsPrice: this.data.totalPrice,
      payPointsPrice: this.data.totalPrice,
      contact,
      phone,
      address
    }
    const orderGoodsTmpDTOList = this.data.goodList.map((item) => {
      const { goodsId, quantity, price } = item
      return {
        goodsId,
        totalNum: quantity,
        totalPrice: price * quantity
      }
    })
    const params = { ...info, orderGoodsTmpDTOList }
    const _this = this
    $api.addJFOrder(params).then((res) => {
      if (res.state) {
        wx.showToast({
          title: "下单成功！",
          icon: "success",
          duration: 2000,
          success: () => {
            setTimeout(() => {
              wx.redirectTo({
                url: "/pages/my/order/index?dataType=4"
              })
            }, 2000)
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
    const goodList = this.data.goodList.map((item) => {
      if (item.goodsId === goodsId) {
        const totalPriceMap = this.data.totalPriceMap
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
        totalPriceMap.set(item.merchantId, item.quantity * item.price)
        console.log(totalPriceMap)
        this.setData({ totalPriceMap })
        this.formatCoupon(this.data.couponList)
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
      contact,
      phone,
      address,
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
          totalPrice: price * quantity,
          merchantId
        })
      } else {
        shopMap.set(merchantId, [
          {
            goodsId,
            totalNum: quantity,
            totalPrice: price * quantity,
            merchantId
          }
        ])
      }
    })
    const params = [...shopMap.values()].map((item) => {
      // 找到选中的优惠券（一个店铺仅有一张的情况）
      const coupon = this.data.couponList.find((coupon) => {
        console.log(coupon.merchantId, item)
        return coupon.merchantId === item[0].merchantId
      })
      console.log(coupon)
      const couponIssueId = coupon
        ? coupon.checked
          ? coupon.couponIssueId
          : ""
        : ""
      const couponPrice = coupon
        ? coupon.checked
          ? coupon.couponPrice
          : 0
        : ""
      let payPrice = 0
      let totalPrice = 0
      item.forEach((i) => {
        payPrice += i.totalPrice
      })
      // 商品总价
      totalPrice = payPrice
      // 扣减优惠券金额
      payPrice -= couponPrice
      return {
        ...info,
        totalNum: item.length,
        totalPrice,
        payPrice,
        couponIssueId,
        orderGoodsDTOList: item
      }
    })
    console.log(params)
    const _this = this
    $api.addStoreOrder(params).then((res) => {
      if (res.state) {
        wx.showToast({
          title: "下单成功！",
          icon: "success",
          duration: 1000,
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
              }, 2000)
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
                    _this.setData({
                      PAY_ORDER_SUCCESS: true
                    })
                    // wx.redirectTo({
                    //   url: "/pages/my/order/index?dataType=3"
                    // })
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

  handleShowYHQ() {
    this.setData({
      showYHQ: true
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
