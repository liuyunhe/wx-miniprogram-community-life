const $api = require("../../../utils/api.js").API
const App = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    itemTag: [
      {
        id: 10,
        name: "功能建议",
        checked: false
      },
      {
        id: 11,
        name: "内容建议",
        checked: false
      },
      {
        id: 12,
        name: "BUG反馈",
        checked: false
      },
      {
        id: 13,
        name: "界面建议",
        checked: false
      },
      {
        id: 14,
        name: "交互建议",
        checked: false
      },
      {
        id: 99,
        name: "其它",
        checked: false
      }
    ],
    //泰安城建反馈与投诉
    adviceType: "10",
    //社区咨询
    //adviceType: '20',
    //社区投诉
    //adviceType: '30',

    formData: {},
    navTitle: "",
    acceptOrgId: "",
    type: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let adviceType = ""
    let navTitle = ""
    let acceptOrgId = ""
    let type = ""
    console.log(options)
    if (options.type) {
      if (options.type == "counsel") {
        //社区咨询
        navTitle = "社区咨询"
        adviceType = "20"
        type = "counsel"
        acceptOrgId = wx.getStorageSync("orgCode") //从缓存中获取绑定的社区id
      } else if (options.type == "question") {
        //社区投诉
        navTitle = "社区投诉"
        adviceType = "30"
        type = "question"
        acceptOrgId = wx.getStorageSync("orgCode") //从缓存中获取绑定的社区id
      } else if (options.type == "good") {
        navTitle = "商品咨询"
        adviceType = "40"
        type = "good"
        acceptOrgId = options.orgId //orgId为商品orgId
      }
    } else {
      console.log("adviceType====")
      navTitle = "意见反馈"
      adviceType = "10"
      type = "adviceType"
    }
    //设置标题
    wx.setNavigationBarTitle({
      title: navTitle
    })
    this.setData({
      adviceType: adviceType,
      navTitle: navTitle,
      acceptOrgId: acceptOrgId,
      type
    })
  },

  /**
   * 点击tab切换
   */
  swichNav: function (e) {
    var _this = this
    console.log("====" + e.target.dataset.id)
    for (var i = 0; i < _this.data.itemTag.length; i++) {
      if (_this.data.itemTag[i].id == e.target.dataset.id) {
        _this.data.itemTag[i].checked = true
      } else {
        _this.data.itemTag[i].checked = false
      }
    }
    _this.setData({
      itemTag: _this.data.itemTag,
      adviceType: e.target.dataset.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.uploadImg = this.selectComponent("#uploadImg")
  },
  handleItemChange(e) {
    let _this = this
    var values = _this.data.formData
    values.adviceImage = JSON.stringify(e.detail)
    values.acceptOrgId = _this.data.acceptOrgId
    values.adviceType = _this.data.adviceType
    values.applicant = wx.getStorageSync("wechatNickName")
    const type = this.data.type
    // values.acceptOrgId = "1646805444485844992";
    // 表单验证
    if (!_this.validation(values)) {
      App.showError(_this.data.error)
      return false
    }
    if (type === "counsel" || type === "question" || type === "good") {
      if (type === "good") {
        $api.addStoreGoodsAdvice(values).then((res) => {
          if (res.state) {
            wx.showToast({
              title: "提交成功",
              duration: 2000
            })
            setTimeout(function () {
              wx.navigateBack()
            }, 1000)
          } else {
            wx.showToast({
              title: res.message,
              icon: "none"
            })
          }
        })
      } else { 
        $api.addCommunityAdvice(values).then((res) => {
          if (res.state) {
            wx.showToast({
              title: "提交成功",
              duration: 2000
            })
            setTimeout(function () {
              wx.navigateBack()
            }, 1000)
          } else {
            wx.showToast({
              title: res.message,
              icon: "none"
            })
          }
        })
      }
      
    } else if (type === "adviceType") {
      delete values.acceptOrgId
      $api.adviceAdd(values).then((res) => {
        if (res.state) {
          wx.showToast({
            title: "提交成功",
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack()
          }, 1000)
        } else {
          wx.showToast({
            title: res.message,
            icon: "none"
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

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
  onShareAppMessage() {},
  /**
   * 表单提交
   */
  saveData: function (e) {
    console.log("saveData ===>", e)
    let _this = this
    _this.setData({
      formData: e.detail.value
    })
    _this.uploadImg.uploadImg()
  },

  /**
   * 表单验证
   */
  validation: function (values) {
    if (values.content === "") {
      this.data.error = "问题内容不能为空"
      return false
    }
    if (values.phone.length < 1) {
      this.data.error = "手机号不能为空"
      return false
    }
    if (values.phone.length !== 11) {
      this.data.error = "手机号长度有误"
      return false
    }
    let reg = /^((0\d{2,3}-\d{7,8})|(1[345689]\d{9}))$/
    if (!reg.test(values.phone)) {
      this.data.error = "手机号不符合要求"
      return false
    }
    return true
  }
})
