const $api = require('../../../utils/api.js').API;
var util = require('../../../utils/util.js');
var SnowflakeId = require('../../../utils/snowflake-id.js');
const guid = num => {
  const snowflake = new SnowflakeId();
  let arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(snowflake.generate());
  }
  return num ? arr : snowflake.generate();
};
const App = getApp();
const { PAY_ORDER__TMP_ID } = getApp().globalData.priTmplId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: {},
    receiveAmount: 0,
    amount: 0,
    discount: 0,
    discountAmount: 0,
    qrCode: '',
    details: {},
    orderId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      qrCode: decodeURIComponent(options.q)
      // qrCode: 'https://tacj.openunion.cn/qr/pay/1YfwdR2DBNl'
    })
    // console.log(this.data.qrCode.split("/"));
  },

  getMerchantInfoByShortLink() {
    let _this = this;
    var terminalData = {
      shortLink: _this.data.qrCode,
    }
    $api.getMerchantInfoByShortLink(terminalData).then(res => {
      // _this.setData({
      //   receiveAmount:JSON.stringify(res)
      // })
      if (res.state) {
        _this.setData({
          details: res.value
        })
      }
    })
  },

  payOrder() {
    let _this = this;
    _this.setData({
      orderId: guid()
    })
    var orderData = {
      merchantId: _this.data.details.merchantId,
      merchantName: _this.data.details.merchantName,
      merchantCode: _this.data.details.merchantCode,
      mcc: _this.data.details.mcc,
      storeId: _this.data.details.storeId,
      storeName: _this.data.details.storeName,
      storeShortName: _this.data.details.storeShortName,
      acceptCode: _this.data.details.acceptCode,
      acceptName: _this.data.details.acceptName,
      terminalNumber: _this.data.details.terminalNumber,
      terminalName: _this.data.details.terminalName,
      terType: _this.data.details.terType,
      orderId: _this.data.orderId,
      description: '测试商品',
      amount: _this.data.amount * 100,
      channelId: '13',
      transactionType: 'JSAPI',
      deviceInfo: '',
      sessionId: '',
      serviceType:'1'
    }
    $api.payOrder(orderData).then(res => {
      if (res.state) {
        App.wxPayment({
          payment: res.value,
          success: result => {
            var orderDetails = {
              orderId: _this.data.orderId,
              orderTime: util.dateTime(res.value.timeStamp),
              realPrice: _this.data.amount * 100
            };
            wx.redirectTo({
              url: '/pages/index/home/success?details=' + JSON.stringify(orderDetails) + '&dataType=2'
            });
            // console.log(orderDetails)
          },
          fail: res => {
            console.log(res)
            App.showError('订单未支付', function () {
              wx.redirectTo({
                url: '/pages/my/order/index',
              })
            });
          },
        });
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },

  getInputName(e) {
    this.setData({
      amount: e.detail.value,
    })
  },

  collection() {
    let _this = this;
    if (_this.data.amount == 0 || _this.data.amount == '') {
      wx.showToast({
        title: '付款金额必须大与0且不能为空',
        icon: 'none'
      });
    } else {
      // _this.payOrder();
      wx.requestSubscribeMessage({
        tmplIds: [PAY_ORDER__TMP_ID],
        success(res) {
          _this.payOrder()
        },
        fail(res) {
          _this.payOrder()
          console.log("fail=====", res)
        },
        complete(res) {
          console.log("complete=====", res)
        }
      })
    }
  },

  cancel() {
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (wx.getStorageSync('token')) {
      this.getMerchantInfoByShortLink();
    } else {
      wx.navigateTo({
        url: '/pages/login/login?type=1',
      })
    }
  },





  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})