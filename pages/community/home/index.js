// pages/community/index.js
const $api = require('../../../utils/api.js').API;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    dataList: [],
    page: "1",
    pageSize: "10",
    categoryId: "",
    latituge: "", //纬度
    longituge: "", //经度
    totalPages: "", //接口返回的总页数
    inpValue: "", //输入框的值
    scrollHeight: "",
    isBindSuccess: true,
    currentCommunityName: "",
    currentCommunityId: "",
    currentCommunityOrgId: "",
    payData: [
      {
        id: 1,
        url: "/subpackage/community/images/communityNotice.png",
        title: "社区公告",
        Description: "公告展示",
        num: 0
      },
      // {
      //   id: 2,
      //   url: '/state/images/ranqi1.png',
      //   title: '社区管理',
      //   num: 0
      // },
      {
        id: 2,
        url: "/subpackage/community/images/onlineAppointment.png",
        Description: "提前预约",
        title: "在线预约"
      },
      {
        id: 3,
        url: "/subpackage/community/images/communityGuide.png",
        Description: "服务大厅",
        title: "办事指南",
        num: 0
      },
      {
        id: 4,
        url: "/subpackage/community/images/CommunityConsultation.png",
        Description: "社区问题咨询",
        title: "社区咨询"
      },
      {
        id: 5,
        url: "/subpackage/community/images/communityComplaints.png",
        Description: "投诉维权",
        title: "社区投诉"
      },
      {
        id: 6,
        url: "/subpackage/community/images/communityActivity.png",
        Description: "社区活动报名",
        title: "社区活动"
      },
      {
        id: 7,
        url: "/subpackage/community/images/communityMarket.png",
        Description: "真实二手交易",
        title: "跳蚤市场"
      }
      // {
      //   id: 9,
      //   url: '/state/images/gengduo.png',
      //   title: '其他'
      // },
    ],
    noticeList: [
      // 更多数据...
    ],
    pageParam: {
      page: 1,
      pageSize: 10,
      status: ""
    },
    //最新的一条社区公告信息标题
    newestNotice: "",
    //最新一条社区公告的所有信息
    newsetNoticeObject: null,
    noticeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this
    _this.getBindingRelationship()
    this.setListHeight()
  },
  goToBindPage() {
    wx.navigateTo({
      url: "/subpackage/community/info/index"
    })
  },
  handleCurrentChange(event) { 
    const { current } = event.detail
    this.setData({
      current
    })
  },
  //点击滚动的某一条公告数据后，跳转至该公告的详情页
  showtNotice() {
    const current = this.data.current
    const currentTarget = this.data.noticeList[current]
    let noticeId = currentTarget.noticeId
    if (noticeId && noticeId != "") {
      wx.navigateTo({
        url: "/subpackage/community/notice/details?noticeId=" + noticeId
      })
    } else {
      wx.showToast({
        title: "未获取到公告详情",
        icon: "none"
      })
    }
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
              _this.getNoticeList(false, _this.data.pageParam)
              _this.setData({
                currentCommunityName: response.value.communityName,
                currentCommunityId: response.value.communityId,
                currentCommunityOrgId: response.value.orgCode
              })
              wx.setStorage({
                key: "myCommunityInfo",
                data: {
                  communityId: response.value.communityId,
                  communityName: response.value.communityName,
                  tenantId: response.value.tenantId,
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
              wx.setStorageSync("orgCode", response.value.orgCode)
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
        wx.showToast({
          title: "未检测到用户ID",
          icon: "none"
        })
      }
    })
    // $api.isEmptyByCustId
  },
  /**
   * 根据接口获取社区功能模块
   */
  getCommunityFunction() {},
  //获取社区公告列表并滚动展示
  getNoticeList(isPage, pageConfig) {
    let _this = this
    let pageParam = null
    if (pageConfig) {
      pageParam = pageConfig
    } else {
      pageParam = {
        page: 1,
        pageSize: 10,
        status: ""
      }
    }
    $api.getCommunityNoticeList(pageParam).then((res) => {
      if (!isPage) {
        let noticeList = res.value.rows
        if (noticeList) {
          for (let i = 0; i < noticeList.length; i++) {
            let noticeTitle = noticeList[i].title
            noticeTitle = _this.subNoticeTitle(noticeTitle)
            noticeList[i].title = noticeTitle
          }
          _this.setData({
            noticeList: noticeList
          })
        }
      }
    })
  },
  //进入各社区服务模块
  goCommunityServiece(option) {
    console.log("type ===>", option)
    const type = option.currentTarget.dataset.type
    let service_item_path = ""
    if (type == "notice") {
      //社区公告
      service_item_path = "/subpackage/community/notice/index"
    } else if (type == "appoint") {
      //在线预约
      service_item_path =
        `/subpackage/community/appoint/index?currentCommunityOrgId=${this.data.currentCommunityOrgId}`
    } else if (type == "guide") {
      //办事指南
      service_item_path = "/subpackage/community/guide/index"
    } else if (type == "consult") {
      //社区咨询
      service_item_path = "/subpackage/community/counsel/index"
    } else if (type == "complaints") {
      //社区投诉
      service_item_path = "/subpackage/community/question/index"
    } else if (type == "activity") {
      //社区活动
      service_item_path = "/subpackage/community/activity/index"
    } else if (type == "market") {
      //跳蚤市场
      service_item_path = "/subpackage/community/market/index"
    }
    wx.navigateTo({
      url: service_item_path
    })
  },
  //截取社区公告标题，多于指定标题字数，省略号显示
  subNoticeTitle(noticeTitle) {
    let subSize = 16
    let noticeTitleSub = ""
    if (noticeTitle && noticeTitle.length <= subSize) {
      noticeTitleSub = noticeTitle
    } else if (noticeTitle && noticeTitle.length > subSize) {
      noticeTitleSub = noticeTitle.substring(0, subSize) + "..."
    }
    return noticeTitleSub
  },
  // 动态计算高度
  setListHeight() {
    const systemInfo = wx.getSystemInfoSync()
    const rpx = systemInfo.windowWidth / 750
    const tapHeight = Math.floor(rpx * 140)
    console.log("systemInfo ===>", systemInfo)
    console.log("tapHeight ===>", tapHeight)
    const scrollHeight = systemInfo.windowHeight - tapHeight
    this.setData({
      scrollHeight
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