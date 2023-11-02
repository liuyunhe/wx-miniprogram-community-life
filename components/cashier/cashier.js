const $api = require("../../utils/api.js").API
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    price: {
      // 属性名
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollHeight: null,
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    appointData: {
      page: 1,
      pageSize: 5
    },
    totalPages: 2,
    isCheck: "", //选中状态
    payType: [],
    navigationBarTitleText: ""
  },

  lifetimes: {
    created() {
      // const pages = getCurrentPages()
      // const page = pages[pages.length - 1]
      // const route = page.route
      // const navigationBarTitleText =
      //   __wxConfig.page[`${route}.html`].window.navigationBarTitleText
      // this.setData({
      //   navigationBarTitleText
      // })
      this.getPayChannelList()
      wx.setNavigationBarTitle({
        title: "收银台"
      })
    },
    detached() {
      console.log("=====>detached")
      // wx.setNavigationBarTitle({
      //   title: this.data.navigationBarTitleText
      // })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    radioChange(e) {
      const payType = this.data.payType
      for (let i = 0, len = payType.length; i < len; ++i) {
        payType[i].checked = payType[i].payChannelType === e.detail.value
      }
      console.log(e)
      console.log(payType)
      this.setData({
        payType,
        isCheck: e.detail.value
      })
    },
    handleClickBtnPay() {
      if (!this.data.isCheck) {
        wx.showToast({
          title: "请选择支付方式",
          icon: "none"
        })
        return
      }
      this.triggerEvent("choosePayType", this.data.isCheck)
    },
    getPayChannelList(isPage, page) {
      let _this = this
      page = page || 1
      _this.data.appointData.page = page
      _this.setData({
        appointData: _this.data.appointData
      })
      const params = {
        payChannelType: "13",
        ..._this.data.appointData
      }
      $api.getPayChannelList(params).then((res) => {
        res.value.rows.forEach((e) => {
          console.log()
          e.url = JSON.parse(e.logo)[0].url
        })
        if (res.state) {
          if (isPage == true) {
            _this.setData({
              payType: _this.data.payType.concat(res.value.rows),
              totalPages: res.value.totalPages,
              isLoading: false
            })
          } else {
            _this.setData({
              payType: res.value.rows,
              totalPages: res.value.totalPages,
              isLoading: false
            })
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: "none"
          })
        }
      })
    },

    /**
     * 下拉到底加载数据
     */
    bindDownLoad: function () {
      // 已经是最后一页
      if (this.data.appointData.page >= this.data.totalPages) {
        this.setData({
          no_more: true
        })
        return false
      }
      // 加载下一页列表
      this.getPayChannelList(true, ++this.data.appointData.page)
    }
  }
})