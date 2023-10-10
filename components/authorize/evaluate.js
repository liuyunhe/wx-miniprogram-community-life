var util = require('../../utils/util.js');
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
const $baseUrl = require('../../utils/api.js').baseUrl;
const $api = require('../../utils/api.js').API;
const { IMAGE_UPLOAD_URL } = getApp().globalData
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
      // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: "标题" // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗取消按钮文字
    cancelText: {
      type: String,
      value: "取消"
    },
    // 弹窗确认按钮文字
    confirmText: {
      type: String,
      value: "保存"
    },
    nickname: {
      type: String,
      value: ""
    },
    avatarUrl: {
      type: String,
      value: defaultAvatarUrl
    }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    isShow: false,
    // avatarUrl: defaultAvatarUrl,
    // nickname: '',
    wechatAvatarUrl: "/state/images/yucun.png"
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    getNickname: function (e) {
      this.setData({
        nickname: e.detail.value
      })
    },
    onChooseAvatar(e) {
      let _this = this
      console.log(e)
      const { avatarUrl } = e.detail
      // _this.setData({
      //   avatarUrl: e.detail.avatarUrl
      // });
      //  将头像上传到服务器
      wx.uploadFile({
        url: $baseUrl + "/file/v1/fileUpload",
        filePath: avatarUrl,
        name: "files",
        method: "POST",
        header: {
          "content-type": "application/json", // 默认值
          authorization: "Bearer " + wx.getStorageSync("token")
        },
        success(res) {
          if (res.statusCode == "200") {
            if (res.data) {
              const { fileId, fileName } = JSON.parse(res.data)
              _this.onlinePreview(fileId, fileName)
            } else {
            }
          } else {
            App.showError("上传失败")
          }
        }
      })
    },
    onlinePreview(fileId, fileName) {
      let _this = this
      var imgData = {
        fileId: fileId
      }
      $api.onlinePreview(imgData).then((res) => {
        console.log("浏览图片结果=====", res)
        if (res.result != "error") {
          const wechatAvatarUrl = [
            {
              fileName: fileName,
              url: `${IMAGE_UPLOAD_URL}${fileId}`,
              previewUrl: `${IMAGE_UPLOAD_URL}${fileId}`
            }
          ]
          const avatarUrl = wechatAvatarUrl[0].url
          _this.setData({
            // avatarUrl: res.currentUrl
            wechatAvatarUrl:JSON.stringify(wechatAvatarUrl),
            avatarUrl
          })
          // _this.triggerEvent("itemChange", res.currentUrl);
          console.log(_this)
        } else {
          wx.showToast({
            title: res.message,
            icon: "none"
          })
        }
      })
    },

    //隐藏弹框
    hideDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
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
      let _this = this
      //触发取消回调
      _this.triggerEvent("cancelEvent")
    },
    _confirmEvent() {
      let _this = this
      if (_this.data.avatarUrl == defaultAvatarUrl) {
        wx.showToast({
          title: "请选择头像",
          icon: "none"
        })
        return
      }
      if (_this.data.nickname == "") {
        wx.showToast({
          title: "请填写昵称",
          icon: "none"
        })
        return
      }
      var imgData = {
        wechatNickName: _this.data.nickname,
        wechatAvatarUrl: _this.data.wechatAvatarUrl
      }
      $api.wechatUser(imgData).then((res) => {
        if (res.state) {
          wx.setStorageSync("wechatNickName", _this.data.nickname)
          wx.setStorageSync("wechatAvatarUrl", _this.data.avatarUrl)
          //触发成功回调
          _this.triggerEvent("confirmEvent")
        } else {
          wx.showToast({
            title: res.message,
            icon: "none"
          })
        }
      })
    }
  }
})