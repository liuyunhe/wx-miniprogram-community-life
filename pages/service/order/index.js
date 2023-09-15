// pages/index/order/index.js
const $api = require('../../../utils/api.js').API;
var util = require('../../../utils/util.js');
const App = getApp();
const payData = getApp().globalData.payData
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: "",
    time: "",
    payType: [
      {
        id: "1",
        url: "/state/images/yuePay.png",
        title: "余额"
      },
      {
        id: "13",
        url: "/state/images/wxpay.png",
        title: "微信",
        checked: "true"
      }
    ],
    isCheck: "13", //选中状态
    dataList: {}, //地址
    unitPrice: "", //价格
    message: "", //留言
    addressId: "",
    isAddress: false,
    currentWordNumber: 0,
    orderNoteMax: 100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.addressId) {
      this.setData({
        addressId: options.addressId
      })
      // this.getDetail(options.addressId)
    } else {
      // this.defaultAddress()
    }
  },
  bindinput: function (e) {
    var value = e.detail.value
    this.setData({
      message: value
    })
    // 获取输入框内容的长度
    var len = parseInt(value.length)
    //最多字数限制
    if (len > this.data.orderNoteMax) return
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this
    _this.setData({
      unitPrice: payData.unitPrice,
      dataList: {},
      isAddress: false
    })
    if (_this.data.addressId) {
      _this.getDetail(options.addressId)
    } else {
      _this.defaultAddress()
    }
  },
  // 去付款
  goPay() {
    const dataList = this.data.dataList
    console.log(dataList)
    if (!this.data.isAddress) {
      wx.showToast({
        title: "请选择地址",
        icon: "none"
      })
      return
    } else if (!this.data.date) {
      wx.showToast({
        title: "请选择上门日期",
        icon: "none"
      })
      return
    } else if (!this.data.time) {
      wx.showToast({
        title: "请选择上门时间",
        icon: "none"
      })
      return
    }
    const data = {
      serviceId: payData.serviceId,
      serviceName: payData.serviceName,
      // realPrice: payData.unitPrice,
      merId: payData.storeId,
      visitDate: this.data.date + " " + this.data.time + ":00",
      contact: dataList.contact,
      phone: dataList.phone,
      address:
        dataList.province +
        dataList.city +
        dataList.district +
        dataList.address,
      paychannel: dataList.isCheck,
      servicePrice: payData.unitPrice,
      message: this.data.message
    }
    $api.addServiceOrderInfo(data).then((res) => {
      if (res.state) {
        this.payOrder(res.value)
      }
    })
  },
  payOrder(orderId) {
    let _this = this
    const data = {
      sysId: "handy",
      merchantId: payData.storeId,
      merchantName: payData.storeName,
      mcc: "mcc",
      orderId: orderId,
      description: payData.serviceName,
      amount: payData.unitPrice * 100,
      channelId: _this.data.isCheck,
      transactionType: "JSAPI",
      serviceType: "1"
    }
    $api.payHandyOrder(data).then((res) => {
      if (res.state) {
        const payData = JSON.parse(res.value.url)
        console.log(res)
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
              const details = {
                orderId: orderId,
                orderTime: util.dateTime(payData.timeStamp),
                realPrice: data.amount
              }
              wx.redirectTo({
                url:
                  "/pages/index/home/success?details=" +
                  JSON.stringify(details) +
                  "&dataType=1"
              })
            }
          },
          fail(err) {
            // console.log(err)
            App.showError("订单未支付", function () {
              _this.updateServiceOrderInfo(orderId, res.value.url, "3")
            })
          },
          complete(res) {
            console.log(res)
          }
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: "none"
        })
        _this.updateServiceOrderInfo(orderId, "", "2")
      }
    })
  },
  // 更新服务订单信息
  updateServiceOrderInfo(orderId, paymentCode, paystate) {
    $api
      .updateServiceOrderInfo({
        orderId: orderId,
        paymentCode: paymentCode,
        paystate: paystate
      })
      .then((res) => {
        if (res.state) {
          wx.redirectTo({
            url: "/pages/my/order/index?dataType=1"
          })
        }
      })
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
  // 上门日期
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 选择收货人
  goAddress() {
    wx.navigateTo({
      url: "/pages/service/address/index?isTo=" + 1
    })
  },
  // 上门时间
  bindTimeChange(e) {
    this.setData({
      time: e.detail.value
    })
    console.log(e)
  },
  //选择付款方式
  changeImg(e) {
    console.log(e)
    const id = e.currentTarget.dataset.id
    this.setData({
      isCheck: id
    })
  },
  radioChange(e) {
    const payType = this.data.payType
    for (let i = 0, len = payType.length; i < len; ++i) {
      payType[i].checked = payType[i].id === e.detail.value
    }
    console.log(e)
    this.setData({
      payType,
      isCheck: e.detail.value
    })
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