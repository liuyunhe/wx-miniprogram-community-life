var util = require('../../../utils/util.js');
const $api = require('../../../utils/api.js').API;
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mooringArray: ['', ''],
    index: '',
    mooring: '请选择',
    time: 0,
    date: '',
    imgs: '',
    typelist: [],
    typeListShow: [],
    typeIndex: '',
    typeName: '',
    campusIndex: '',
    campusName: '',
    campusValue: '',
    time: '08:00',
    category_id: '',
    type: '',
    sketch: "",
    pics: [],
    imgNum: 9,
    mapCtx: {},
    personalData: {},
    repairList: [],
    typeValue: '',
    acceptRule: false,
    address: '',
    latitude: '',
    longitude: '',
    campusList: [],
    formData: {},
    isEnter:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getByTypeId();
    console.log(wx.getStorageSync('wechatNickName'));
  },
  // 查询字典接口
  getByTypeId() {
    $api.getByTypeId({
      typeId: '1595400057266507776'
    }).then(res => {
      if (res.state) {
        this.setData({
          campusList: res.value,
        })
        // this.getList()
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.uploadImg = this.selectComponent('#uploadImg');
  },
  handleItemChange(e) {
    let _this = this;
    var values = _this.data.formData;
    values.repairImage = JSON.stringify(e.detail);
    console.log("报修杰=======", values);
    // 表单验证
    if (!_this.validation(values)) {
      App.showError(_this.data.error);
      return false;
    }
    _this.setData({
      isEnter:true
    })
    values.applicant = wx.getStorageSync('wechatNickName');
    $api.repairAdd(values).then(res => {
      if (res.state) {
        wx.showToast({
          title: "提交成功",
          duration: 2000,
        });
        setTimeout(function () {
          _this.setData({
            isEnter:false
          })
          wx.navigateBack();
        }, 1000)
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
        _this.setData({
          isEnter:false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var currentDate = new Date();
    var time = this.getTime(currentDate);
    var currentDate = this.getData(currentDate);
    this.setData({
      time: time,
      date: currentDate,
    })

  },

  //位置选择前权限检查
  chooseLocationAdvance: function (e) {
    let _this = this;
    wx.getSetting({
      success(res) {
        console.log(res);
        console.log(res.authSetting['scope.address']);
        if (res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意
              _this.chooseLocation();
              console.log("位置选择前权限检查 用户已经同意");

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
  //选择位置信息
  chooseLocation: function () {
    var _this = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        _this.setData({
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        })
      },

    })
  },

  getData: function (date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return year + "-" + month + "-" + day;
  },
  getTime: function (date) {
    var hour = date.getHours()
    var minute = date.getMinutes()
    // var second = date.getSeconds()
    return hour + ":" + minute;
    // return [hour, minute, second].map(formatNumber).join(':')
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    });
  },

  bindPickerTime: function (e) {
    this.setData({
      time: e.detail.value
    });
  },

  bindPickerType: function (e) {
    console.log("选择类型=====", e.detail.value);
    this.setData({
      typeIndex: e.detail.value,
      //提交表单的时候，需要根据下标获取对应实体中的具体参数
      typeValue: this.data.typelist[e.detail.value].name,
      category_id: this.data.typelist[e.detail.value].category_id,
    })
  },

  bindPickerCampus: function (e) {
    console.log("e.detail.value ===>" + e.detail.value);
    this.setData({
      campusIndex: e.detail.value,
      campusName: this.data.campusList[e.detail.value].name,
      campusValue: this.data.campusList[e.detail.value].key
    })
    console.log("this.data.campusList[e.detail.value] ===>" + this.data.campusList[e.detail.value]);
  },
  //
  getRemarks: function (e) {
    this.setData({
      sketch: e.detail.value,
    })
  },


  bindMooring: function (e) {
    this.setData({
      index: e.detail.value,
    })
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
    if (values.repairType === '') {
      this.data.error = '报修类型不能为空';
      return false;
    }
    if (values.content === '') {
      this.data.error = '内容不能为空';
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

    // if (values.address === '') {
    //   this.data.error = '位置信息不能为空';
    //   return false;
    // }
    // if (values.image_id === '/images/add_Item.png') {
    //   this.data.error = '商品图片不能为空';
    //   return false;
    // }
    return true;
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  rule: function () {
    wx.navigateTo({
      url: '/pages/index/rule'
    })
  },

  bindAcceptRule: function () {
    this.setData({
      acceptRule: !this.data.acceptRule
    })
    console.log("acceptRule=======", this.data.acceptRule);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})