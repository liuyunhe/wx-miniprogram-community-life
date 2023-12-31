var util = require("../../utils/util.js")
const $api = require("../../utils/api.js").API
const App = getApp()
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 评价id
    orderId: {
      // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: "" // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    merchantId: {
      // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: "" // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    merchantName: {
      // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: "" // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    description: {
      // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: "" // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗标题
    title: {
      // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: "标题" // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗取消按钮文字
    cancelText: {
      type: String,
      value: "取消"
    },
    // 弹窗确认按钮文字
    confirmText: {
      type: String,
      value: "确定"
    }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    isShow: false,
    amount: 0,
    showCashier: false
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    /*
     * 公有方法
     */

    //隐藏弹框
    hideDialog() {
      this.setData({
        isShow: false
      })
    },
    areaInput(e) {
      this.setData({
        amount: e.detail.value
      })
      console.log(e)
    },
    //展示弹框
    showDialog() {
      this.setData({
        isShow: true
      })
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _cancelEvent() {
      //触发取消回调
      this.triggerEvent("cancelEvent")
    },
    _confirmEvent() {
      this.setData({
        isShow: false,
        showCashier: true,
      })
    },
    handleChoosePayType(e) {
      const payChannelType = e.detail
      let _this = this
      if (_this.data.amount === "" || _this.data.amount === 0) {
        wx.showToast({
          title: "尾款金额必须大与0",
          duration: 2000,
          icon: "none"
        })
        return false
      }
      _this.payOrder(_this.data.orderId, payChannelType)
    },
    payOrder(orderId, payChannelType) {
      let _this = this
      const _payData = this.getOrderExpiration(orderId)
      if (_payData) {
        // console.log("_payData");
        this.handleRequestPayment(_payData)
      } else {
        // console.log("非");
        const data = {
          sysId: "handy",
          merchantId: _this.data.merchantId,
          merchantName: _this.data.merchantName,
          mcc: "mcc",
          orderId: orderId,
          description: _this.data.description,
          amount: _this.data.amount * 100,
          channelId: payChannelType,
          transactionType: "JSAPI",
          serviceType: "1"
        }
        $api.balancePayServiceOrder(data).then((res) => {
          if (res.state) {
            // if (res.value.url) {
            // const payData = JSON.parse(res.value.url)
            const payData = res.value.payInfo;
            if (res.value.payInfo) {
              _this.setOrderExpiration(orderId, payData)
              _this.handleRequestPayment(payData)
            } else {
              _this.triggerEvent("confirmEvent")
              _this.setData({
                showCashier: false
              })
            }
            // } else {
            //   _this.triggerEvent("confirmEvent")
            //   _this.setData({
            //     showCashier: false
            //   })
            // }
          } else {
            wx.showToast({
              title: res.message,
              icon: "none"
            })
          }
        })
      }
    },
    handleRequestPayment(payData) {
      const _this = this
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
          App.showError("订单未支付", function () {
            _this.triggerEvent("confirmEvent")
          })
        },
        complete(res) {
          console.log(res)
          _this.setData({
            showCashier: false
          })
        }
      })
    },
    getOrderExpiration(orderId) {
      const timestamp = Date.parse(new Date())
      const data_expiration = wx.getStorageSync(`balance_payment_${orderId}`)
      if (data_expiration) {
        const {
          expiration: _expiration,
          payData: _payData
        } = data_expiration
        if (timestamp > _expiration) {
          wx.removeStorageSync(`balance_payment_${orderId}`)
          return false
        } else {
          return _payData
        }
      } else {
        return false
      }
    },
    setOrderExpiration(orderId, payData) {
      const timestamp = Date.parse(new Date())
      const expiration = timestamp + 1800000 //缓存30分钟
      wx.setStorageSync(`balance_payment_${orderId}`, {
        expiration,
        payData
      })
    }
  }
})