const $api = require('../../../utils/api.js').API;
const App = getApp();
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    points:"",
    titleImg: "",
    titleName: "",
    listData: [
      {
        id: 9,
        url: "/state/images/youhuiquan.png",
        title: "我的优惠券"
      },
      {
        id: 10,
        url: "/state/images/jifen.png",
        title: "我的积分"
      },
      {
        id: 4,
        url: "/state/images/wdcanyu.png",
        title: "我的预约"
      },
      {
        id: 5,
        url: "/state/images/baoxiu.png",
        title: "我的报修"
      },
      {
        id: 6,
        url: "/state/images/operation.png",
        title: "我的报名"
      },
      {
        id: 7,
        url: "/state/images/wdwupin.png",
        title: "我的物品"
      },
      // {
      //   id: 4,
      //   url: '/state/images/dizhi.png',
      //   title: '我的地址'
      // },
      // {
      //   id: 5,
      //   url: '/state/images/wenti.png',
      //   title: '我的问题'
      // },
      // {
      //   id: 7,
      //   url: '/state/images/card.png',
      //   title: '银行卡'
      // },

      // {url:'/state/images/wupin.png',title:'我的物品'},
      // {url:'/state/images/canyu.png',title:'我的参与'},
      // {url:'/state/images/youhui.png',title:'我的优惠卷'},
      // {url:'/state/images/anquan.png',title:'安全保护'},
      {
        id: 8,
        url: "/state/images/shezhi1.png",
        title: "设置"
      }
    ],
    outUserId: "",
    protocolId: "",
    imgIcon: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog")
  },
  showDialog() {
    this.dialog.showDialog()
  },

  //取消事件
  _cancelEvent() {
    console.log("你点击了取消")
    this.dialog.hideDialog()
  },
  //确认事件
  _confirmEvent() {
    this.dialog.hideDialog()
    this.userInfo()
  },

  balance() {
    // wx.navigateTo({
    //   url: '/pages/my/home/balance1',
    // })
    wx.navigateTo({
      url: "/pages/my/home/openAccount"
    })
  },

  getPage(e) {
    if (e.currentTarget.dataset.id == 0) {
      wx.navigateTo({
        url: "/pages/my/bill/order"
      })
    } else if (e.currentTarget.dataset.id == 1) {
      wx.navigateTo({
        url: "/pages/my/order/index"
      })
    } else if (e.currentTarget.dataset.id == 2) {
      wx.navigateTo({
        url: "/pages/my/home/accountno"
      })
    } else if (e.currentTarget.dataset.id == 3) {
      wx.navigateTo({
        url: "/pages/my/home/problemList"
      })
    } else if (e.currentTarget.dataset.id == 4) {
      wx.navigateTo({
        url: "/pages/my/home/appointment"
      })
    } else if (e.currentTarget.dataset.id == 5) {
      wx.navigateTo({
        url: "/pages/index/proposal/index"
      })
    } else if (e.currentTarget.dataset.id == 6) {
      wx.navigateTo({
        url: "/subpackage/community/activity/index?fromPage=myPage"
      })
    } else if (e.currentTarget.dataset.id == 7) {
      wx.navigateTo({
        url: "/subpackage/community/market/index"
      })
    } else if (e.currentTarget.dataset.id == 8) {
      wx.navigateTo({
        url: "/pages/my/home/setup"
      })
    } else if (e.currentTarget.dataset.id == 9) {
      wx.navigateTo({
        url: "/pages/my/coupon/list"
      })
    } else if (e.currentTarget.dataset.id == 10) {
      wx.navigateTo({
        url: `/pages/my/integral/list`
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this
    _this.userInfo()
    _this.queryProtocolId()
    _this.getPointsDetail()
  },

  userInfo() {
    console.log("userInfo=====>")
    let _this = this
    $api.userInfo({}).then((res) => {
      console.log(res)
      if (res.state) {
        if (
          res.value.hasOwnProperty("wechatNickName") &&
          res.value.wechatNickName != ""
        ) {
          if (res.value.wechatAvatarUrl == "/state/images/yucun.png") {
            _this.data.titleImg = "/state/images/yucun.png"
          } else {
            _this.data.titleImg = JSON.parse(res.value.wechatAvatarUrl)[0].url
            // _this.data.titleImg = '/state/images/yucun.png';
          }
          _this.setData({
            titleName: res.value.wechatNickName,
            titleImg: _this.data.titleImg
          })
        } else {
          _this.setData({
            titleName: "未获取",
            titleImg: "/state/images/yucun.png"
          })
        }
      }
    })
  },

  getPointsDetail() { 
     $api.getPointsDetail().then((res) => {
       console.log(res)
       if (res.state) {
         this.setData({
           points:res.value.points
         })
         wx.setStorageSync("points", res.value.points)
       } else { 
         
       }
     })
  },
  //签订e支付小额免密协议查询接口
  isSignProtocol() {
    let _this = this
    var outData = {
      outUserId: "12312",
      protocolType: "0003",
      queryType: "1",
      accountNo: "6217000340009873123",
      protocolId: ""
    }
    $api.isSignProtocol(outData).then((res) => {
      if (res.state) {
      }
    })
  },

  //根据userid查询协议编号
  queryProtocolId() {
    let _this = this
    var queryData = {
      outUserId: wx.getStorageSync("custId")
    }
    $api.queryProtocolId(queryData).then((res) => {
      if (res.state) {
        if (res.value == "") {
          _this.data.imgIcon = "/state/images/btn_mm.png"
        } else {
          _this.data.imgIcon = "/state/images/btn_oo.png"
        }
        _this.setData({
          protocolId: res.value,
          imgIcon: _this.data.imgIcon
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},
  loginOut() {
    let _this = this
    wx.showModal({
      title: "友情提示",
      content: "确定要退出当前登录吗？",
      confirmColor: "#26a886",
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync("token", "")
          wx.redirectTo({
            url: "/pages/login/login?type=0"
          })
        } else {
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})