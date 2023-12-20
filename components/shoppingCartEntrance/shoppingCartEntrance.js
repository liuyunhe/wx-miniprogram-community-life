// pages/my/newMarket/index.js
const $api = require("../../utils/api").API
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mallType: {
      // 属性名
      type: Number,
      value: 1
    },
    cartCount: {
      type: Number,
      value: 0,
      observer: function (newVal) {
        // 监听curPath属性变化，若这个值存在，且与即将附在data中的值不同，就满足我们的要求可以进行后续操作啦
        console.log(newVal)
        this.setData({
          cartCount: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    goMallCart() {
      wx.navigateTo({
        url: `/subpackage/mall/shoppingCart/index`
      })
    }
  }
})