// subpackage/mall/search/sort.js
const $api = require("../../../utils/api.js").API
Page({
  /**
   * 页面的初始数据
   */
  data: {
    categoryId: null,
    goodsName: null,  // 输入框内容
    goodList: [],
    sortData: [],
    totalPages: 1,
    page: 1,
    pageSize: 10,
    noMoreGoods: false //是否已经加载完所有商品
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { categoryId } = options
    console.log(categoryId)
    if (categoryId) {
      this.setData({
        categoryId
      })
    }
    this.getStoreGoodsList()
    this.getCategoryListById()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  getValue(e) {
    this.setData({
      goodsName: e.detail.value
    })
  },

  goInstall() {
    this.setData({
      goodList: [],
      page: 1,
      totalPages: 1
    })
    this.getStoreGoodsList()
  },

  // 查询商品类目
  getCategoryListById() {
    $api.getCategoryListById({ parentId: this.data.categoryId }).then((res) => {
      if (res.state) {
        this.setData({
          sortData: res.value
        })
      }
    })
  },

  // 查询商品列表
  getStoreGoodsList(clearFlag) {
    const params = {
      page: this.data.page,
      pageSize: this.data.pageSize,
      goodsName: this.data.goodsName
    }
    if (this.data.categoryId) {
      params.categoryId = this.data.categoryId
    }
    console.log(params)
    $api.getStoreGoodsList(params).then((res) => {
      if (res.state) {
        console.log(res)
        this.setData({
          goodList: clearFlag ? [...res.value.rows] :[...this.data.goodList, ...res.value.rows],
          page: res.value.page,
          totalPages: res.value.totalPages
        })
      }
    })
  },

  goMallSort(e) {
    const id = e.currentTarget.dataset.id
    this.setData({
      categoryId: id,
      page: 1,
      goodsName:""
    })
    this.getStoreGoodsList(true)  
  },

  goGoodDetal(e) { 
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/subpackage/mall/goodDetail/index?id=${id}`
    })
  },

  // 加入购物车
  addToChart(e) {
    const goodsId = e.currentTarget.dataset.id
    const custId = wx.getStorageSync("custId")
    const params = {
      custId,
      goodsId,
      quantity: 1,
      checked: "1"
    }
    $api.addGoodsToChart(params).then((res) => {
      if (res.state) {
        wx.showToast({
          title: "加入购物车成功",
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
  onReachBottom() {
    if (this.data.goodList.length === 0) return
    if (this.data.totalPages === this.data.page) {
      console.log("商品列表====已到最后一页")
      return
    } else {
      console.log("商品列表====加载下一页")
      this.setData({
        page: this.data.page + 1
      })
      this.getStoreGoodsList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})
