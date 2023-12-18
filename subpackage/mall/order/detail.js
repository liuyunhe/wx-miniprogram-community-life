// subpackage/mall/order/detail.js
const $api = require("../../../utils/api.js").API
const App = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    orderType: "",
    orderDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.id)
    // 订单id
    const { id: orderId, orderType } = options
    this.setData({
      orderId,
      orderType
    })
    this.getOrderDetail(orderId, orderType)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  getOrderDetail(id, orderType) {
    let url = ""
    if (orderType == 0) {
      url = "getOrderDetail"
    } else {
      url = "getJFOrderDetail"
    }
    const data = {
      id
    }
    $api[url](data).then((res) => {
      if (res.state) {
        this.setData({
          orderDetail: res.value
        })
      }
    })
  },

  // 点击评论
  handleClickBtnComment(e) {
    const { orderid, goodsid, goodstype = "0" } = e.currentTarget.dataset
    const { orderType } = this.data
    wx.navigateTo({
      url: `/subpackage/mall/order/comment?orderId=${orderid}&goodsId=${goodsid}&goodsType=${goodstype}&&orderType=${orderType}`
    })
  },

  // 点击再次购买
  handleClickBtnBuyAgain(e) {
    const custId = wx.getStorageSync("custId")
    const { goodsid } = e.currentTarget.dataset
    const params = {
      custId,
      goodsId: goodsid,
      quantity: 1,
      checked: "1"
    }
    $api.addGoodsToChart(params).then((res) => {
      if (res.state) {
        wx.navigateTo({
          url: `/subpackage/mall/shoppingCart/index`
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

  handleCLickBtnPay() {
    const { orderCode } = this.data.orderDetail
    let url = ""
    if (this.data.orderDetail.payStatus == 0) {
      url = "getOrderPaydata"
    } else if (this.data.orderDetail.payStatus == 5) {
      url = "contiuePayOrder"
    }
    $api[url](orderCode).then((res) => {
      if (res.state) {
        const { data_package, orderId } = JSON.parse(res.value)
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
              // const details = {
              //   orderId: orderId,
              //   orderTime: util.dateTime(payData.timeStamp),
              //   realPrice: data.amount
              // }
              _this.triggerEvent("confirmEvent")
              // wx.redirectTo({
              //   url: '/pages/index/home/success?details=' + JSON.stringify(details) + '&dataType=1',
              // })
            }
          },
          fail(err) {
            // console.log(err)
            App.showError("订单未支付", function () {})
          },
          complete(res) {
            console.log(res)
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
