// pages/index/market/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ischeck: true,
    istrue: 1,
    tabList: [
      { id: '1', title: '上架物品' },
      { id: '2', title: '下架物品' },
      { id: '3', title: '待审核物品' }
    ],
    dataList:[
      {id:1,url:'/state/images/shizheng.png',title:'吹风机（95新）',prver:'100',},
      {id:1,url:'/state/images/shizheng.png',title:'吹风机（95新）',prver:'120',}
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '我的物品',
    })
  },
  changTab(option){
    this.setData({
      istrue:option.currentTarget.dataset.id
    })
    console.log(option)
  },
  repair(){
    
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