var QRCode = require('../../../utils/weapp-qrcode.js');
const $api = require('../../../utils/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      details: JSON.parse(options.details),
    })
    this.msgCode(this.data.details.appointUnionCode);
  },
  cancel(e) {
    let _this = this;
    var content = '';
    var successStr = '';
    if (e.currentTarget.dataset.status == '4') {
      content = '确认要取消该预约吗？';
      successStr = '取消成功';
    } else {
      content = '确认要删除该预约吗？';
      successStr = '删除成功'
    }
    wx.showModal({
      title: '友情提示',
      content: content,
      success(res) {
        if (res.confirm) {
          _this.appointUpdate(e.currentTarget.dataset.id, e.currentTarget.dataset.status, successStr);
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  appointUpdate(id, status, successStr) {
    let _this = this;
    var upDate = {
      id: _this.data.details.id,
      status: status
    }
    $api.appointUpdate(upDate).then(res => {
      if (res.state) {
        _this.setData({
          list: [],
          isLoading: true,
          no_more: false,
        })
        wx.showToast({
          title: successStr,
          duration:2000,
        });
        setTimeout(function () {
          wx.navigateBack();
        }, 1000)
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
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