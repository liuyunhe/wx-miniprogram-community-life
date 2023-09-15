const $api = require("../../../utils/api.js").API
// pages/community/activity/signUp.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageParam: {
      page: 1,
      pageSize: 10,
      status: ""
    },
    activityId: "",
    beginDate: "",
    endDate: "",
    userName: "",
    signupNum: "",
    mobileNumber: "",
    signupUpperLimit: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("options=>", options)
    this.setData({
      activityId: options.activityId
    })
    if (!wx.getStorageSync("myCommunityInfo")) { 
      this.getBindingRelationship()    
    } 
    this.dataInit()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},
  userInfo() {
    let _this = this
    $api.userInfo({}).then((res) => {
      if (res.state) {
        if (
          res.value.hasOwnProperty("wechatNickName") &&
          res.value.wechatNickName != ""
        ) {
          wx.setStorageSync("wechatNickName", res.value.wechatNickName)
          wx.setStorageSync("custId", res.value.custId)
          this.getBindingRelationship()
        }
      }
    })
  },
  /* 根据接口获取绑定关系 */
  getBindingRelationship() {
    let _this = this
    let custIdParam = ""
    wx.getStorage({
      key: "custId",
      success: function (res) {
        console.log("custId获取成功", res)
        custIdParam = res.data
        let param = {
          custId: custIdParam
        }
        $api
          .isEmptyByCustId(param)
          .then((response) => {
            console.log("isEmptyByCustId返回====>", response)
            if (!response.value) {
              // wx.showToast({
              //   title: '绑定社区成功',
              //   icon: 'success',
              //   duration: 2000,
              //   success:function(){
              //   }
              // })
              wx.showModal({
                content: "您未绑定社区，是否去绑定？",
                confirmText: "去绑定",
                cancelText: "取消",
                success: function (res) {
                  console.log(res)
                  //点击“去绑定”时进入社区管理页面
                  if (res.confirm) {
                    _this.setData({
                      isBindSuccess: true
                    })
                    wx.navigateTo({
                      url: "/subpackage/community/info/index"
                    })
                  } else {
                    _this.setData({
                      isBindSuccess: false
                    })
                  }
                }
              })
            } else {
              wx.setStorage({
                key: "myCommunityInfo",
                data: {
                  communityId: response.value.communityId,
                  communityName: response.value.communityName,
                  tenantId: response.value.tenantId
                },
                success(res) {
                  console.log("绑定社区成功=================>", res)
                  wx.hideLoading()

                  // wx.showToast({
                  //   title: '绑定社区成功',
                  //   icon: 'success',
                  //   duration: 2000,
                  //   success:function(){
                  //     wx.navigateBack({
                  //     })
                  //   }
                  // })
                }
              })
              wx.setStorageSync("communityId", response.value.communityId)
              wx.setStorageSync("orgId", response.value.orgId)
              wx.setStorageSync("communityName", response.value.communityName)
            }
          })
          .catch((err) => {
            wx.showToast({
              title: "网络异常",
              icon: "success",
              duration: 2000
            })
          })
      },
      fail: function (err) {
        console.log("custId获取失败", err)
        _this.userInfo()
      }
    })
    // $api.isEmptyByCustId
  },
  signUpSubmit() {
    let _this = this
    if (_this.data.signupNum > _this.data.signupUpperLimit) {
      wx.showToast({
        title: "报名人数超过限制",
        icon: "none",
        duration: 2000,
        success: function () {}
      })
      return
    }
    wx.getStorage({
      key: "myCommunityInfo",
      success: (result) => {
        wx.getStorage({
          key: "custId",
          success: (res) => {
            console.log("res=>", res)
            let param = {
              activityId: _this.data.activityId,
              communityId: result.data.communityId,
              communityName: result.data.communityName,
              tenantId: result.data.tenantId,
              custId: res.data,
              custName: _this.data.userName,
              telephoneNo: _this.data.mobileNumber,
              signupNum: _this.data.signupNum
            }
            console.log("param=>", param)
            $api.communitySignupAdd(param).then((response) => {
              console.log("活动报名接口返回=>", response)
              if (response.state === true) {
                wx.showToast({
                  title: "报名成功",
                  icon: "success",
                  image: "",
                  duration: 2000,
                  mask: false,
                  success: (result) => {
                    setTimeout(() => {
                      wx.navigateBack({})
                    }, 2000)
                  },
                  fail: () => {},
                  complete: () => {}
                })
              } else {
                wx.showToast({
                  title: response.message,
                  icon: "none",
                  image: "",
                  duration: 2000,
                  mask: false,
                  success: (result) => {},
                  fail: () => {},
                  complete: () => {}
                })
              }
            })
          },
          fail: () => {},
          complete: () => {}
        })
        console.log("result=>", result)
      },
      fail: () => {},
      complete: () => {}
    })
    console.log("活动报名")
  },
  /* 展示报名列表 */
  showSignUpList() {
    let pageParam = null
    if (this.pageParam) {
      pageParam = this.pageParam
    } else {
      pageParam = {
        page: 1,
        pageSize: 10,
        status: ""
      }
    }
    $api.communitySignup(pageParam).then((res) => {
      console.log("报名列表返回的数据====>", res)
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
  dataInit() {
    let param = {
      id: this.data.activityId
    }
    $api.getCommunityActivityDetail(param).then((res) => {
      console.log("详情接口返回：", res)
      if (res.value) {
        this.setData({
          title: res.value.title,
          // content: res.value.content,
          // time: res.value.time,
          beginDate: res.value.beginDate,
          endDate: res.value.endDate,
          signupUpperLimit: res.value.signupUpperLimit
          // endDate:res.value.endDate,
          // createTime:res.value.createTime,
        })
      } else {
        wx.showToast({
          title: "未查询到信息",
          icon: "error",
          duration: 2000,
          success: function () {}
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})
