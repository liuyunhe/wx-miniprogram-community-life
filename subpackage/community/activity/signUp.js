const $api = require('../../../utils/api.js').API;
// pages/community/activity/signUp.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageParam:{
      page: 1,
      pageSize: 10,
      status: ''
    },
    activityId:'',
    beginDate:'',
    userName:'',
    IdNumber:'',
    mobileNumber:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("options=>",options)
    this.setData({
      activityId:options.activityId
    })
    this.dataInit()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  signUpSubmit(){
    let _this = this
    wx.getStorage({
      key: 'myCommunityInfo',
      success: (result)=>{
        wx.getStorage({
          key: 'custId',
          success: (res)=>{
            console.log("res=>",res)
            let param = {
              activityId:_this.data.activityId,
              communityId:result.data.communityId,
              communityName:result.data.communityName,
              tenantId:result.data.tenantId,
              custId:res.data,
              custName:_this.data.userName,
              telephoneNo:_this.data.mobileNumber,
              IdNumber:_this.data.IdNumber
            }
            console.log("param=>",param)
            $api.communitySignupAdd(param).then((response)=>{
              console.log("活动报名接口返回=>",response)
              if(response.state === true){
                wx.showToast({
                  title: '报名成功',
                  icon: 'success',
                  image: '',
                  duration: 1500,
                  mask: false,
                  success: (result)=>{
                    wx.navigateBack({
                    });
                  },
                  fail: ()=>{},
                  complete: ()=>{}
                })
              }
            })
          },
          fail: ()=>{},
          complete: ()=>{}
        });
        console.log("result=>",result)
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    console.log("活动报名")
  },
  /* 展示报名列表 */
  showSignUpList(){
    let pageParam = null
    if(this.pageParam){
      pageParam = this.pageParam
    }else{
      pageParam={
        page: 1,
        pageSize: 10,
        status: ''
      }
    }
    $api.communitySignup(pageParam).then((res)=>{
      console.log("报名列表返回的数据====>",res)
      this.setData({
        communityList: res.value.rows
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // this.showSignUpList()
  },
  //数据初始化
  dataInit(){
    let param = {
      id:this.data.activityId
    }
    $api.getCommunityActivityDetail(param).then(res =>{
      console.log("详情接口返回：",res)
      if(res.value){
        this.setData({
          title: res.value.title,
          // content: res.value.content,
          // time: res.value.time,
          beginDate:res.value.beginDate,
          // endDate:res.value.endDate,
          // createTime:res.value.createTime,
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