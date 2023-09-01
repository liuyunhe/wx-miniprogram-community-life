const $api = require('../../../utils/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateStart: '请选择',
    dateEnd: '请选择',
    time: '获取验证码', //倒计时 
    currentTime: 60,
    code: '',
    password: '',
    disabled: true,
    send: true,
    typeList: [{
        id: 0,
        name: '身份证'
      },
      {
        id: 1,
        name: '护照'
      },
      {
        id: 2,
        name: '军官证'
      },
      {
        id: 3,
        name: '士兵证'
      },
      {
        id: 4,
        name: '港澳台往来通行证'
      },
      {
        id: 5,
        name: '临时身份证'
      },
      {
        id: 6,
        name: '户口簿'
      },
      {
        id: 9,
        name: '警官证'
      },
      {
        id: 12,
        name: '外国人永久居留证'
      },
      {
        id: 21,
        name: '边民出入境通行证'
      },
      {
        id: 7,
        name: '其他'
      },
    ],
    typeName: '请选择',
    certType: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  bindPickerID: function (e) {
    console.log("e.detail.value ===>" + e.detail.value);
    this.setData({
      typeIndex: e.detail.value,
      typeName: this.data.typeList[e.detail.value].name,
      certType: this.data.typeList[e.detail.value].id
    })
  },
  getCode: function () {
    var that = this;
    var currentTime = that.data.currentTime
    let interval = null
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
  },

  getVerificationCode() {
    this.getCode();
    this.checkSignPayProtocol();
    var that = this
    that.setData({
      disabled: true
    })
  },
  changePhone(e) {
    if (e.detail.value.length == 11) {
      this.setData({
        disabled: false
      });
    }
  },
  bindDateStart(e) {
    this.setData({
      dateStart: e.detail.value
    })
  },
  bindDateEnd(e) {
    this.setData({
      dateEnd: e.detail.value
    })
  },
  checkSignPayProtocol() {
    let _this = this;
    var outData = {
      outUserId: wx.getStorageSync('custId')
    };
    $api.checkSignPayProtocol(outData).then(res => {

    })
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
   * 表单提交
   */
  saveData: function (e) {
    let _this = this;
    var value = e.detail.value;
    value.outUserId = wx.getStorageSync('custId');
    value.protocolType = "0003";
    value.messageNo = "1001";
    value.accountFlag = "1";
    value.certType = _this.data.certType;
    $api.signPayProtocol(value).then(res => {
      if(res.state){

      }else{
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
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