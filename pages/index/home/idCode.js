var QRCode = require('../../../utils/weapp-qrcode.js');
const $api = require('../../../utils/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '付款码',
    radioId:0,
    codeList: [{
        id: 0,
        name: '付款码',
        selected: true
      },
      {
        id: 1,
        name: '收款码',
        selected: false
      },
      {
        id: 2,
        name: '工牌码',
        selected: false
      },
      {
        id: 3,
        name: '预约码',
        selected: false
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.msgCode('123456');
  },

  msgCode: function (code) {
    let _this = this;
    //算出不同屏幕适配比例,画布默认尺寸是px
    let unit = ''
    wx.getSystemInfo({
      success: function (res) {
        unit = res.windowWidth / 375
      },
    })
    var qrcode = new QRCode('canvas', {
      // usingIn: this,
      text: code,
      width: 140 * unit,
      height: 140 * unit,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  selectList(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    for (let i = 0; i < _this.data.codeList.length; i++) {
      if(i==index){
        _this.data.codeList[i].selected = true;
      }else{
        _this.data.codeList[i].selected = false;
      }
    }
    _this.setData({
      codeList:_this.data.codeList,
      radioId:index,
      name:_this.data.codeList[index].name
    })
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