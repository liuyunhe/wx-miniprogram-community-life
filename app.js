const $api = require("./utils/api.js").API
const appid =  wx.getAccountInfoSync().miniProgram.appId
const {
  PRI_TMPL_ID_DEV,
  PRI_TMPL_ID_MASTER,
  APPID_DEV,
} = require("./utils/app-config.js")
App({
  /**
   * 全局变量
   */
  globalData: {
    custId: 0,
    radioType: false,
    appid,
    isIPhoneX: false,
    payImg: "", //缴费的图片
    payName: "", //缴费的名字，水费、燃气费还是热力
    id: "", //缴费的类型
    assetContent: "", //预约的详情
    assetName: "", //二级资产名称
    approx: {
      appointOrgId: "", //机构id
      orgid: "", //机构id
      appointOrgName: "", //机构名称
      storeId: "", //网点id
      storeName: "", //网点机构名称
      assetTypeName: "", //资产类型名称
      assetType: "", //资产类型
      assetName: "", //一级资产名称
      assetId: "", //资产id
      startTime: "", //开始预约时间
      endTime: "", //结束预约时间
      appointDate: "", //预约日期
      stockId: "", //预约场次id
      dataSource: "0",
      storeAddress: "",
      storeLatituge: "",
      storeLongituge: "",
      linkPhone: "",
      businessHours: ""
    },
    payDetail: {
      serviceName: "", //服务名称
      realPrice: "", //实付金额
      paystate: "", //支付状态
      paychannel: "", //付款方式
      payDate: "", //支付时间
      createDate: "", //创建时间
      dataType: "" //账单分类
    },
    payData: {
      serviceId: "", //服务Id
      serviceName: "", //服务名称
      unitPrice: "", //实收金额
      storeId: "", //门店Id
      storeName: "", //门店名称
      merchantId: "", //商户id
      merchantName: "", //商户名称
      mcc: "" //商户类型
    },
    inpValue: "", //便民服务的搜索内容
    imgUrl: "https://tacj.openunion.cn",
    shoppingCart: {
      //购物车
      list: [],
      totalPrice: 0,
      totalNum: 0
    },
    IMAGE_UPLOAD_URL:
      "https://tacj.openunion.cn/api/portal/file/onlinePreviewController/v1/getFileById_",
    priTmplId: appid == APPID_DEV ? PRI_TMPL_ID_DEV : PRI_TMPL_ID_MASTER
  },
  /**
   * 生命周期函数--监听小程序初始化
   */
  onLaunch(e) {
    let _this = this
    // 小程序主动更新
    _this.updateManager()
    if (wx.getStorageSync("token")) {
      //获取最新token
      _this.getToken()
    }
    console.log("onLaunch======")
  },
  // 判断设备是否为 iPhone X
  checkIsIPhoneX: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        var safeBottom = res.screenHeight - res.safeArea.bottom
        that.kBottomSafeHeight = safeBottom
        //根据安全高度判断
        if (safeBottom === 34) {
          that.isIPhoneX = true
          // console.log(that.isIPhoneX)
        }
      }
    })
  },
  onLoad() {
    let _this = this
    // console.log("app.js ---onLoad---");
  },
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow(options) {
    // console.log("app.js ---onShow---");
    // this.getWxappBase();
  },

  onHide: function () {
    // console.log("app.js ---onHide---");
  },
  onError: function (msg) {
    // console.log("app.js ---onError---" + msg);
  },
  // 获取token
  getToken() {
    let _this = this
    var loginData = {
      token: "Bearer " + wx.getStorageSync("token")
    }
    $api.getToken(loginData).then((res) => {
      console.log(res)
      wx.setStorageSync("token", res.value.token)
    })
  },

  /**
   * 执行用户登录
   */
  doLogin() {
    // 保存当前页面
    let pages = getCurrentPages()
    if (pages.length) {
      let currentPage = pages[pages.length - 1]
      "pages/login/login" != currentPage.route &&
        wx.setStorageSync("currentPage", currentPage)
    }
    // 跳转授权页面
    wx.navigateTo({
      url: "/pages/login/login"
    })
  },

  getBpmTemplateByPagination(data) {
    let _this = this
    let querys_ = []
    if (data.queryFilter.querys) {
      let keys = Object.keys(data.queryFilter.querys)
      keys.forEach((key) => {
        let conditionItem = data.condition.find((item) => key == item.name)
        if (conditionItem) {
          querys_.push({
            property: key,
            value: data.queryFilter.querys[key],
            group: "main",
            relation: "AND",
            operation: conditionItem.qt.toLocaleUpperCase()
          })
        } else {
          querys_.push({
            property: key,
            value: data.queryFilter.querys[key],
            group: "main",
            relation: "AND",
            operation: "IN"
          })
        }
      })
    }
    data.queryFilter.querys = querys_
    /**自定义sql视图查询vo */
    const dataTemplateQueryVo = {
      /**业务对象主键 */
      templateId: data.templateId,
      /**通用查询对象 */
      queryFilter: data.queryFilter
    }
    if (data.isJoinFlow && data.taskType && data.defKey) {
      dataTemplateQueryVo.isJoinFlow = data.isJoinFlow
      /**
       * 任务类型 todo代办 done已办 request我的请求 todoRead待阅 doneRead已阅 myRead我传阅的 myDelegate我转办的
       */
      dataTemplateQueryVo.taskType = data.taskType
      dataTemplateQueryVo.defKey = data.defKey //流程定义key
    }
    if (data.selectField) {
      /**关联查询字段名称 */
      dataTemplateQueryVo.selectField = data.selectField
      /**关联查询字段值 */
      dataTemplateQueryVo.selectValue = data.selectValue
    }
    if (data.selectList) {
      /**关联查询数组 */
      dataTemplateQueryVo.selectList = data.selectList
    }
    /**作为子表时外键的值 */
    dataTemplateQueryVo.refIdValue = data.refIdValue
    return dataTemplateQueryVo
    // request.post(
    //   form + '/form/dataTemplate/v1/listJson',
    //   dataTemplateQueryVo
    // )
  },

  /**
   * 小程序主动更新
   */
  updateManager() {
    console.log("updateManager")
    if (!wx.canIUse("getUpdateManager")) {
      return false
    }
    const updateManager = wx.getUpdateManager()
    if (!updateManager) return
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: "更新提示",
        content: "新版本已经准备好，即将重启应用",
        showCancel: false,
        confirmColor: "#26a886",
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: "更新提示",
        content: "新版本下载失败",
        confirmColor: "#26a886",
        showCancel: false
      })
    })
  },

  /**
   * 显示失败提示框
   */
  showError(msg, callback) {
    wx.showModal({
      title: "友情提示",
      content: msg,
      showCancel: false,
      confirmColor: "#26a886",
      success(res) {
        // callback && (setTimeout(function() {
        //   callback();
        // }, 1500));
        callback && callback()
      }
    })
  },

  /**
   * 发起微信支付
   */
  wxPayment(option) {
    let options = Object.assign(
      {
        payment: {},
        success: () => {},
        fail: () => {},
        complete: () => {}
      },
      option
    )
    console.log("options=====", options)
    wx.requestPayment({
      timeStamp: options.payment.timeStamp,
      nonceStr: options.payment.nonceStr,
      package: options.payment.package,
      signType: options.payment.signType,
      paySign: options.payment.paySign,
      appId: options.payment.appId,
      success(res) {
        options.success(res)
      },
      fail(res) {
        options.fail(res)
      },
      complete(res) {
        options.complete(res)
      }
    })
  },
  $showToast(title, icon) {
    wx.showToast({
      title: title,
      icon: icon
    })
  }
})