// pages/community/guide/particulars.js
const $api = require('../../../utils/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guideTitle:"",
    content:"",
    guideDetail:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let guideId = {
      id:options.guideId
    }
    $api.getCommunityGuideDetail(guideId).then(res =>{
      console.log("详情接口返回：",res)
      if(res.value){
        this.setData({
          guideTitle: res.value.title,
          content: res.value.content,
          guideDetail: res.value.guideDetail
        })
      }else{
        wx.showToast({
          title: '未查询到信息',
          icon: 'error',
          duration: 2000,
          success:function(){
          }
        })
      }
    })
    
    console.log("子页面收到的数据===>",options)
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