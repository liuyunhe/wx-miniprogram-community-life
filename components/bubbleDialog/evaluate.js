var util = require('../../utils/util.js');
const $api = require('../../utils/api.js').API;
const App = getApp();
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 评价id
    orderId: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    merchantId: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    merchantName: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    description: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗标题
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗取消按钮文字
    cancelText: {
      type: String,
      value: '取消'
    },
    // 弹窗确认按钮文字
    confirmText: {
      type: String,
      value: '确定'
    },
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    isShow: false,
    amount: 0,
    type:'',
    attributes:{},
    item:""
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    /*
     * 公有方法
     */

    showAddr: function () {
      var address = this.data.attributes.address;
      var latitude = this.data.attributes.latitude;
      var longitude = this.data.attributes.longitude;
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

    //隐藏弹框
    hideDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    areaInput(e) {
      this.setData({
        amount: e.detail.value
      });
      console.log(e);
    },
    //展示弹框
    showDialog(type,attributes,item) {
      this.setData({
        isShow: !this.data.isShow,
        type:type,
        attributes:attributes,
        item:item
      })
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _cancelEvent() {
      //触发取消回调
      this.triggerEvent("cancelEvent")
    },
    _confirmEvent() {
      let _this = this;
      if (_this.data.amount === '' || _this.data.amount === 0) {
        wx.showToast({
          title: "尾款金额必须大与0",
          duration: 2000,
          icon: 'none'
        });
        return false;
      };
      _this.payOrder(_this.data.orderId);
    },
    payOrder(orderId) {
      let _this = this;
      const data = {
        sysId: 'handy',
        merchantId: _this.data.merchantId,
        merchantName: _this.data.merchantName,
        mcc: 'mcc',
        orderId: orderId + 'w',
        description: _this.data.description,
        amount: _this.data.amount * 100,
        channelId: '13',
        transactionType: 'JSAPI',
        serviceType: '1'
      }
      $api.payHandyOrder(data).then(res => {
        if (res.state) {
          const payData = JSON.parse(res.value.url)
          wx.requestPayment({
            timeStamp: payData.timeStamp,
            nonceStr: payData.nonceStr,
            package: payData.package,
            signType: payData.signType,
            paySign: payData.paySign,
            appId: payData.appId,
            success(res) {
              console.log(res)
              if (res.errMsg == 'requestPayment:ok') {
                // const details = {
                //   orderId: orderId,
                //   orderTime: util.dateTime(payData.timeStamp),
                //   realPrice: data.amount
                // }
                _this.triggerEvent("confirmEvent");
                // wx.redirectTo({
                //   url: '/pages/index/home/success?details=' + JSON.stringify(details) + '&dataType=1',
                // })
              }
            },
            fail(err) {
              // console.log(err)
              App.showError('订单未支付', function () {
                _this.triggerEvent("confirmEvent");
              });
            },
            complete(res) {
              console.log(res)
            }
          });
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          });
        }
      })
    },
    pay(){
      wx.navigateTo({
        url: '/pages/index/addPay/index?type='+this.data.item+'&attributes='+JSON.stringify(this.data.attributes),
      });
      this.hideDialog();
    },
    goTo(e){
      console.log(e);
      wx.navigateTo({
        url: '/pages/index/addPay/index?type='+e.currentTarget.dataset.item+'&attributes='+JSON.stringify(this.data.attributes),
      });
      this.hideDialog();
    },
    service(){
      wx.switchTab({
        url: '/pages/service/home/index',
      })
    }
  }
})