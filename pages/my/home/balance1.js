const $api = require('../../../utils/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: null, // 列表容器高度
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    orderList: [],
    appointData: {
      page: 1,
      pageSize: 5,
      yearMonth: ''
    },
    totalPages: 1,
    balanceMoney: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setListHeight();
    this.isBalance();
  },
  isBalance() {
    wx.showModal({
      title: '您尚未开通钱包账户',
      content: '使用充值、缴费等功能，需先开通钱包账户',
      confirmText: '立即开通',
      confirmColor: '#26a886',
      cancelColor: '#999',
      success: function (res) {
        if (res.confirm) { 
          wx.navigateTo({
            url: '/pages/my/home/openAccount',
          })
        } else { 
        }
      }
    })
  },

  /**
   * 设置商品列表高度
   */
  setListHeight() {
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = Math.floor(rpx * 480), // tap高度
      scrollHeight = systemInfo.windowHeight - tapHeight; // swiper高度
    this.setData({
      scrollHeight
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  recharge() {
    wx.navigateTo({
      url: '/pages/my/home/recharge1',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.billList();
  },

  billList(isPage, page) {
    let _this = this;
    page = page || 1;
    _this.data.appointData.page = page;
    _this.setData({
      appointData: _this.data.appointData
    })
    $api.balance(_this.data.appointData).then(res => {
      if (res.state) {
        if (isPage == true) {
          _this.setData({
            orderList: _this.data.orderList.concat(res.value.rows),
            totalPages: res.value.totalPages,
            balanceMoney: res.value.amount,
            isLoading: false,
          })
        } else {
          console.log("1212");
          _this.setData({
            orderList: res.value.rows,
            totalPages: res.value.totalPages,
            balanceMoney: res.value.amount,
            isLoading: false,
          })
          // console.log(res.value.amount);
        }
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
    wx.stopPullDownRefresh();
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad() {
    // 已经是最后一页
    if (this.data.appointData.page >= this.data.totalPages) {
      this.setData({
        no_more: true
      });
      return false;
    }
    // 加载下一页列表
    this.billList(true, ++this.data.appointData.page);
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