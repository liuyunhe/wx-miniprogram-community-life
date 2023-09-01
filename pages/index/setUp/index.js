const $api = require('../../../utils/api.js').API;
var util = require('../../../utils/util.js');
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payImg: '',
    payName: '',
    id: '',
    orgItem: {},
    details: {},
    codeList: [
      {
        id: 1,
        name: '我家',
        selected: false
      },
      {
        id: 2,
        name: '公司',
        selected: false
      },
      {
        id: 3,
        name: '父母家',
        selected: false
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      orgItem: JSON.parse(options.orgItem)
    });
    if(this.data.orgItem.chargeCustFlag!='0'){
      var n = parseInt(this.data.orgItem.chargeCustFlag)-1;
      this.data.codeList[n].selected=true;
    }
    this.setData({
      codeList: this.data.codeList
    });
    this.chargeBill();
  },

  selectList(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    for (let i = 0; i < _this.data.codeList.length; i++) {
      if(i==index){
        _this.data.codeList[i].selected = !_this.data.codeList[i].selected;
        if(_this.data.codeList[i].selected){
          _this.charge(id);
        }else{
          _this.charge(0);
        }
      }else{
        _this.data.codeList[i].selected = false;
      }
    }
    _this.setData({
      codeList:_this.data.codeList,
      radioId:index,
      name:_this.data.codeList[index].name
    })
  },

  charge(flag) {
    let _this = this;
    var values = {
      chargeCustId: _this.data.orgItem.chargeCustId,
      chargeCustFlag: flag,
      chargeItem: _this.data.orgItem.chargeItem
    };
    $api.charge(values).then(res => {
      if (res.state) {
        wx.showToast({
          title: "设置成功",
          duration: 2000,
        });
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },

  chargeBill() {
    let _this = this;
    var orgItem = JSON.parse(JSON.stringify(_this.data.orgItem));
    delete orgItem.payUnit;
    $api.chargeBill(_this.data.orgItem).then(res => {
      if (res.state) {
        // var str = '*' + res.value.custName.substring(1);
        _this.setData({
          details: res.value,
          custName: '*' + res.value.custName.substring(1)
        });
        console.log(_this.data.details);
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
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
      payImg: getApp().globalData.payImg,
      payName: getApp().globalData.payName,
      id: getApp().globalData.payName,
    })
  },
  chargePay() {
    let _this = this;
    var payData = {
      chargeOrgId: _this.data.details.chargeOrgId,
      chargeOrgName: _this.data.orgItem.payUnit,
      mcc: _this.data.details.mcc,
      chargeItem: _this.data.details.chargeItem,
      chargeItemName: _this.data.payName,
      billId: _this.data.details.billId,
      custChargeNo: _this.data.details.custChargeNo,
      custChargeName: _this.data.custName,
      address: '测试地址',
      chargeNote: '测试备注',
      transAmount: _this.data.details.arrearsAmt * 100,
      channelId: '13',
      transactionType: 'JSAPI',
      serviceType: '2'
    };
    console.log(_this.data.orgItem);
    $api.chargePay(payData).then(res => {
      if (res.state) {
        App.wxPayment({
          payment: res.value.json,
          success: result => {
            var orderDetails = {
              orderId: res.value.transId,
              orderTime: util.dateTime(res.value.json.timeStamp),
              realPrice: _this.data.details.arrearsAmt * 100
            };
            wx.redirectTo({
              url: '/pages/index/home/success?details=' + JSON.stringify(orderDetails) + '&dataType=0',
            });
            // console.log(orderDetails)
          },
          fail: res => {
            console.log(res)
            App.showError('订单未支付', function () {
              wx.redirectTo({
                url: '/pages/my/order/index',
              })
            });
          },
        });
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
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