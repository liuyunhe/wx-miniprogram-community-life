// subpackage/my/openAccount/openAccount.js
const { baseUrl } = require('../../../utils/api')
const payOrderApi = `${baseUrl}/applet/v1/wallet/getInfoByR?id=`
const $api = require("../../../utils/api.js").API
// const url = `${openAccountApi}&token=Bearer ${token}`

Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { id } = options
    this.setData({
      url: payOrderApi + id
    })
    // $api.getInfoByR({ id }).then((res) => {
    //   console.log(res)
    // })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },

  handleBindMessage(e) { 
    const { data } = e.detail
    console.log(data)
    const payData = JSON.parse(decodeURIComponent(data[0]))
    console.log(payData)
    const pages = getCurrentPages() // 当前页面栈
    const currPage = pages[pages.length - 1] // 当前页面
    const prevPage = pages[pages.length - 2] // 上一个页面
    prevPage.setData({
      NEED_WX_PAY:true,
      payData
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