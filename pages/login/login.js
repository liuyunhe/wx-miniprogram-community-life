const $api = require('../../utils/api.js').API;
const App = getApp()

Page({
  data: {
    radioType: false,
    code: '',
    iv: '',
    phone: '',
    phoneCode: '',
    type: '',
    isType: false
    // phoneStr: ''
  },

  onLoad(options) {
    this.setData({
      type: options.type
    })
    this.getCode();
  },
  getCode() {
    let _this = this;
    wx.login({
      success(res) {
        if (res.code) {
          console.log(res.code)
          _this.setData({
            code: res.code,
          })
          console.log("res=======", res)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  agreement() {
    wx.navigateTo({
      url: '/pages/index/agreement',
    })
  },
  getPhoneNumber(e) {
    let _this = this;
    console.log("getPhoneNumber ===>",e);
    // wx.login({
    //   success: (res) => {
    //       if (res.code) {
    //           console.log("验证登陆请求");
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      console.log("用户点击了接受", e)
      console.log("code======", _this.data.code)
      _this.setData({
        phone: e.detail.encryptedData,
        iv: e.detail.iv,
        code: _this.data.code,
      })
      console.log(e);
      wx.setStorageSync("radioType", true);
      // wx.setStorageSync("custId", 1)
      // this.details();
      _this.getLogin(); // 将code、phone、iv发给后台，让后台解密手机号
    } else {
      console.log("用户点击了拒绝")
    }
    // }
    // },
    // fail: () => {
    //     _this.$refs.toast.hide();
    //     _this.$refs.toast.error("登录失败！请重新授权登录！");
    // },
    // });
  },

  getLogin() {
    let _this = this;
    var loginData = {
      appid: App.globalData.appid,
      code: _this.data.code,
      encryptedData: _this.data.phone,
      iv: _this.data.iv
    };
    $api.register(loginData).then(res => {
      if (res.state) {
        console.log(res);
        wx.setStorageSync('token', res.value.token);
        if (_this.data.type == '0') {
          wx.switchTab({
            url: '/pages/index/home/index',
          })
        } else {
          wx.navigateBack();
        }
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
        this.getCode();
      }
    })

  },
  getUserProfile(e) {
    let _this = this;
    _this.showDialog();
    return;
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        wx.setStorageSync('userInfo', res.userInfo);
        _this.setData({
          isType: true
        });
        console.log(wx.getStorageSync('userInfo'));
      },
      fail: function (err) {
        console.log("获取失败: ", err);
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  details() {
    wx.redirectTo({
      url: '/pages/index/details',
    })
  },
  radioTap() {
    this.setData({
      radioType: !this.data.radioType
    })
  },
  showStr() {
    wx.showToast({
      title: '请您先勾选同意用户服务协议',
      duration: 2000,
      icon: 'none'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
  },

  showDialog() {
    this.dialog.showDialog();
  },

  //取消事件
  _cancelEvent() {
    console.log('你点击了取消');
    this.dialog.hideDialog();
  },
  //确认事件
  _confirmEvent() {
    console.log('你点击了确定');
    this.dialog.hideDialog();
    this.setData({
      isType: true
    });
  }
})