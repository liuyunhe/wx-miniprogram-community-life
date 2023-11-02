const $api = require('../../../utils/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payImg: '',
    payName: '',
    id: '',
    type: '',
    list: [],
    isLoading: true, // 是否正在加载中
    chargeCustFlag:'',
    payData: [
      {
        id: 1,
        url: "/state/images/shui1.png",
        title: "水费",
        num: 1,
        type:"sf"
      },
      {
        id: 2,
        url: "/state/images/ranqi1.png",
        title: "燃气费",
        num: 0,
        type:"rqf"
      },
      {
        id: 3,
        url: "/state/images/reli1.png",
        title: "热力费",
        num: 0,
        type:"rlf"
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.type);
    this.setData({
      type: options.type,
      chargeCustFlag:options.chargeCustFlag
    });
    // this.custList();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow(options) {
    this.setData({
      payImg: getApp().globalData.payImg,
      payName: getApp().globalData.payName,
      id: getApp().globalData.payName,
    });
    this.custList();
    // if(this.data.id==1){
    //   this.setData({
    //    payImg:'/state/images/water.png',
    //    title:'水费'
    //   })
    // }else if(this.data.id==2){
    //  this.setData({
    //    payImg:'/state/images/gas.png',
    //    title:'燃气费'
    //   })
    // }else {
    //  this.setData({
    //    payImg:'/state/images/heating.png',
    //    title:'热力费'
    //   })
    // }
  },
  custList() {
    let _this = this;
    _this.setData({
      list: [],
      isLoading: false
    });
    var merchantData = {};
    if(_this.data.type==''){
      merchantData = {
        chargeCustFlag: _this.data.chargeCustFlag,
        page: 1,
        pageSize: 20,
      }
    }else{
      merchantData = {
        chargeItem: _this.data.type,
        page: 1,
        pageSize: 20,
      }
    }
    $api.custList(merchantData).then(res => {
      if (res.state) {
        _this.setData({
          list: res.value.rows,
          isLoading: false
        });
        this.findListChargeBill()
      } else {
        _this.setData({
          isLoading: false
        });
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },
  findListChargeBill() { 
    const list = this.data.list
    if(!list.length) return
    const params = list.map((item) => item.chargeCustId)
    $api.findListChargeBill(params).then((res) => {
      if (res.state) {
        list.forEach(item => { 
          const itemBill = res.value.find(
            (bill) => bill.id === item.chargeCustId
          )
          console.log(itemBill)
          item.billActive = itemBill.value
        })
        console.log(list)
        this.setData({
          list
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: "none"
        })
      }
    })
  },
  bindPickerChange(e){
    // this.setData({
    //   type: this.data.payData[e.detail.value].type,
    // });
    getApp().globalData.payName = this.data.payData[e.detail.value].title;
    console.log(this.data.payData[e.detail.value].type);
    wx.navigateTo({
      url: '/pages/index/addPay/index?type=' + this.data.payData[e.detail.value].type,
    })
    // console.log(e.detail.value);
  },
  // 增加户号
  goAddAccount() {
    if(this.data.type){
      wx.navigateTo({
        url: '/pages/index/addPay/index?type=' + this.data.type,
      })
    }
  },
  // 直接去缴费
  goDetail(e) {
    var orgItem =  e.currentTarget.dataset.item;
    orgItem.payUnit=e.currentTarget.dataset.item.chargeOrgName
    console.log(orgItem);
    wx.navigateTo({
      url: `/pages/index/lifePay/index?orgItem=${JSON.stringify(
        orgItem
      )}&from=payment`
    })
  },
  // 设置标记
  setUp(e) {
    var orgItem =  e.currentTarget.dataset.item;
    orgItem.payUnit=e.currentTarget.dataset.item.chargeOrgName
    console.log(orgItem);
    wx.navigateTo({
      url: '/pages/index/setUp/index?orgItem=' + JSON.stringify(orgItem),
    })
  },
  // 编辑户号
  goEdit() {
    wx.navigateTo({
      url: '/pages/index/addPay/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  goDelete(e) {
    let id = e.currentTarget.dataset.id;
    let _this = this;
    wx.showModal({
      title: "友情提示",
      content: "确定要删除该户号吗？",
      confirmColor: '#26a886',
      success: function (res) {
        if (res.confirm) {
          var merchantData = {
            chargeCustId: id,
          }
          $api.custDelete(merchantData).then(res => {
            if (res.state) {
              wx.showToast({
                title: '删除成功',
              });
              setTimeout(function () {
                _this.custList();
              }, 500)
            } else {
              wx.showToast({
                title: res.message,
                icon: 'none'
              })
            }
          })
        } else {

        }
      }
    });
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