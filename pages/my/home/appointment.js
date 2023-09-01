const $api = require('../../../utils/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataType: '',
    scrollHeight: null, // 列表容器高度
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    list: [],
    appointData: {
      page: 1,
      pageSize: 10,
      status: ''
    },
    totalPages: 1,
    tanData: [{
        id: '0',
        name: '我的预约'
      },
      {
        id: '1',
        name: '我的报修'
      },
      {
        id: '2',
        name: '我的活动'
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const dataType = options.dataType
    if (dataType) {
      this.setData({
        dataType
      })
    }
    this.setListHeight();
  },

  /**
   * 设置商品列表高度
   */
  setListHeight() {
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = Math.floor(rpx * 100), // tap高度
      scrollHeight = systemInfo.windowHeight - tapHeight; // swiper高度
    this.setData({
      scrollHeight
    });
  },

  bindHeaderTap(e) {
    let _this = this;
    _this.data.appointData.status = e.currentTarget.dataset.type;
    _this.setData({
      dataType: e.currentTarget.dataset.type,
      isLoading: true,
      no_more: false,
      orderList: [],
      appointData: _this.data.appointData
    });
    _this.appointList();
  },
  appointList(isPage, page) {
    let _this = this;
    page = page || 1;
    _this.data.appointData.page = page;
    _this.setData({
      appointData: _this.data.appointData
    })
    $api.appointList(_this.data.appointData).then(res => {
      if (res.state) {
        if (isPage == true) {
          _this.setData({
            list: _this.data.list.concat(res.value.rows),
            totalPages: res.value.totalPages,
            isLoading: false,
          })
        } else {
          _this.setData({
            list: res.value.rows,
            totalPages: res.value.totalPages,
            isLoading: false,
          })
        }
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },

  details(e) {
    wx.navigateTo({
      url: '/pages/my/home/appointmentDetails?details=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },

  cancel(e) {
    let _this = this;
    var content = '';
    var successStr = '';
    if (e.currentTarget.dataset.status == '4') {
      content = '确认要取消该预约吗？';
      successStr = '取消成功';
    } else {
      content = '确认要删除该预约吗？';
      successStr = '删除成功'
    }
    wx.showModal({
      title: '友情提示',
      content: content,
      success(res) {
        if (res.confirm) {
          _this.appointUpdate(e.currentTarget.dataset.id, e.currentTarget.dataset.status, successStr);
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  appointUpdate(id, status, successStr) {
    let _this = this;
    var upDate = {
      id: id,
      status: status
    }
    $api.appointUpdate(upDate).then(res => {
      if (res.state) {
        _this.setData({
          list: [],
          isLoading: true,
          no_more: false,
        })
        _this.appointList();
        wx.showToast({
          title: successStr,
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
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
    this.appointList(true, ++this.data.appointData.page);
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
    this.appointList();
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