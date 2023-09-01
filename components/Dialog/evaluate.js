var util = require('../../utils/util.js');
const $api = require('../../utils/api.js').API;
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
    // 评价id
    repairId: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    type: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗标题
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗取消按钮文字
    cancelText: {
      type: String,
      value: '取消'
    },
    // 弹窗确认按钮文字
    confirmText: {
      type: String,
      value: '确定'
    },
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    isShow: false,
    evaluateContent: '',
    custEvaluate: '',
    itemTag: [{
        id: 10,
        name: '非常差',
        checked: false
      },
      {
        id: 11,
        name: '差',
        checked: false
      },
      {
        id: 12,
        name: '一般',
        checked: false
      },
      {
        id: 13,
        name: '好',
        checked: false
      },
      {
        id: 14,
        name: '非常好',
        checked: false
      },
    ],
    pics: [],
    imgNum: 3,
    cWidth: 2000,
    cHeight: 2000,
    imgFiles: [],
    compressImgs: [],
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    /*
     * 公有方法
     */

    //隐藏弹框
    hideDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    handleItemChange(e) {
      let _this = this;
      var values = {
        repairId: _this.data.repairId,
        custEvaluate: _this.data.custEvaluate,
        evaluateContent: _this.data.evaluateContent,
        evaluateImage: ''
      };
      values.evaluateImage = JSON.stringify(e.detail);
      $api.evaluate(values).then(res => {
        if (res.state) {
          wx.showToast({
            title: "评价成功",
            duration: 2000,
          });
          //触发成功回调
          _this.triggerEvent("confirmEvent");
          if(_this.data.type=='2'){
            wx.navigateBack();
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    areaInput(e) {
      this.setData({
        evaluateContent: e.detail.value
      });
      console.log(e);
    },
    //展示弹框
    showDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _cancelEvent() {
      //触发取消回调
      this.triggerEvent("cancelEvent")
    },
    _confirmEvent() {
      let _this = this;
      if (_this.data.evaluateContent === '') {
        App.showError('评价内容不能为空');
        return false;
      }
      if (_this.data.custEvaluate === '') {
        App.showError('评价选项不能为空');
        return false;
      }
      var uploadImg = _this.selectComponent('#uploadImg');
      uploadImg.uploadImg();
    },
    /**
     * 点击tab切换
     */
    swichNav: function (e) {
      var _this = this;
      console.log("====" + e.target.dataset.id);
      for (var i = 0; i < _this.data.itemTag.length; i++) {
        if (_this.data.itemTag[i].id == e.target.dataset.id) {
          _this.data.itemTag[i].checked = true;
          _this.data.custEvaluate = _this.data.itemTag[i].name
        } else {
          _this.data.itemTag[i].checked = false
        }
      }
      _this.setData({
        itemTag: _this.data.itemTag,
        custEvaluate: _this.data.custEvaluate
      })
    },
  }
})