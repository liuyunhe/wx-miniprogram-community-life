// pages/my/order/index.js
const $api = require("../../../utils/api.js").API
const payDetail = getApp().globalData.payDetail
const custId = wx.getStorageSync("custId")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataType: "0",
    tanData: [{
        id: "0",
        name: "生活缴费"
      },
      {
        id: "1",
        name: "便民服务"
      },
      {
        id: "3",
        name: "在线商城"
      },
      {
        id: "2",
        name: "其他"
      }
    ],
    scrollHeight: null, // 列表容器高度
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    orderList: [
      //   {
      //   id: 0,
      // },
      // {
      //   id: 1,
      // },
    ],
    page: 1,
    pageSize: 10,
    totalPages: 1,
    orderId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this
    if (options.dataType) {
      _this.setData({
        dataType: options.dataType
      })
    } else {
      _this.setData({
        dataType: "0"
      })
    }
    _this.setListHeight()
  },
  //生活缴费
  transApplyList(isPage, page) {
    page = page || 1
    const data = {
      page: page,
      pageSize: this.data.pageSize
    }
    $api.transApplyList(data).then((res) => {
      if (res.state) {
        if (isPage == true) {
          this.setData({
            orderList: this.data.orderList.concat(res.value.rows),
            totalPages: res.value.totalPages,
            isLoading: false
          })
        } else {
          this.setData({
            orderList: res.value.rows,
            totalPages: res.value.totalPages,
            isLoading: false
          })
        }
      }
    })
  },
  // 便民服务
  serviceOrderInfoList(isPage, page) {
    page = page || 1
    const data = {
      page: page,
      pageSize: this.data.pageSize
    }
    $api.serviceOrderInfoList(data).then((res) => {
      if (res.state) {
        if (isPage == true) {
          this.setData({
            orderList: this.data.orderList.concat(res.value.rows),
            totalPages: res.value.totalPages,
            isLoading: false
          })
        } else {
          this.setData({
            orderList: res.value.rows,
            totalPages: res.value.totalPages,
            isLoading: false
          })
        }
      }
    })
  },
  handleClickBtnServiceComment(e) {
    const {
      orderId,
      serviceId
    } = e.currentTarget.dataset.value
    wx.navigateTo({
      url: `/pages/my/order/comment?orderId=${orderId}&serviceId=${serviceId}`
    })
  },
  // 其他
  custOrder(isPage, page) {
    page = page || 1
    const data = {
      page: page,
      pageSize: this.data.pageSize
    }
    $api.custOrder(data).then((res) => {
      if (res.state) {
        if (isPage == true) {
          this.setData({
            orderList: this.data.orderList.concat(res.value.rows),
            totalPages: res.value.totalPages,
            isLoading: false
          })
        } else {
          this.setData({
            orderList: res.value.rows,
            totalPages: res.value.totalPages,
            isLoading: false
          })
        }
      }
    })
  },
  // 在线上商城
  mallOrder(isPage, page) {
    page = page || 1
    const data = {
      page: page,
      pageSize: this.data.pageSize
    }
    $api.getStoreOrder(data).then((res) => {
      if (res.state) {
        if (isPage == true) {
          this.setData({
            orderList: this.data.orderList.concat(res.value.rows),
            totalPages: res.value.totalPages,
            isLoading: false
          })
        } else {
          this.setData({
            orderList: res.value.rows,
            totalPages: res.value.totalPages,
            isLoading: false
          })
        }
      }
    })
  },
  // 点击再次购买
  handleClickBtnBuyAgain(e) {
    const custId = wx.getStorageSync("custId")
    const {
      goodsid
    } = e.currentTarget.dataset
    const params = {
      custId,
      goodsId: goodsid,
      quantity: 1,
      checked: "1"
    }
    $api.addGoodsToChart(params).then((res) => {
      if (res.state) {
        wx.navigateTo({
          url: `/subpackage/mall/shoppingCart/index`
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: "none",
          duration: 2000
        })
      }
    })
  },
  handleClickBtnComment(e) {
    const {
      orderid,
      goodsid,
      goodstype = "0"
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/subpackage/mall/order/comment?orderId=${orderid}&goodsId=${goodsid}&goodsType=${goodstype}`
    })
  },
  handleClickReceiveGood(e) {
    const {
      orderid: id,
      index
    } = e.currentTarget.dataset
    const params = {
      id,
      status: "2"
    }
    $api.setOrderStatus(params).then((res) => {
      const orderList = this.data.orderList
      orderList[index].status = "2"
      this.setData({
        orderList
      })
      if (res.state) {
        const orderList = this.data.orderList
        orderList[index].status = "2"
        this.setData({
          orderList
        })
        wx.showToast({
          title: "收货成功！",
          icon: "success",
          duration: 2000
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: "none",
          duration: 2000
        })
      }
    })
  },
  // 立即支付
  goPay(e) {
    // console.log(e);
    let _this = this;
    const value = e.currentTarget.dataset.value
    let payData = {}
    if (_this.data.dataType == "0") {
      payData = JSON.parse(value.payUrl)
      _this.payment(payData);
    } else if (_this.data.dataType == "1") {
      // console.log(value);
      //便民服务立即支付
      if (value.paystate == '0') {
        $api.continuePayServiceOrder({
          orderId: value.onlyId
        }).then((res) => {
          if (res.state) {
            if (res.value.payInfo) {
              _this.payment(res.value.payInfo);
            } else {
              _this.serviceOrderInfoList();
            }
          } else {
            wx.showToast({
              title: res.message,
              icon: "none"
            })
          }
        })
      } else {
        $api.continuePayBalance({
          orderId: value.balancePayOrderId
        }).then((res) => {
          if (res.state) {
            if (res.value.payInfo) {
              _this.payment(res.value.payInfo);
            } else {
              _this.serviceOrderInfoList();
            }
          } else {
            wx.showToast({
              title: res.message,
              icon: "none"
            })
          }
        })
      }
      // payData = JSON.parse(value.paymentCode)
    } else if (_this.data.dataType == "2") {
      payData = JSON.parse(value.payUrl)
      _this.payment(payData);
    }
    // wx.requestPayment({
    //   timeStamp: payData.timeStamp,
    //   nonceStr: payData.nonceStr,
    //   package: payData.package,
    //   signType: payData.signType,
    //   paySign: payData.paySign,
    //   appId: payData.appId,
    //   success(res) {
    //     _this.setData({
    //       page: 1,
    //       isLoading: true,
    //       no_more: false,
    //       totalPages: 1,
    //       orderList: []
    //     })
    //     if (_this.data.dataType == "0") {
    //       _this.transApplyList()
    //     } else if (_this.data.dataType == "1") {
    //       _this.serviceOrderInfoList()
    //     } else if (_this.data.dataType == "2") {
    //       _this.custOrder()
    //     }
    //     // console.log(res)
    //     // if (res.errMsg == 'requestPayment:ok') {
    //     //   const details = {
    //     //     orderId: value.orderId,
    //     //     orderTime: util.dateTime(payData.timeStamp)
    //     //   }
    //     //   wx.redirectTo({
    //     //     url: '/pages/index/home/success?details=' + JSON.stringify(details),
    //     //   })
    //     // }
    //   },
    //   fail(err) {
    //     console.log(err)
    //   },
    //   complete(res) {
    //     console.log(res)
    //   }
    // })
  },
  payment(payData) {
    let _this = this;
    wx.requestPayment({
      timeStamp: payData.timeStamp,
      nonceStr: payData.nonceStr,
      package: payData.package,
      signType: payData.signType,
      paySign: payData.paySign,
      appId: payData.appId,
      success(res) {
        _this.setData({
          page: 1,
          isLoading: true,
          no_more: false,
          totalPages: 1,
          orderList: []
        })
        if (_this.data.dataType == "0") {
          _this.transApplyList()
        } else if (_this.data.dataType == "1") {
          _this.serviceOrderInfoList()
        } else if (_this.data.dataType == "2") {
          _this.custOrder()
        }
      },
      fail(err) {
        console.log(err)
      },
      complete(res) {
        console.log(res)
      }
    })
  },
  /**
   * 设置商品列表高度
   */
  setListHeight() {
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = Math.floor(rpx * 100), // tap高度
      scrollHeight = systemInfo.windowHeight - tapHeight // swiper高度
    this.setData({
      scrollHeight
    })
  },
  // 切换Tab
  bindHeaderTap(e) {
    const id = e.currentTarget.dataset.id
    this.setData({
      dataType: id,
      page: 1,
      isLoading: true,
      no_more: false,
      totalPages: 1,
      orderList: []
    })
    if (id == "0") {
      this.transApplyList()
    } else if (id == "1") {
      this.serviceOrderInfoList()
    } else if (id == "2") {
      this.custOrder()
    } else if (id == "3") {
      this.mallOrder()
    }
  },

  details(e) {
    const value = e.currentTarget.dataset.value
    if (this.data.dataType == "0") {
      payDetail.serviceName = value.chargeItemName
      payDetail.realPrice = value.transAmount / 100
      payDetail.paystate = value.status
      payDetail.paychannel = value.channelId;
      (payDetail.payDate = value.successTime),
      (payDetail.createDate = value.createTime)
      payDetail.dataType = this.data.dataType
    } else if (this.data.dataType == "1") {
      payDetail.serviceName = value.serviceName
      payDetail.realPrice = value.servicePrice
      payDetail.paystate = value.paystate
      payDetail.paychannel = value.paychannel
      payDetail.payDate = value.payDate
      payDetail.createDate = value.createDate
      payDetail.finalPaymentPrice = value.finalPaymentPrice
      payDetail.dataType = this.data.dataType
    } else if (this.data.dataType == "2") {
      payDetail.serviceName = value.merchantName
      payDetail.realPrice = value.amount / 100
      payDetail.paystate = value.status
      payDetail.paychannel = value.channelId;
      (payDetail.payDate = value.successTime),
      (payDetail.createDate = value.createTime)
      payDetail.dataType = this.data.dataType
    }
    wx.navigateTo({
      url: "/pages/my/order/details"
    })
  },
  mallOrderdetails(e) {
    const id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: `/subpackage/mall/order/detail?id=${id}`
    })
  },
  // 删除订单
  deleteOrder(e) {
    const orderId = e.currentTarget.dataset.orderid
    const that = this
    wx.showModal({
      title: "提示",
      content: "确定删除吗？",
      success(res) {
        if (res.confirm) {
          $api.deleteServiceOrderInfo(orderId).then((res) => {
            if (res.state) {
              wx.showToast({
                title: "删除成功",
                icon: "none"
              })
              that.setData({
                page: 1
              })
              that.serviceOrderInfoList()
            }
          })
        } else if (res.cancel) {
          console.log("用户点击取消")
        }
      }
    })
  },
  // 申请退款
  handleClickReturnOrder(e) {
    const orderType = this.data.dataType
    const orderId = e.currentTarget.dataset.orderid
    const goodsId = e.currentTarget.dataset.goodsid
    switch (orderType) {
      case "0": // 生活缴费
        break
      case "1": // 便民服务
        console.log(orderId)
        wx.navigateTo({
          url: `/pages/my/order/refund?orderId=${orderId}&&goodsId=${goodsId}&&type=1`
        })
        break
      case "3": // 在线商城
        console.log(orderId, goodsId)
        const totalNum = e.currentTarget.dataset.totalnum
        wx.navigateTo({
          url: `/pages/my/order/refund?orderId=${orderId}&&goodsId=${goodsId}&&totalNum=${totalNum}&&type=3`
        })
        break
      default:
        break
    }
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad() {
    console.log(this.data.page, this.data.totalPages)
    if (this.data.page >= this.data.totalPages) {
      this.setData({
        no_more: true
      })
    } else {
      this.setData({
        page: this.data.page + 1
      })
      if (this.data.dataType == "0") {
        this.transApplyList(true, this.data.page)
      } else if (this.data.dataType == "1") {
        this.serviceOrderInfoList(true, this.data.page)
      } else if (this.data.dataType == "2") {
        this.custOrder(true, this.data.page)
      } else if (this.data.dataType == "3") {
        this.mallOrder(true, this.data.page)
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      page: 1,
      isLoading: true,
      no_more: false,
      totalPages: 1,
      orderList: []
    })
    console.log(this.data.page)
    const _this = this
    const dataType = this.data.dataType
    if (dataType == "0") {
      _this.transApplyList()
    } else if (dataType == "1") {
      _this.serviceOrderInfoList()
    } else if (dataType == "2") {
      _this.custOrder()
    } else if (dataType == "3") {
      _this.mallOrder()
    }
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
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },
  showDialog(e) {
    this.setData({
      orderId: e.currentTarget.dataset.value.orderId,
      merchantId: e.currentTarget.dataset.value.merId,
      merchantName: e.currentTarget.dataset.value.merName,
      description: e.currentTarget.dataset.value.description
    })
    console.log(this.data.orderId)
    this.dialog.showDialog()
  },
  //取消事件
  _cancelEvent() {
    console.log("你点击了取消")
    this.dialog.hideDialog()
  },
  //确认事件
  _confirmEvent() {
    console.log("你点击了确定")
    this.dialog.hideDialog()
    this.setData({
      dataType: this.data.dataType,
      page: 1,
      isLoading: true,
      no_more: false,
      totalPages: 1,
      orderList: []
    })
    this.serviceOrderInfoList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})