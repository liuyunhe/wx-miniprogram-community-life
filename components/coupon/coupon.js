// pages/my/newMarket/index.js
const $api = require("../../utils/api.js").API
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      // 属性名
      type: Boolean,
      value: false
    },
    totalPrice: {
      type: Map
    },
    descountNum: {
      type: Number,
      observer: function (newVal) {
        // 监听curPath属性变化，若这个值存在，且与即将附在data中的值不同，就满足我们的要求可以进行后续操作啦
        console.log(newVal)
        this.setData({
          descount: newVal
        })
      }
    },
    couponList: {
      type: Object,
      observer: function (newVal) {
        // 监听curPath属性变化，若这个值存在，且与即将附在data中的值不同，就满足我们的要求可以进行后续操作啦
        if (newVal) {
          console.log(newVal, "======> couponList change")
          this.getCheckedNum(newVal)
          this.setData({
            list: newVal
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    descount: 0,
    checkedNum: 0,
    showTips: true,
    canUseCoupon: false
  },

  lifetimes: {
    created() {
      console.log("=====>coupon detached")
    },
    detached() {
      console.log("=====>detached")
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getCheckedNum(list) {
      let canUseCoupon = false
      const checkedNum = list.reduce((pre, cur) => {
        if (cur.active) canUseCoupon = true
        if (cur.active && cur.checked) {
          
          return pre + 1
        } else {
          return pre
        }
      }, 0)
      this.setData({ checkedNum, canUseCoupon })
    },
    handleClickComfirm() {
      this.triggerEvent("comfirm", {
        list: this.data.list,
        descount: this.data.descount
      })
    },
    handClickChecked(e) {
      const { index, active } = e.currentTarget.dataset
      if (!active) return
      const list = this.data.list
      let descount = this.data.descount
      list[index].checked = !list[index].checked
      descount = list.reduce((pre, cur) => {
        console.log(pre, cur)
        if (cur.checked && cur.active) {
          return pre + cur.couponPrice
        } else {
          return pre
        }
      }, 0)
      this.getCheckedNum(list)
      this.setData({
        list,
        descount,
        showTips: false
      })
    }
  }
})
