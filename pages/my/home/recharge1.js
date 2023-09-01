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
    orderId: '',
    amount: 0,
    array:[
      {
        id:0,
        name:'招商银行储蓄卡(0203)'
      },
      {
        id:1,
        name:'建设银行储蓄卡(0564)'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  getInputName(e) {
    this.setData({
      amount: e.detail.value,
    })
  },

  collection() {
    let _this = this;
    _this.setData({
      orderId: guid()
    })
    if (_this.data.amount == 0 || _this.data.amount == '') {
      wx.showToast({
        title: '充值金额必须大与0且不能为空',
        icon: 'none'
      });
    } else {
      var orderData = {
        orderId: _this.data.orderId,
        description: '用户充值',
        amount: _this.data.amount * 100,
        channelId: '13',
        transactionType: 'JSAPI',
      }
      $api.recharge(orderData).then(res => {
        if (res.state) {
          App.wxPayment({
            payment: res.value,
            success: result => {
              wx.showToast({
                title: '充值成功',
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateBack();
              }, 1000)
              // var orderDetails = {
              //   orderId: _this.data.orderId,
              //   orderTime: util.dateTime(res.value.timeStamp),
              //   realPrice: _this.data.amount * 100
              // };
              // wx.redirectTo({
              //   url: '/pages/index/home/success?details=' + JSON.stringify(orderDetails) + '&dataType=2'
              // });
            },
            fail: res => {
              console.log(res)
              App.showError('订单未支付', function () {
                wx.navigateBack();
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
    }
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