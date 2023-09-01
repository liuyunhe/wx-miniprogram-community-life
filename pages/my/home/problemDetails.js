const App = getApp();
const $api = require('../../../utils/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: App.globalData.imgUrl,
    adviceImageUrl:'',
    createTime:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options=>",options)
    if(options.adviceId){
      this.getDetail(options.adviceId)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
  },

  evaluate() {

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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //通过请求获取建议详情信息
  getDetail(id){
    let _this = this
    if(id){
      let param = {
        id: id
      }
      $api.adviceDetail(param).then((res)=>{
        console.log("建议详情返回res=>",res)
        if(res.value.adviceImage){
          res.adviceImageUrl = JSON.parse(res.value.adviceImage)
        }
        console.log("修改后的res=>",res)
        _this.setData({
          adviceImageUrl:res.adviceImageUrl,
          createTime:res.value.createTime
        })
      })
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
   * 浏览图片
   */
  previewImages: function (e) {
    let _this = this;
    let index = e.currentTarget.dataset.index,
      imageUrls = [];
    _this.data.img_list.forEach(function (item) {
      var url = _this.data.imgUrl+item;
      imageUrls.push(url);
    });
    wx.previewImage({
      current: imageUrls[index],
      urls: imageUrls
    })
  },

  showAddr: function () {
    var address = this.data.publish_item.address;
    var latitude = this.data.publish_item.latitude;
    var longitude = this.data.publish_item.longitude;
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


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
  onShareAppMessage: function (e) {
    var ship_id = e.target.id;
    var title = e.target.dataset.title;
    return {
      title: title,
      path: "/pages/index/detail?ship_id=" + ship_id + "&title=" + title
    };

  }
})