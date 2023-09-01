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
    var payData = {
      chargeOrgId: _this.data.details.chargeOrgId,
      chargeOrgName: _this.data.details.merchantName,
      mcc: '测试',
      chargeItem: _this.data.details.chargeItem,
      chargeItemName: '停车费',
      billId: _this.data.details.billId,
      custChargeNo: _this.data.details.custChargeNo,
      custChargeName: '',
      address: _this.data.details.address,
      chargeNote: '测试备注',
      transAmount: _this.data.details.amount * 100,
      channelId: '13',
      transactionType: 'JSAPI',
      serviceType:'2'
    };
    $api.chargePay(payData).then(res => {
      if (res.state) {
        App.wxPayment({
          payment: res.value.json,
          success: result => {
            var orderDetails = {
              orderId: res.value.transId,
              orderTime: util.dateTime(res.value.json.timeStamp),
              realPrice: _this.data.details.amount * 100
            };
            wx.redirectTo({
              url: '/pages/index/home/success?details=' + JSON.stringify(orderDetails) + '&dataType=0',
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
    wx.requestSubscribeMessage({
      tmplIds: ['EjXdGwzdadrZghAFdhXsGhDpzyLtG19GGbdlDoZJXWI'],
      success(res) {
        _this.payOrder();
      },
      fail(res) {        
        _this.payOrder();
        console.log("fail=====", res);
      },
      complete(res) {
        console.log("complete=====", res);
      }
    })
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