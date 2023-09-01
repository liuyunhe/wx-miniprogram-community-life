// pages/community/activity/details.js
const $api = require('../../../utils/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    content:"",
    time:"",
    beginDate:"",
    endDate:"",
    createTime:"",
    activityId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let param = {
      id:options.activityId
    }
    $api.getCommunityActivityDetail(param).then(res =>{
      console.log("详情接口返回：",res)
      if(res.value){
        this.setData({
          title: res.value.title,
          content: res.value.content,
          // time: res.value.time,
          beginDate:res.value.beginDate,
          endDate:res.value.endDate,
          createTime:res.value.createTime,
          activityId:options.activityId
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
  },

  //报名
  activitySignUp(){
    console.log("this.activityId",this.data.activityId)
    let _this = this
      wx.navigateTo({
        url: "/subpackage/community/activity/signUp?activityId=" + _this.data.activityId
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