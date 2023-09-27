const $api = require('../../../utils/api.js').API;
// pages/community/activity/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activitiesList: [],
    dataType: "",
    scrollHeight: null, // 列表容器高度
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    appointData: {
      page: 1,
      pageSize: 10,
      state: ""
    },
    totalPages: 1,
    showTopBar: true //默认显示顶部工具栏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("options=>", options)
    //如果是从“我的”页面过来的，则隐藏顶部栏，并查询已报名的活动
    if (options.fromPage && options.fromPage == "myPage") {
      let appointData = this.data.appointData
      appointData.custId = wx.getStorageSync("custId")
      this.setData({
        showTopBar: false,
        appointData,
        dataType: '2'
      })
    }
    this.showActivityList(false)
    this.setListHeight()
  },
  // 动态计算高度
  setListHeight() {
    const systemInfo = wx.getSystemInfoSync()
    const rpx = systemInfo.windowWidth / 750
    const tapHeight = Math.floor(rpx * 100)
    console.log("systemInfo ===>", systemInfo)
    console.log("tapHeight ===>", tapHeight)
    const scrollHeight = systemInfo.windowHeight - tapHeight
    this.setData({
      scrollHeight
    })
  },
  bindHeaderTap(e) {
    let _this = this
    let bindTap = e.currentTarget.dataset.type
    let state = ""
    if (bindTap == "") {
      state = ""
      delete _this.data.appointData.custId
    } else if (bindTap == "1") {
      state = "1"
      delete _this.data.appointData.custId
    } else if (bindTap == "2") {
      state = ""
      _this.data.appointData.custId = wx.getStorageSync("custId")
    } else if (bindTap == "4") {
      state = "4"
      delete _this.data.appointData.custId
    }
    _this.data.appointData.state = state
    _this.setData({
      dataType: e.currentTarget.dataset.type,
      isLoading: true,
      no_more: false,
      orderList: [],
      appointData: _this.data.appointData
    })
    console.log(this.data.no_more)
    this.showActivityList(false)
  },
  acticitiesDetails(item) {
    let detailInfo = item.currentTarget.dataset.detail
    wx.navigateTo({
      url: `/subpackage/community/activity/details?activityId=${detailInfo.activityId}&dataType=${this.data.dataType}`
    })
  },

  handleCancel(e) { 
    const _this = this
    const { id } = e.currentTarget.dataset
    $api.communitySignupDel({ id }).then((res) => {
      if (res.state) {
        wx.showToast({
          title: "取消成功！",
          icon: "success",
          duration: 2000,
          mask: false,
          success: () => {
            setTimeout(() => { 
              const appointData = _this.data.appointData
              _this.setData({
                isLoading: true,
                no_more: false,
                orderList: [],
                appointData
              })
              this.showActivityList(false)
            },2000)
          },
          fail: () => {},
          complete: () => {}
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: "none"
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},
  bindDownLoad() {
    // 已经是最后一页
    if (this.data.appointData.page >= this.data.totalPages && this.data.activitiesList.length>0) {
      this.setData({
        no_more: true
      })
      return false
    }
    // 加载下一页列表
    this.showActivityList(true, ++this.data.appointData.page)
  },
  /* 展示活动列表 */
  showActivityList(isPage, page) {
    let _this = this
    page = page || 1
    _this.data.appointData.page = page
    _this.setData({
      appointData: _this.data.appointData
    })
    let pageParam = null
    if (_this.data.appointData) {
      pageParam = _this.data.appointData
    } else {
      pageParam = {
        page: 1,
        pageSize: 10,
        state: ""
      }
    }
    $api.getCommunityActivityList(pageParam).then((res) => {
      let activityListTmp = []
      let totalPages
      console.log(res.value)
      if (res.value.rows && res.value.rows.length) {
        activityListTmp = res.value.rows
        totalPages = res.value.totalPages
        for (let i = 0; i < activityListTmp.length; i++) {
          let url = activityListTmp[i].activityImage
          let urlParse = _this.ParsePicture(url)
          activityListTmp[i].activityImage = urlParse
        }
      }

      if (isPage == true) {
        this.setData({
          activitiesList: this.data.activitiesList.concat(activityListTmp),
          isLoading: false,
          totalPages
        })
      } else {
        this.setData({
          activitiesList: activityListTmp,
          isLoading: false,
          totalPages
        })
      }
    })
  },

  // 解析图片地址
  ParsePicture(jsonData) {
    let parseUrl = ""
    let result = ""
    if (jsonData == "" || jsonData == null) {
      return result
    }
    let pictureObject = JSON.parse(jsonData)
    console.log("pictureObject ===>", pictureObject)

    console.log(
      "pictureObject.constructor === Array ",
      pictureObject.constructor === Array
    )
    if (pictureObject.constructor === Array) {
      parseUrl = pictureObject.length > 0 ? pictureObject[0].url : ""
      console.log("pictureObject[0] ===>", pictureObject[0])
      result = parseUrl
    } else if (pictureObject.activityImage) {
      parseUrl = pictureObject.url
      result = parseUrl
    } else {
      result = ""
    }
    return result
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
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