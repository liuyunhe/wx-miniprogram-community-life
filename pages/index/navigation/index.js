// pages/index/navigation/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.showAddrAdvance();
    console.log(options.listSf);
  },

  showAddr: function () {
    var address = "北京市北京市朝阳区阜通东大街8号";
    var latitude = "39.989597";
    var longitude = "116.47986";
    console.log("address ===》" + address);
    if (address) {
      //使用微信内置地图查看标记点位置，并进行导航
      wx.openLocation({
        latitude: Number(latitude), //要去的纬度-地址
        longitude: Number(longitude), //要去的经度-地址
        address: address
      })
    } else {
      wx.showToast({
        title: '请稍后...',
      })
      return;
    }
  },

  //位置选择前权限检查
  showAddrAdvance: function (e) {
    let _this = this;
    wx.getSetting({
      success(res) {
        console.log(res.authSetting['scope.address']);
        if (res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意
              _this.showAddr();

            },
            fail() {
              console.log("用户已经拒绝位置授权");
              //如果拒绝，在这里进行再次获取授权的操作
              _this.userOpenSetting();
            }
          })
        }
        //其他操作..
      }
    });
  },

  //当用户第一次拒绝后再次请求授权
  userOpenSetting: function () {
    wx.showModal({
      content: '亲，本小程序需要您的定位权限，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        //点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => {}
          })
        } else {
          console.log('用户点击取消')
        }
      }
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