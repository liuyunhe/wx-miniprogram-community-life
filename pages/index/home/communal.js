const $api = require('../../../utils/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payData: [{
        id: 1,
        url: '/state/images/shui1.png',
        title: '水费',
        num: 1
      },
      {
        id: 2,
        url: '/state/images/ranqi1.png',
        title: '燃气费',
        num: 0
      },
      {
        id: 3,
        url: '/state/images/reli1.png',
        title: '热力费',
        num: 0
      },
      // {
      //   id: 4,
      //   url: '/state/images/tingche1.png',
      //   title: '停车费'
      // },
      // {
      //   id: 5,
      //   url: '/state/images/jiaofei.png',
      //   title: '投诉建议'
      // },
      // {
      //   id: 6,
      //   url: '/state/images/chongzhi.png',
      //   title: '立即充值'
      // },
      // {
      //   id: 7,
      //   url: '/state/images/yucun.png',
      //   title: '预存缴费'
      // },
      // {
      //   id: 8,
      //   url: '/state/images/gengduo.png',
      //   title: '更多'
      // },
    ],
    newsData: [],
    imgNewsData: [{
      url: '/state/images/table.png'
    }],
    imgNewsData1: [{
      url: '/state/images/table1.png'
    }],
    footData: [{
        id: '1',
        url: '/state/images/shop.png',
        title: '跳蚤市场'
      },
      // {
      //   id: '2',
      //   url: '/state/images/guanjia.png',
      //   title: '管家服务'
      // },
      // {
      //   id: '3',
      //   url: '/state/images/tiaozao.png',
      //   title: '跳蚤市场'
      // },
      // {
      //   id: '4',
      //   url: '/state/images/chanpin.png',
      //   title: '产品配送'
      // },
      // {
      //   id: '5',
      //   url: '/state/images/shehui.png',
      //   title: '社会公告'
      // },
      // {
      //   id: '6',
      //   url: '/state/images/banshi.png',
      //   title: '办事大厅'
      // },
      // {
      //   id: '7',
      //   url: '/state/images/huodong.png',
      //   title: '社会活动'
      // },
      // {
      //   id: '8',
      //   url: '/state/images/zixun.png',
      //   title: '咨询投诉'
      // },
    ],
    token: '',
    url: '',
    type: '',
    chargeList: [],
    rlfActive:false,
    sfActive:false,
    rqfActive:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // wx.getSystemInfo({
    //   success(res) {
    //     console.log(res.model)
    //     console.log(res.pixelRatio)
    //     console.log(res.windowWidth)
    //     console.log(res.windowHeight)
    //     console.log(res.language)
    //     console.log(res.version)
    //     console.log(res.platform)
    //   }
    // })
    // if (wx.getStorageSync('wxSessionId')) {
    //   wx.switchTab({
    //     url: '/pages/index/home/index',
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '/pages/login/login',
    //   })
    // }
  },
  bindmarkertap(e) {
    console.log("bindmarkertap====", e.markerId);
    for (let i = 0; i < this.data.markers.length; i++) {
      if (this.data.markers[i].id == e.markerId) {
        this.dialog.showDialog(this.data.markers[i].type, this.data.markers[i].attributes, this.data.markers[i].item);
      }
    }
  },
  userInfo() {
    let _this = this;
    $api.userInfo({}).then(res => {
      if (res.state) {
        if (res.value.hasOwnProperty('wechatNickName') && res.value.wechatNickName != '') {
          wx.setStorageSync("wechatNickName", res.value.wechatNickName);
          wx.setStorageSync("custId", res.value.custId);
          // _this.checkSignPayProtocol();
        }
      }
    })
  },
  chargePoint() {
    let _this = this;
    $api.chargePoint({}).then(res => {
      console.log(res);
      if (res.state) {
        for (let i = 0; i < res.value.length; i++) {
          var markersData = {
            id: res.value[i].id,
            type: "charge",
            item: "",
            attributes: res.value[i].attributes,
            latitude: res.value[i].latitude,
            longitude: res.value[i].longitude,
            width: res.value[i].width,
            height: res.value[i].height,
            iconPath: res.value[i].iconPath,
          };
          _this.data.markers.push(markersData);
        };
        _this.setData({
          markers: _this.data.markers,
          chargeList: res.value
        })
      }
    })
  },
  merchantPoint(type) {
    let _this = this;
    $api.merchantPoint({
      chargeTypeKey: type
    }).then(res => {
      console.log(res);
      if (res.state) {
        for (let i = 0; i < res.value.length; i++) {
          var markersData = {
            id: res.value[i].id,
            type: "merchant",
            item: type,
            attributes: res.value[i].attributes,
            latitude: res.value[i].latitude,
            longitude: res.value[i].longitude,
            width: res.value[i].width,
            height: res.value[i].height,
            iconPath: res.value[i].iconPath,
          };
          _this.data.markers.push(markersData);
        };
        _this.setData({
          markers: _this.data.markers
        })
      }
    })
  },
  // 点击生活缴费中
  goPay(option) {
    const id = option.currentTarget.dataset.id;
    getApp().globalData.id = id;
    if (id == '1') {
      getApp().globalData.payImg = '/state/images/shui1.png'
      getApp().globalData.payName = '水费'
      wx.navigateTo({
        url: '/pages/index/payment/index?type=sf',
      })
    } else if (id == '2') {
      getApp().globalData.payImg = '/state/images/ranqi1.png'
      getApp().globalData.payName = '燃气费'
      wx.navigateTo({
        url: '/pages/index/payment/index?type=rqf',
      })
    } else if (id == '3') {
      getApp().globalData.payImg = '/state/images/reli1.png'
      getApp().globalData.payName = '热力费'
      wx.navigateTo({
        url: '/pages/index/payment/index?type=rlf',
      })
    } else if (id == '4') {
      // wx.showToast({
      //   title: '暂未开放',
      // })
    } else if (id == '5') {

    }
  },
  repair() {
    wx.navigateTo({
      url: '/pages/index/proposal/index',
    })
  },
  idCode() {
    wx.navigateTo({
      url: '/pages/index/home/idCode',
    })
  },
  confirm() {
    var _this = this;
    // wx.navigateTo({
    //   url: '/pages/index/home/confirm',
    // })
    wx.scanCode({
      onlyFromCamera: true, // 只允许从相机扫码
      success(res) {
        console.log("扫码成功：" + JSON.stringify(res));
        var goList = res.result.split("/");
        console.log(goList[4]);
        if (goList[4] == 'pay') {
          wx.navigateTo({
            url: '/pages/index/home/confirm?q=' + res.result,
          })
        } else if (goList[4] == 'parkpay') {
          wx.navigateTo({
            url: '/pages/index/home/parking?q=' + res.result,
          })
        } else if (goList[4] == 'staff') {
          wx.navigateTo({
            url: '/pages/index/home/workCard?q=' + res.result,
          })
        }

        // 扫码成功后  在此处理接下来的逻辑
        _this.setData({
          scanCode: res.result //扫描得到的结果
        })
      },
      fail(err) {
        wx.showToast({
          title: '扫描失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 便民服务
  gocommunity(option) {
    console.log(option)
    if (option.currentTarget.dataset.id == 1) {
      wx.showToast({
        title: '暂未开放',
      })
    } else {
      // wx.navigateTo({
      //   url: '/pages/index/install/index?id=' + option.id,
      // })
    }
  },
  // 在线预约
  goSubscribe() {
    wx.navigateTo({
      url: '/pages/index/subscribe/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  
  noticeDetails(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/index/home/notice?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (!wx.getStorageSync('token')) {
      wx.redirectTo({
        url: '/pages/login/login?type=0',
      });
    } else {
      this.getToken();
    }
  },
  // 获取token
  getToken() {
    let _this = this;
    var loginData = {
      token: "Bearer " + wx.getStorageSync('token'),
    };
    $api.getToken(loginData).then(res => {
      console.log(res);
      wx.setStorageSync("token", res.value.token);
      _this.setData({
        url: "https://tacj.openunion.cn/test2/index.html?token=" + res.value.token
      });
      this.notice();
      this.userInfo();
      this.getUseChargeBill("rlf")
      this.getUseChargeBill("sf")
      this.getUseChargeBill("rqf")
    })
  },
  getUseChargeBill(type) { 
    const params = { type }
    $api.findUseChargeBill(params).then((res) => {
      console.log(111111)
      switch (type) {
        case "rlf":
          this.setData({rlfActive:res.value})
          break;
        case "sf":
          this.setData({sfActive:res.value})
          break;
        case "rqf":
          this.setData({rqfActive:res.value})
          break;
        default:
          break;
      }
    })
  },
  notice() {
    let _this = this;
    var noticeData = {
      page: 1,
      pageSize: 100
    };
    $api.notice(noticeData).then(res => {
      _this.setData({
        newsData: res.value.rows
      })
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