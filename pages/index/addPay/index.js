const $api = require('../../../utils/api.js').API;
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCheck: false,
    payName: '',
    payImg: '',
    payUnit: '',
    orgList: [],
    type: '',
    orgItem: {},
    custChargeNo: '',
    attributes:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    if(options.attributes){
      this.setData({
        attributes: JSON.parse(options.attributes),
        custChargeNo:JSON.parse(options.attributes).custChargeNo
      });
    }
    this.setData({
      type: options.type
    });
    if(options.type=='sf'){
      getApp().globalData.payImg = '/state/images/shui1.png'
    }else if(options.type=='rqf'){
      getApp().globalData.payImg = '/state/images/ranqi1.png'
    }else if(options.type=='rlf'){
      getApp().globalData.payImg = '/state/images/reli1.png'
    }
    console.log(options.type);
    this.merchantList();
  },
  getInputValue(e) {
    // console.log(e);
    this.setData({
      custChargeNo: e.detail.value
    });
    // console.log(this.data.custChargeNo);
  },
  // 选中
  onCheck() {
    let _this = this;
    this.setData({
      isCheck: !this.data.isCheck
    });
    // if(this.data.isCheck){
    //   wx.showModal({
    //     title: '友情提示',
    //     content: '开通代扣服务先请您先开通免密协议，您确定要开通免密协议吗？',
    //     confirmColor: '#26a886',
    //     success: function (res) {
    //       if (res.confirm) {
    //         wx.navigateTo({
    //           url: '/pages/my/home/openAccount',
    //         })
    //       } else if (res.cancel) {
    //         _this.setData({
    //           isCheck: !_this.data.isCheck
    //         });
    //       }
    //     }
    //   })
    // }
  },
  bindPickerChange(e) {
    let _this = this;
    console.log(_this.data.orgList[e.detail.value]);
    var orgItem = {
      chargeOrgId: _this.data.orgList[e.detail.value].merchantNo,
      chargeItem: _this.data.type,
      mcc: _this.data.orgList[e.detail.value].mcc,
      payUnit:_this.data.orgList[e.detail.value].merchantName,
    };
    _this.setData({
      payUnit: _this.data.orgList[e.detail.value].merchantName,
      orgItem: orgItem
    })
  },
  merchantList() {
    let _this = this;
    var merchantData = {
      chargeTypeKey: _this.data.type,
      page: 1,
      pageSize: 20,
    }
    $api.merchantList(merchantData).then(res => {
      if (res.state) {
        _this.setData({
          orgList: res.value,
          isLoading: false,
        });
        if(Object.keys(_this.data.attributes).length >0){
          for (let i = 0; i < _this.data.orgList.length; i++) {
            if(_this.data.orgList[i].merchantNo==_this.data.attributes.merchantNo){
              var orgItem = {
                chargeOrgId: _this.data.orgList[i].merchantNo,
                chargeItem: _this.data.type,
                mcc: _this.data.orgList[i].mcc,
                payUnit:_this.data.orgList[i].merchantName,
              };
              _this.setData({
                index:i,
                payUnit: _this.data.orgList[i].merchantName,
                orgItem: orgItem
              })
              // _this.setData({
              //   index:i,
              //   payUnit:res.value[i].merchantName
              // });
              break;
            }
          }
        }else{
    
        }
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },

  // 下一步
  goTo() {
    let _this = this;
    _this.data.orgItem.custChargeNo = _this.data.custChargeNo;
    if(_this.data.isCheck){
      _this.data.orgItem.withholdState = 1;
    }else{
      _this.data.orgItem.withholdState = 0;
    }
    this.setData({
      orgItem: _this.data.orgItem
    });
    if (_this.data.payUnit=='') {
      App.showError("请选择缴费单位");
      return false;
    }
    if (_this.data.custChargeNo=='') {
      App.showError("请输入用户编号");
      return false;
    }
    // if (!_this.data.isCheck) {
    //   App.showError("请您先确认缴费协议");
    //   return false;
    // }
    // if (!_this.data.isCheck) {
    //   getApp().$showToast('请先确认缴费协议', 'none')
    // } else {
      console.log(_this.data.orgItem);
      wx.navigateTo({
        url: '/pages/index/lifePay/index?orgItem=' + JSON.stringify(_this.data.orgItem),
      })
    // }
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
    console.log(getApp().globalData.payImg);
    this.setData({
      payImg: getApp().globalData.payImg,
      payName: getApp().globalData.payName,
      id: getApp().globalData.payName,
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