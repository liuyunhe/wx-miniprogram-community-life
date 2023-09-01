// pages/index/address/index.js
const $api = require('../../../utils/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    page: 1,
    pageSize: 10,
    totalPages: '',
    default_id: null,
    isTo: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      isTo: options.isTo
    });
    console.log(this.data.isTo);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      default_id: null,
      dataList: []
    });
    this.getList()
  },
  //获取数据
  getList() {
    let data = {
      page: this.data.page,
      pageSize: this.data.pageSize
    }
    $api.addressList(data).then(res => {
      if (res.state) {
        if (this.data.page == 1) {
          this.setData({
            dataList: res.value.rows,
            totalPages: res.value.totalPages
          });
          for (let i = 0; i < res.value.rows.length; i++) {
            if (res.value.rows[i].defaultFlag == '1') {
              this.setData({
                default_id: res.value.rows[i].addressId
              })
            }
          }
        } else {
          this.setData({
            dataList: this.data.dataList.concat(res.value.rows),
            totalPages: res.value.totalPages
          })
        }

      }
    })
  },
  //选中地址
  check(option) {
    console.log(option)
    let addressId = option.currentTarget.dataset.addressid
    wx.navigateTo({
      url: '/pages/service/order/index?addressId=' + addressId,
    })
  },
  /**
   * 设置为默认地址
   */
  setDefault: function (e) {
    let _this = this;
    _this.setData({
      default_id: parseInt(e.detail.value)
    });
    var addressData = {
      addressId: e.detail.value,
      defaultFlag: '1'
    }
    $api.updateAddress(addressData).then(res => {
      if (res.state) {
        wx.showToast({
          title: '设置成功',
          icon: 'success'
        });
        if (_this.data.isTo==1) {
          console.log(_this.data.isTo);
          setTimeout(function () {
           wx.navigateBack();
          }, 500)
        }
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },
  //新建地址和编辑地址
  goAddaddress(e) {
    const addressId = e.currentTarget.dataset.addressid
    console.log(e)
    if (addressId) {
      wx.navigateTo({
        url: '/pages/service/addAddress/index?addressId=' + addressId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/service/addAddress/index',
      })
    }
  },
  // 删除地址
  deleteAddress(option) {
    const addressId = option.currentTarget.dataset.addressid
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success(res) {
        if (res.confirm) {
          $api.deleteAddress({
            addressId: addressId
          }).then(res => {
            if (res.state) {
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
              that.setData({
                page: '1',
                pageSize: '10'
              })
              setTimeout(function () {
                that.getList();
              }, 500)
            }
          })
        }
      },
    })


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
    if (this.data.totalPages > this.data.page) {
      this.setData({
        page: this.data.page + 1
      })
      this.getList()
    }

    console.log(e)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})