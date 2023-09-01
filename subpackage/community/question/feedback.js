const $api = require('../../../utils/api.js').API;
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemTag: [{
        id: 10,
        name: '功能建议',
        checked: false
      },
      {
        id: 11,
        name: '内容建议',
        checked: false
      },
      {
        id: 12,
        name: 'BUG反馈',
        checked: false
      },
      {
        id: 13,
        name: '界面建议',
        checked: false
      },
      {
        id: 14,
        name: '交互建议',
        checked: false
      },
      {
        id: 99,
        name: '其它',
        checked: false
      },
    ],
    adviceType: '10',
    formData: {},
    type:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("options ===>",options)
    let type = options.type;
    this.setData({
      type:type,
    })
    let title = "";
    if(type == "counsel"){
      //咨询
      title = "新增咨询";
    }else if(type == "question"){
      //投诉
      title = "新增投诉";
    }
    wx.setNavigationBarTitle({
      title: title,
    })

  },

  /**
   * 点击tab切换
   */
  swichNav: function (e) {
    var _this = this;
    console.log("====" + e.target.dataset.id);
    for (var i = 0; i < _this.data.itemTag.length; i++) {
      if (_this.data.itemTag[i].id == e.target.dataset.id) {
        _this.data.itemTag[i].checked = true;
      } else {
        _this.data.itemTag[i].checked = false
      }
    }
    _this.setData({
      itemTag: _this.data.itemTag,
      adviceType: e.target.dataset.id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.uploadImg = this.selectComponent('#uploadImg');
  },
  handleItemChange(e) {
    let _this = this;
    var values = _this.data.formData;
    values.adviceImage = JSON.stringify(e.detail);
    values.acceptOrgId = "1592423575938273280";
    // 表单验证
    if (!_this.validation(values)) {
      App.showError(_this.data.error);
      return false;
    }
    $api.adviceAdd(values).then(res => {
      if (res.state) {
        wx.showToast({
          title: "提交成功",
          duration: 2000,
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

  },
  /**
   * 表单提交
   */
  saveData: function (e) {
    let _this = this;
    _this.setData({
      formData: e.detail.value
    })
    _this.uploadImg.uploadImg();
  },

  /**
   * 表单验证
   */
  validation: function (values) {
    if (values.content === '') {
      this.data.error = '问题内容不能为空';
      return false;
    }
    if (values.phone.length < 1) {
      this.data.error = '手机号不能为空';
      return false;
    }
    if (values.phone.length !== 11) {
      this.data.error = '手机号长度有误';
      return false;
    }
    let reg = /^((0\d{2,3}-\d{7,8})|(1[345689]\d{9}))$/;
    if (!reg.test(values.phone)) {
      this.data.error = '手机号不符合要求';
      return false;
    }
    return true;
  },
})