// pages/service/home/index.js
const $api = require('../../../utils/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsData: [
      { id: "26-1", title: '安装维修' },
      { id: "26-2", title: '管家服务' },
      { id: "26-3", title: '产品配送' }
    ],
    dataList: [
    ],
    page: '1',
    pageSize: '10',
    categoryId: '',
    latituge: '',//纬度
    longituge: '',//经度
    totalPages: '',  //接口返回的总页数
    inpValue: '',//输入框的值
    scrollHeight:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.mark);
    const that = this
    console.log(this.data.page)
    wx.getLocation({
      type: "gcj02",
      success(res) {
        console.log(res)
        that.setData({
          latituge: res.latitude,
          longituge: res.longitude
        })
        that.getByTypeId()
      },
      fail(err) {
        that.getByTypeId()
      }
    })
    this.setListHeight()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },
  // 动态计算高度
  setListHeight() {
    const systemInfo = wx.getSystemInfoSync()
    const rpx = systemInfo.windowWidth / 750
    const tapHeight = Math.floor(rpx * 140)
    const scrollHeight = systemInfo.windowHeight - tapHeight
    this.setData({
      scrollHeight
    });
  },
  // 查询字典接口
  getByTypeId() {
    $api.getByTypeId({typeId:'1595400275139629056'}).then(res => {
      if (res.state) {
        this.setData({
          newsData: res.value,
          categoryId: res.value[0].key
        })
        this.getList()
      }
    })
  },
  // 获取列表接口
  getList() {
    const data = {
      page: this.data.page,
      pageSize: this.data.pageSize,
      categoryId: this.data.categoryId,
      latituge: this.data.latituge,
      longituge: this.data.longituge
    }
    $api.serviceList(data).then(res => {
      if (res.state) {
        if (this.page > 1) {
          this.setData({
            dataList: this.data.dataList.concat(res.value.rows),
            totalPages: res.value.totalPages
          })
        } else {
          this.setData({
            dataList: res.value.rows,
            totalPages: res.value.totalPages
          })
        }
      }
    })
  },
  // 改变选项
  change(e) {
    this.setData({
      categoryId: e.currentTarget.dataset.key,
      page: '1',
      pageSize: '10',
    })
    this.getList()
  },
  // 去详情
  goDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/service/installDetail/index?serviceid=' + e.currentTarget.dataset.serviceid,
    })
  },
  // 搜索
  goInstall() {
    console.log(this.data.inpValue)
    getApp().globalData.inpValue = this.data.inpValue
    wx.navigateTo({
      url: '/pages/service/install/index',
    })
  },
  // 获取输入框的值
  getValue(e) {
    this.setData({
      inpValue: e.detail.value
    })
  },
  // scroll-view触发底部方法
  scrollBotten(e) {
    if (this.data.totalPages > this.data.page) {
      this.setData({
        page: this.data.page + 1
      })
      this.getList()
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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
  onReachBottom(e) {
    console.log(e)

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})