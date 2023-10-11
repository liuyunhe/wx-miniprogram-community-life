const prefix = {
  handy: "/handy",
  accept: "/accept",
  applet: "/applet",
  common: "/common",
  group: "/group",
  file: "/file",
  pay: "/pay",
  community: "/community",
  store: "/store"
}
const API = {
  register: (data) =>
    request("POST", prefix.applet + "/v1/wechat/register", data), //根据微信小程序code获取手机号并完成注册；
  getToken: (data) => request("POST", prefix.applet + "/v1/wechat/login", data), //获取最新token
  getQRUserInfo: (data) =>
    request("GET", prefix.applet + "/v1/qrCode/userInfo", data), // 小程序前端通过接口向后端查询用户是否有权登录管理端
  confirmQRLogin: (data) =>
    request("POST", prefix.applet + "/v1/qrCode/confirm", data), // 小程序前端通过接口向后端发送确信用户登录管理端
  getByTypeId: (data) =>
    request("GET", prefix.common + "/v1/sys/dataDict/v1/getByTypeId", data), //查询字典
  serviceList: (data) =>
    request("POST", prefix.handy + "/v1/serviceInfo/list", data), //查询服务信息
  serviceDetail: (data) =>
    request("POST", prefix.handy + "/v1/serviceInfo/detail", data), //查询服务信息表详情
  queryAssetBasicInfo: (data) =>
    request("POST", prefix.group + "/v1/assetBasic/queryAssetBasicInfo", data), //分页查询资产
  queryAssetTimeQuantumDate: (data) =>
    request(
      "POST",
      prefix.group + "/v1/assetTimeQuantum/queryAssetTimeQuantumDate",
      data
    ), //查询预约时间
  queryAssetTimeQuantumInfo: (data) =>
    request(
      "POST",
      prefix.group + "/v1/assetTimeQuantum/queryAssetTimeQuantumInfo",
      data
    ), //查询预约场次
  serviceOrderInfoList: (data) =>
    request("POST", prefix.handy + "/v1/serviceOrderInfo/list", data), //分页查询服务订单信息
  addServiceOrderInfo: (data) =>
    request("POST", prefix.handy + "/v1/serviceOrderInfo/add", data), //添加服务订单信息
  updateServiceOrderInfo: (data) =>
    request("POST", prefix.handy + "/v1/serviceOrderInfo/update", data), //更新服务订单信息
  deleteServiceOrderInfo: (data) =>
    request("POST", prefix.handy + "/v1/serviceOrderInfo/delete", data), //删除服务订单信息
  addressList: (data) =>
    request("POST", prefix.applet + "/v1/cust/address/list", data), //查询收获地址
  addAddress: (data) =>
    request("POST", prefix.applet + "/v1/cust/address/add", data), //新增收货地址
  addressDetail: (data) =>
    request("GET", prefix.applet + "/v1/cust/address/detail", data), //查询收货地址详情
  updateAddress: (data) =>
    request("POST", prefix.applet + "/v1/cust/address/update", data), //修改收货地址
  deleteAddress: (data) =>
    request("POST", prefix.applet + "/v1/cust/address/delete", data), //删除收获地址
  defaultAddress: (data) =>
    request("GET", prefix.applet + "/v1/cust/address/default", data), //查询默认收获地址
  // payHandyOrder: (data) =>
  //   request('POST', prefix.pay + '/v1/merchantpay/payOrder', data), //便民下支付订单
  payHandyOrder: (data) =>
    request("POST", prefix.handy + "/v1/pay/payOrder", data),
  getMerchantInfoByShortLink: (data) =>
    request(
      "get",
      prefix.accept + "/v1/terminal/getMerchantInfoByShortLink",
      data
    ), //获取商户信息
  payOrder: (data) =>
    request("POST", prefix.applet + "/v1/wxpay/payOrder", data), //下支付订单
  appointList: (data) =>
    request("POST", prefix.group + "/v1/appoint/list", data), //预约列表
  appointAdd: (data) => request("POST", prefix.group + "/v1/appoint/add", data), //添加预约
  appointUpdate: (data) =>
    request("POST", prefix.group + "/v1/appoint/update", data), //更新预约状态
  repairAdd: (data) =>
    request("POST", prefix.group + "/v1/cust/repair/add", data), //客户报修申请
  repairList: (data) =>
    request("POST", prefix.group + "/v1/cust/repair/list", data), //客户报修列表
  onlinePreview: (data) =>
    request(
      "GET",
      prefix.file + "/v1/onlinePreviewController/onlinePreview",
      data
    ), //图片预览
  adviceAdd: (data) =>
    request("POST", prefix.common + "/v1/cust/advice/add", data), //客户意见反馈
  addCommunityAdvice: (data) =>
    request("POST", prefix.common + "/v1/cust/advice/addCommunityAdvice", data), //社区咨询投诉
  addStoreGoodsAdvice: (data) =>
    request(
      "POST",
      prefix.common + "/v1/cust/advice/addStoreGoodsAdvice",
      data
    ), //商品咨询
  adviceList: (data) =>
    request("POST", prefix.common + "/v1/cust/advice/list", data), //客户建议列表
  adviceDetail: (data) =>
    request("GET", prefix.common + "/v1/cust/advice/detail", data), //客户建议详情
  billList: (data) =>
    request("POST", prefix.pay + "/v1/payBillInfo/list", data), //客户账单查询
  getSummary: (data) =>
    request("GET", prefix.pay + "/v1/payBillInfo/ieSummary", data), //客户月账单收支汇总查询
  merchantList: (data) =>
    request("POST", prefix.accept + "/v1/merchant/list", data), //查询缴费机构列表
  chargeBill: (data) => request("POST", prefix.group + "/v1/charge/bill", data), //查询客户缴费账单信息
  custList: (data) =>
    request("POST", prefix.group + "/v1/charge/cust/list", data), //查询缴费客户
  custOrder: (data) =>
    request("POST", prefix.applet + "/v1/cust/order/list", data), //客户支付订单查询
  custDelete: (data) =>
    request("POST", prefix.group + "/v1/charge/cust/delete", data), //解绑缴费客户信息
  chargePay: (data) =>
    request("POST", prefix.group + "/v1/chargePay/payOrder", data), //下生活缴费订单
  transApplyList: (data) =>
    request("POST", prefix.group + "/v1/transApply/list", data), //客户缴费订单查询
  wechatUser: (data) =>
    request("POST", prefix.applet + "/v1/wechat/user", data), //修改微信昵称
  userInfo: (data) =>
    request("GET", prefix.applet + "/v1/wechat/user/info", data), //获取微信小程序当前登录用户信息
  queryEmployeeInfo: (data) =>
    request("GET", prefix.accept + "/v1/employeeInfo/queryEmployeeInfo", data), //员工信息
  notice: (data) => request("POST", prefix.group + "/v1/notice/list", data), //通知公告
  noticeDetail: (data) =>
    request("GET", prefix.group + "/v1/notice/detail", data), //通知公告
  recharge: (data) =>
    request("POST", prefix.applet + "/v1/wxpay/recharge", data), //充值
  balance: (data) =>
    request("POST", prefix.pay + "/v1/payBillInfo/balance/list", data), //余额查询
  evaluate: (data) =>
    request("POST", prefix.group + "/v1/cust/repair/evaluate", data), //客户评价
  charge: (data) =>
    request("POST", prefix.group + "/v1/charge/cust/flag", data), //修改缴费客户标记
  chargePoint: (data) =>
    request("GET", prefix.group + "/v1/charge/cust/graphic/point", data), //缴费客户图层
  merchantPoint: (data) =>
    request("POST", prefix.accept + "/v1/merchant/graphic/point", data), //收费机构图层
  withhold: (data) =>
    request("POST", prefix.group + "/v1/charge/cust/withhold", data), //修改开通/取消代扣
  findUseChargeBill: (data) =>
    request("GET", prefix.group + "/v1/charge/cust/findUsChargeBill", data), //查询是否存在缴费账单
  findListChargeBill: (data) =>
    request("POST", prefix.group + "/v1/charge/cust/findListChargeBill", data), //查询列表是否存在缴费账单

  // *****************社区**********************
  getCommunityInfoList: (data) =>
    request("POST", prefix.community + "/v1/communityInfo/list", data), //获取社区列表信息
  getCommunityGuideList: (data) =>
    request("POST", prefix.community + "/v1/communityGuide/list", data), //获取社区指南列表信息
  getCommunityGuideDetail: (data) =>
    request("GET", prefix.community + "/v1/communityGuide/detail", data), //获取社区指南详情信息
  getCommunityNoticeList: (data) =>
    request("POST", prefix.community + "/v1/communityNotice/list ", data), //获取社区公告列表信息
  getCommunityNoticeDetail: (data) =>
    request("GET", prefix.community + "/v1/communityNotice/detail", data), //获取社区公告详情信息
  getCommunityActivityList: (data) =>
    request("POST", prefix.community + "/v1/communityActivity/list ", data), //获取社区活动列表信息
  getCommunityActivityDetail: (data) =>
    request("GET", prefix.community + "/v1/communityActivity/detail", data), //获取社区活动列表信息
  communitySignup: (data) =>
    request("POST", prefix.community + "/v1/communitySignup/list", data), //社区活动报名查询
  communitySignupAdd: (data) =>
    request("POST", prefix.community + "/v1/communitySignup/add", data), //社区活动报名新增
  communitySignupDel: (data) =>
    request("GET", prefix.community + "/v1/communitySignup/delete", data), //社区活动取消报名
  communityBinding: (data) =>
    request("POST", prefix.community + "/v1/communityBinding/add", data), //新增社区绑定关系
  isEmptyByCustId: (data) =>
    request(
      "GET",
      prefix.community + "/v1/communityBinding/isEmptyByCustId",
      data
    ), //查询是否已绑定社区
  queryProtocolId: (data) =>
    request("GET", prefix.applet + "/v1/wallet/queryProtocolId", data), //根据userid查询协议编号
  goodPublish: (data) =>
    request("POST", prefix.community + "/v1/communityMarketGoods/add", data), //跳蚤市场商品发布
  getGoodsList: (data) =>
    request("POST", prefix.community + "/v1/communityMarketGoods/list", data), //跳蚤市场商品列表
  GoodsListUpdate: (data) =>
    request("POST", prefix.community + "/v1/communityMarketGoods/update", data), //跳蚤市场商品状态更新
  getGoodsDetail: (data) =>
    request("GET", prefix.community + "/v1/communityMarketGoods/detail", data), //跳蚤市场商品详情
  addEvaluate: (data) =>
    request("POST", prefix.common + "/v1/cust/advice/addEvaluate", data), //添加反馈评价

  // *****************支付**********************
  checkSignPayProtocol: (data) =>
    request(
      "POST",
      prefix.pay + "/applet/v1/wallet/checkSignPayProtocol",
      data
    ), //签订e支付小额免密协议短信校验
  signPayProtocol: (data) =>
    request("POST", prefix.pay + "/applet/v1/wallet/signPayProtocol", data), //签订e支付小额免密协议
  isSignProtocol: (data) =>
    request("POST", prefix.pay + "/applet/v1/wallet/isSignProtocol", data), //签订e支付小额免密协议查询接口
  rescindUserProtocol: (data) =>
    request("POST", prefix.pay + "/applet/v1/wallet/rescindUserProtocol", data), //解约e支付小额免密协议
  queryProtocolId: (data) =>
    request("GET", prefix.pay + "/applet/v1/wallet/queryProtocolId", data), //根据userid查询协议编号
  merchantStoreInfo: (data) =>
    request("POST", prefix.handy + "/v1/merchantStoreInfo/point", data), //查询便民服务商家基本信息图层

  // *****************商城**********************
  getCategoryListById: (data) =>
    request(
      "GET",
      prefix.store + "/v1/cjStoreCategory/searchCategoryForId",
      data
    ), //查询商城首页商品类目
  getStoreGoodsList: (data) =>
    request("POST", prefix.store + "/v1/cjStoreGoods/list", data), //查询商城首页商品列表
  getStoreGoodsDetal: (data) =>
    request("GET", prefix.store + "/v1/cjStoreGoods/detail", data), //查询商城首页商品列表
  getMallChartCount: (data) =>
    request("GET", prefix.store + "/v1/cjShoppingCart/countAll", data), //查询购物车商品数量
  getMallChartList: (data) =>
    request("POST", prefix.store + "/v1/cjShoppingCart/list", data), //查询购物车商品
  getMallChartListByShop: (data) =>
    request("GET", prefix.store + "/v1/cjShoppingCart/listAll", data), //根据商户查询购物车表
  addGoodsToChart: (data) =>
    request("POST", prefix.store + "/v1/cjShoppingCart/add", data), //购物车添加商品
  updateChartByGood: (data) =>
    request("POST", prefix.store + "/v1/cjShoppingCart/update", data), //更新购物车
  updateChartAfterPlaceOrder: (data) =>
    request("POST", prefix.store + "/v1/cjShoppingCart/updateStatus", data), //结算更新购物车
  deleteGoodInChart: (data) =>
    request("POST", prefix.store + "/v1/cjShoppingCart/delete", data), //删除购物车商品
  updateCheckedActive: (data) =>
    request(
      "POST",
      prefix.store + "/v1/cjShoppingCart/updateChecked?state=1",
      data
    ), //批量更新选择状态
  updateCheckedDeactive: (data) =>
    request(
      "POST",
      prefix.store + "/v1/cjShoppingCart/updateChecked?state=0",
      data
    ), //批量更新选择状态
  addStoreOrder: (data) =>
    request("POST", prefix.store + "/v1/cjStoreOrder/add", data), //创建订单
  getStoreOrder: (data) =>
    request("POST", prefix.store + "/v1/cjStoreOrder/list", data), //订单列表
  getOrderDetail: (data) =>
    request("GET", prefix.store + "/v1/cjStoreOrder/detail", data), //订单详情
  addGoodComment: (data) =>
    request("POST", prefix.store + "/v1/cjGoodsComment/add", data), //新增评论
  getCommentList: (data) =>
    request("POST", prefix.store + "/v1/cjGoodsComment/list", data), //商品评论列表
  getOrderPaydata: (data) =>
    request("POST", prefix.store + "/v1/cjStoreOrder/contiuePay", data) //继续支付
}
const baseUrl = "https://tacj.openunion.cn/api"

function request(method, url, data) {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      mask: true,
      title: "加载中"
    })
    const token = wx.getStorageSync("token")
    var isToken = url.slice(-8)
    console.log("isToken====", isToken)
    var header = {}
    if (isToken.indexOf("register") >= 0 || isToken.indexOf("login") >= 0) {
      header = {
        "content-type": "application/json"
      }
    } else {
      header = {
        "content-type": "application/json",
        authorization: "Bearer " + token
      }
    }
    wx.request({
      url: baseUrl + url,
      data: data,
      method: method,
      header: header,
      success(res) {
        resolve(res.data)
      },
      fail(err) {
        reject(err)
      },
      complete() {
        wx.hideLoading()
      }
    })
  })
}

module.exports = {
  API,
  baseUrl
}
