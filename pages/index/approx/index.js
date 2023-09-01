// pages/service/approx/index.js
const $api = require('../../../utils/api.js').API;
const $getMyDay = require('../../../utils/util.js').getMyDay
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    dateList: [],
    isCheck: '',
    assetContent: '',
    avaliableNum: '',
    assetId: '', //路由传过来的ID
    assetName: '',
    storeAddress: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log()
    this.setData({
      assetId: options.assetId,
    })
    this.getData(options.assetId)
  },
  // 获取时间的
  getData(assetId) {
    $api.queryAssetTimeQuantumDate({
      assetId: assetId
    }).then(res => {
      if (res.state) {
        let value = res.value
        let dateList = []
        value.map(item => {
          let list = {}
          var appointDate = item.split('-')
          list.appointDate = item
          list.year = appointDate[0]
          list.month = appointDate[1]
          list.day = appointDate[2]
          list.week = $getMyDay(new Date(item))
          dateList.push(list)
        })
        this.setData({
          dateList: dateList,
        })
        this.getList(dateList[0].appointDate)
      }
    })
  },
  //获取多余的号
  getList(appointDate) {
    let _this = this;
    $api.queryAssetTimeQuantumInfo({
      assetId: _this.data.assetId,
      appointStartDate: appointDate
    }).then(res => {
      if (res.state) {
        let value = res.value;
        let num = 0;
        console.log(value);
        value.map(item => {
          num = num + item.avaliableNum
        })
        _this.setData({
          dataList: res.value,
          avaliableNum: num,
          isCheck: appointDate
        })
        console.log(_this.data.isCheck);
      }
    })
  },
  goOrder() {
    console.log(this.data.avaliableNum);
    if (this.data.avaliableNum == '') {
      wx.showToast({
        title: '当前暂无号码可预约，请稍后再约',
        icon: 'none'
      })
      return;
    }
    const wxDialog = this.selectComponent('#wxDialog')
    wxDialog.open()
    // wx.navigateTo({
    //   url: '/pages/index/approxOrder/index',
    // })
  },
  //选择时间
  changeData(e) {
    let appointDate = e.currentTarget.dataset.appointdate
    this.getList(appointDate)
    console.log(e)
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
    this.setData({
      assetContent: getApp().globalData.assetContent,
      assetName: getApp().globalData.approx.assetName,
      storeAddress: getApp().globalData.approx.storeAddress,
      linkPhone: getApp().globalData.approx.linkPhone,
      businessHours: getApp().globalData.approx.businessHours,
    })
  },

  showAddr: function () {
    var address = this.data.storeAddress;
    var latitude = getApp().globalData.approx.storeLatituge;
    var longitude = getApp().globalData.approx.storeLongituge;
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