// pages/index/addAddress/index.js
const $api = require('../../../utils/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: {
      contact: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      address: '',
      defaultFlag: '0'
    },
    inpVal: '',
    checked: false,
    addressId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      addressId: options.addressId
    })
    if (options.addressId) {
      wx.setNavigationBarTitle({
        title: '修改地址',
      })
      this.getDetail(options.addressId)
    } else {
      wx.setNavigationBarTitle({
        title: '新建地址',
      })
    }
  },
  // 详情接口
  getDetail(addressId) {
    $api.addressDetail({ addressId: addressId }).then(res => {
      console.log(res)
      if (res.state) {
        this.setData({
          dataList: res.value,
          inpVal: res.value.province + res.value.city + res.value.district,
          checked: res.value.defaultFlag == 1 ? true : false
        })
      }
    })
  },
  // 获取地址
  bindRegionChange(e) {
    this.setData({
      "dataList.province": e.detail.value[0],
      "dataList.city": e.detail.value[1],
      "dataList.district": e.detail.value[2],
      inpVal: e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
    })
  },
  // 设为默认
  change(e) {
    console.log(e)
    if (e.detail.value) {
      this.setData({
        "dataList.defaultFlag": "1"
      })
    } else {
      this.setData({
        "dataList.defaultFlag": "0"
      })
    }
  },
  // 获取联系人
  getContact(e) {
    this.data.dataList.contact = e.detail.value
  },
  //获取手机号
  getPhone(e) {
    this.data.dataList.phone = e.detail.value
  },
  //获取地址
  getAddress(e) {
    this.data.dataList.address = e.detail.value
  },
  // 校验
  rule() {
    const dataList = this.data.dataList
    if (!dataList.contact) {
      console.log(1111)
      wx.showToast({
        title: '请输入联系人',
        icon: 'none'
      })
      return
    } else if (!dataList.phone) {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none'
      })
      return
    } else if (!dataList.address) {
      wx.showToast({
        title: '请输入地址',
        icon: 'none'
      })
      return
    }
  },
  //提交
  submit() {
    this.rule()
    if (this.data.addressId) {
      this.updateAddress()
    } else {
      this.addAddress()
    }
  },
  // 新建接口
  addAddress() {
    $api.addAddress(this.data.dataList).then(res => {
      if (res.state) {
        wx.showToast({
          title: '新建成功',
          icon: 'success'
        })
        setTimeout(function () {
          wx.navigateBack()
        }, 500)
      }
    })
  },
  // 修改接口
  updateAddress() {
    $api.updateAddress(this.data.dataList).then(res => {
      if (res.state) {
        wx.showToast({
          title: '修改成功',
          icon: 'success'
        })
        setTimeout(function () {
          wx.navigateBack()
        }, 500)
      }
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