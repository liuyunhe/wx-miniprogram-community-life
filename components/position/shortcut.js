const App = getApp();

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 弹窗标题
    title: {
      type: String,
      value: '弹窗标题'
    }
  },

  /**
   * 私有数据, 组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    isShow: true,
    transparent: true
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {

    /**
     * 导航菜单切换事件
     */
    _onToggleShow(e) {
      this.setData({
        isShow: !this.data.isShow,
        transparent: false
      })
    },

    _currentLocation(e) {
      console.log(e.currentTarget.dataset.index);
      //移动位置回调
      this.triggerEvent("currentLocation",e.currentTarget.dataset.index);
    },

    /**
     * 导航页面跳转
     */
    _onTargetPage(e) {
      if (e.detail.target.dataset.index == "0") {
        wx.navigateTo({
          url: '/pages/index/proposal/index',
        })
      } else if (e.detail.target.dataset.index == "1") {
        wx.navigateTo({
          url: '/pages/index/subscribe/index',
        })
      } else if (e.detail.target.dataset.index == "2") {
        wx.navigateTo({
          url: '/pages/community/market/index',
        })
      } else if (e.detail.target.dataset.index == "3") {
        wx.switchTab({
          url: '/pages/service/home/index',
        })
      }
    }
  }
})