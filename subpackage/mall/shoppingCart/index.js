const $api = require("../../../utils/api.js").API
const shoppingCart = getApp().globalData.shoppingCart
const App = getApp()
Page({
  data: {
    list: [],
    startX: "",
    startY: "",
    totalPages: 1,
    page: 1,
    pageSize: 10,
    noMoreGoods: false, //是否已经加载完所有商品
    totalPrice: 0,
    totalNum: 0,
    totalGoodsNum: 0,
    isCheckAll: false,
    //删除模块data
    deletList: [],
    isCheckDeleteAll: false,
    showEdit: false
  },

  onLoad: function () {},

  onShow: function () {
    this.getMallChartList()
  },

  getMallChartList() {
    $api.getMallChartListByShop().then((res) => {
      if (res.state) {
        this.setData({
          list: res.value ? res.value : []
        })
        this.setListX()
      }
    })
  },

  handleToggleShop(e) {
    const shop = e.currentTarget.dataset.shop
    const shopChecked = e.currentTarget.dataset.shop.shopChecked
    console.log(shop)
    const cartIdArr = shop.list.map((good) => good.cartId)
    if (shopChecked) {
      this.updateCheckedDeactive(cartIdArr)
    } else {
      this.updateCheckedActive(cartIdArr)
    }
  },

  handleToggleGood(e) {
    const good = e.currentTarget.dataset.good
    console.log(good)
    if (good.checked === 1) {
      this.updateChartByGoods(good.cartId, good.quantity, 0, good.status)
    } else {
      this.updateChartByGoods(good.cartId, good.quantity, 1, good.status)
    }
  },

  //减少商品数量
  handleSubtractGoodNum(e) {
    const good = e.currentTarget.dataset.good
    console.log(good)
    if (good.quantity === 1) {
      // 删除商品
      this.deleteGoodInChart(good.cartId)
    } else {
      this.updateChartByGoods(
        good.cartId,
        good.quantity - 1,
        good.checked,
        good.status
      )
    }
  },

  // 增加商品数量
  handleAddGoodNum(e) {
    const good = e.currentTarget.dataset.good
    console.log(good)
    this.updateChartByGoods(
      good.cartId,
      good.quantity + 1,
      good.checked,
      good.status
    )
  },

  // 更新购物车
  // status 1-已购买 2-已删除
  updateChartByGoods(cartId, quantity, checked, status) {
    const params = {
      cartId,
      quantity,
      checked,
      status
    }
    $api.updateChartByGood(params).then((res) => {
      if (res.state) {
        this.getMallChartList()
      } else { 
        wx.showToast({
          title: "当前库存不足",
          icon: "error",
          duration: 2000
        })
      }
    })
  },

  //删除商品
  deleteGoodInChart(id, cb) {
    let idList
    if (Array.isArray(id)) {
      idList = id
    } else {
      idList = [id]
    }
    $api.deleteGoodInChart(idList).then((res) => {
      if (res.state) {
        this.getMallChartList()
        // 批量删除回调
        cb && cb()
        cb && wx.showToast({
          title: "删除成功",
          icon: "success",
        })       
      }
    })
  },

  handleClickDel(e) {
    const id = e.currentTarget.dataset.id
    this.deleteGoodInChart(id)
  },

  handleClickBtnEdit() {
    this.setData({
      showEdit: true
    })
  },

  handleClickBtnEditClear() {
    this.setData({
      showEdit: false,
      isCheckDeleteAll: true
    })
    this.handleToggleDeleteAll()
  },

  handleClickBtnDelete() {
    const cartIAarr = []
    this.data.list.map((item) => {
      item.list.map((goods) => {
        if (goods.deleteChecked === 1) {
          cartIAarr.push(goods.cartId)
        }
      })
    })
    if (cartIAarr.length === 0) {
      App.showError("请选择要删除商品！")
    } else { 
    this.deleteGoodInChart(cartIAarr, () => {
      this.handleClickBtnEditClear()
    })
    }
  },

  updateCheckedActive(arr) {
    $api.updateCheckedActive(arr).then((res) => {
      if (res.state) {
        this.getMallChartList()
      }
    })
  },

  updateCheckedDeactive(arr) {
    $api.updateCheckedDeactive(arr).then((res) => {
      if (res.state) {
        this.getMallChartList()
      }
    })
  },

  handleToggleAll() {
    const cartIdArr = []
    this.data.list.map((item) => {
      item.list.map((good) => {
        cartIdArr.push(good.cartId)
      })
    })
    if (!this.data.isCheckAll) {
      this.updateCheckedActive(cartIdArr)
    } else {
      this.updateCheckedDeactive(cartIdArr)
    }
  },

  handleToggleGoodDelete(e) {
    const goodsId = e.currentTarget.dataset.id
    const list = this.data.list
    let isCheckDeleteAll = false
    let shopCheckedNum = 0
    list.map((item) => {
      let deleteChecked = 0
      item.list.map((good) => {
        if (good.goodsId === goodsId) {
          good.deleteChecked === 1
            ? (good.deleteChecked = 0)
            : (good.deleteChecked = 1)
        }
        deleteChecked += good.deleteChecked
      })
      if (deleteChecked === item.list.length) {
        item.shopDeleteChecked = true
        shopCheckedNum += 1
      } else {
        item.shopDeleteChecked = false
      }
    })
    if (shopCheckedNum === this.data.list.length) {
      isCheckDeleteAll = true
    }
    this.setData({
      list,
      isCheckDeleteAll
    })
  },

  handleToggleShopDelete(e) {
    const shopDeleteChecked = e.currentTarget.dataset.shop.shopDeleteChecked
    const merchantId = e.currentTarget.dataset.shop.merchantId
    const list = this.data.list
    let isCheckDeleteAll = false
    let shopCheckedNum = 0
    if (shopDeleteChecked) {
      list.map((item) => {
        if (item.merchantId === merchantId) {
          item.shopDeleteChecked = false
          item.list.map((item) => {
            item.deleteChecked = 0
          })
        }
        item.shopDeleteChecked ? (shopCheckedNum += 1) : (shopCheckedNum += 0)
      })
    } else {
      list.map((item) => {
        if (item.merchantId === merchantId) {
          item.shopDeleteChecked = true
          item.list.map((item) => {
            item.deleteChecked = 1
          })
        }
        item.shopDeleteChecked ? (shopCheckedNum += 1) : (shopCheckedNum += 0)
      })
    }
    if (shopCheckedNum === this.data.list.length) {
      isCheckDeleteAll = true
    }
    this.setData({
      list,
      isCheckDeleteAll
    })
  },

  handleToggleDeleteAll() {
    const list = this.data.list
    let isCheckDeleteAll = this.data.isCheckDeleteAll
    // 点击完成按钮重置状态
    if (isCheckDeleteAll) {
      isCheckDeleteAll = false
      this.data.list.map((item, index) => {
        item.shopDeleteChecked = false
        item.list.map((goods) => {
          // 滑动复位
          goods.x = 0
          goods.deleteChecked = 0
        })
      })
    } else {
      isCheckDeleteAll = true
      this.data.list.map((item, index) => {
        item.shopDeleteChecked = true
        item.list.map((goods) => {
          // 滑动复位
          goods.x = 0
          goods.deleteChecked = 1
        })
      })
    }

    this.setData({
      startX: "",
      startY: "",
      list,
      isCheckDeleteAll
    })
  },

  goOrder() {
    const goodsChecked = []
    const GoodsCheckedSortByStore = new Map()
    this.data.list.map((item) => {
      item.list.map((good) => {
        console.log(good)
        if (good.checked) {
          const goodItem = {
            cartId: good.cartId,
            merchantId: item.merchantId,
            merchantName: item.merchantName,
            goodsId: good.cjStoreGoodsVO.goodsId,
            goodsName: good.cjStoreGoodsVO.goodsName,
            price: good.cjStoreGoodsVO.price,
            image: good.cjStoreGoodsVO.image,
            quantity: good.quantity
          }
          goodsChecked.push(goodItem)
        }
      })
    })
    if (goodsChecked.length === 0) { 
      return wx.showToast({
        title: "请选择商品结算！",
        icon: "none",
        duration: 2000
      })
    }
    shoppingCart.list = goodsChecked
    shoppingCart.totalPrice = this.data.totalPrice
    shoppingCart.totalNum = this.data.totalNum
    console.log(getApp().globalData.shoppingCart)
    wx.navigateTo({
      url: "/subpackage/mall/confirmOrder/index?from=1"
    })
  },

  // 给每一项设置x值
  setListX() {
    let totalPrice = 0
    let totalGoodsNum = 0 //所有商品数量
    let totalNum = 0 //商品种类数量
    let shopCheckedNum = 0
    this.data.list.map((item) => {
      let checkNum = 0
      item.list.map((good) => {
        console.log(good.cjStoreGoodsVO.price)
        good.x = 0
        good.deleteChecked = 0
        if (good.checked === 1) {
          totalPrice += good.cjStoreGoodsVO.price * good.quantity
          totalGoodsNum += good.quantity
          totalNum += 1
          checkNum += 1
        }
      })
      item.shopChecked = checkNum === item.list.length
      item.shopDeleteChecked = false
      if (item.shopChecked) {
        shopCheckedNum += 1
      }
    })
    if (shopCheckedNum === this.data.list.length) {
      this.setData({
        isCheckAll: true
      })
    } else {
      this.setData({
        isCheckAll: false
      })
    }
    this.setData({
      totalPrice: totalPrice,
      list: this.data.list,
      totalNum: totalNum,
      totalGoodsNum: totalGoodsNum
    })
    console.log(this.data.list)
  },
  // 开始滑动
  touchMoveStartHandle(e) {
    // 我们要记录滑动开始的坐标点，后面计算要用到
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY
      })
    }
  },
  // 滑动事件处理,一次只能滑出一个删除按钮 为了防止滑动出现抖动，我们用滑动结束事件
  touchMoveEndHandle: function (e) {
    var currentId = e.currentTarget.dataset.id, //当前索引
      startX = this.data.startX, //开始X坐标
      startY = this.data.startY, //开始Y坐标
      touchMoveEndX = e.changedTouches[0].clientX, //滑动变化X坐标
      touchMoveEndY = e.changedTouches[0].clientY, //滑动变化Y坐标
      //获取滑动角度
      angle = this.angle(
        {
          X: startX,
          Y: startY
        },
        {
          X: touchMoveEndX,
          Y: touchMoveEndY
        }
      )
    //滑动超过50度角 return，防止上下滑动触发
    if (Math.abs(angle) > 50) return
    this.data.list.map((item, index) => {
      item.list.map((goods) => {
        if (touchMoveEndX > startX) {
          // 右滑
          if (goods.goodsId == currentId) goods.x = 0
        } else if (touchMoveEndX < startX) {
          // 左滑
          goods.x = -120
          if (goods.goodsId != currentId) goods.x = 0
        }
      })
    })
    this.setData({
      list: this.data.list
    })
  },
  /**
   * 计算滑动角度
   * start 起点坐标
   * end 终点坐标
   * Math.PI 表示一个圆的周长与直径的比例，约为 3.14159;PI就是圆周率π，PI是弧度制的π,也就是180°
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    return (360 * Math.atan(_Y / _X)) / (2 * Math.PI)
  }
})
