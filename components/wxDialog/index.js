const approx = getApp().globalData.approx
Component({
  properties: {
    fatherData: Object
  },
  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false
  },

  methods: {
    open: function () {
      this.showModal()
    },
    close: function () {
      this.hideModal()
    },
    goOrder(option) {
      let value = option.currentTarget.dataset.value
      approx.assetId = value.assetId
      approx.startTime = value.startTime
      approx.endTime = value.endTime
      approx.appointDate = value.appointStartDate
      approx.stockId = value.assetQuantumId
      wx.navigateTo({
        url: '/pages/index/approxOrder/index',
      })
      this.close()
    },
    //显示对话框
    showModal: function () {
      // 显示遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      // this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    },
    //隐藏对话框
    hideModal: function () {
      // 隐藏遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: false
        })
      }.bind(this), 200)
    },

  }


})