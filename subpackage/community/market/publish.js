var util = require('../../../utils/util.js');
const $baseUrl = require('../../../utils/api.js').baseUrl;
const $api = require('../../../utils/api.js').API;
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: null, // 列表容器高度
    marketUrl: "/subpackage/community/images/publish_seat.png",
    marketTitle: "",
    marketDesc: "",
    marketType: "",
    marketTypeName: "请选择",
    marketPrice: "",
    phone: "",
    name: "",
    //商品分类
    marketTypeArray: [
      { type: "01", name: "生活用品" },
      { type: "02", name: "电器" },
      { type: "03", name: "服装" },
      { type: "04", name: "其他" }
    ],
    marketUrlArray: "",
    //发布状态：0 待审核
    state: "0",
    edit: false,
    readOnly: false,
    goodsId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("options=>", options)
    if (options.type === "all") {
      this.setData({
        readOnly: true
      })
      wx.setNavigationBarTitle({
        title:"物品详情"
      })
    }
    if (options.goodsId) {
      this.setData({
        edit: true,
        goodsId: options.goodsId
      })
      let param = {
        id: options.goodsId
      }
      $api.getGoodsDetail(param).then((res) => {
        console.log("666res", res)
        let typeItem = null
        if (res.value.category) {
          typeItem = this.data.marketTypeArray.filter((item) => {
            return item.type == res.value.category
          })
          console.log("typeItem", typeItem)
          console.log("typeItem[0].name", typeItem[0].name)
        }
        this.setData({
          marketTitle: res.value.goodsName,
          marketUrl: res.value.goodsImage
            ? JSON.parse(res.value.goodsImage)[0].url
            : this.data.marketUrl,
          marketDesc: res.value.description,
          marketPrice: res.value.goodsPrice,
          name: res.value.contact,
          phone: res.value.phone,
          marketType: res.value.category,
          marketTypeName: typeItem[0].name
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setListHeight()
  },

  /**
   * 
   * auditOper 审核人Id  false string  
    auditOperName 审核人姓名  false string  
    auditReason 审核意见  false string  
    auditTime 审核时间  false string(date-time)  
    category 分类  false string  
    communityId 社区Id  false string  
    communityName 社区名称  false string  
    contact 联系人  false string  
    createOper 创建人Id  false string  
    createOperName 创建人姓名  false string  
    createTime 创建时间  false string(date-time)  
    custId 客户Id  false string  
    degree 新旧程度  false string  
    description 描述  false string  
    goodsId 商品Id  false string  
    goodsName 商品名称  false string  
    goodsPrice 商品价格  false integer(int64)  
    orgId 机构Id  false string  
    phone 联系电话  false integer(int64)  
    state 状态[ 0：待审核；1：发布中；2：审核拒绝；3：终止发布；4：已删除；5：已成交；]  false string  
    tenantId 租户Id  false string  
    updateOper 修改人Id  false string  
    updateOperName 修改人姓名  false string  
    updateTime 修改时间  false string(date-time)  
    viewNum 浏览次数  false integer(int64)  
    wantNum 预购次数  false integer(int64) 
   */
  // /api/community/v1/communityMarketGoods/add   POST
  //商品发布
  marketPublish() {
    if (!this.data.marketUrlArray) { 
      wx.showToast({
        title: "请上传图片！",
        icon: "error"
      })
      return
    }
    if (!this.data.marketType) { 
       wx.showToast({
         title: "请选择分类！",
         icon: "error"
       })
       return
    }
    let _this = this
    let publishData = {}
    publishData.goodsName = _this.data.marketTitle
    publishData.description = _this.data.marketDesc
    publishData.goodsPrice = _this.data.marketPrice
    publishData.category = _this.data.marketType
    publishData.phone = _this.data.phone
    publishData.contact = _this.data.name
    publishData.state = _this.data.state
    publishData.communityId = wx.getStorageSync("communityId")
    publishData.communityName = wx.getStorageSync("communityName")
    publishData.createOper = wx.getStorageSync("custId")
    publishData.createOperName = ""
    publishData.custId = wx.getStorageSync("custId")
    publishData.createTime = this.getNowDate()
    publishData.goodsImage = JSON.stringify(_this.data.marketUrlArray)
    console.log("publishData ===>", publishData)
    $api.goodPublish(publishData).then((res) => {
      console.log("goodPublish ===>", res)
      if (res.state) {
        wx.navigateBack({})
      } else {
        wx.showToast({
          title: res.message,
          icon: "none"
        })
      }
    })
  },
  //商品详细信息变更
  goodsInfoChange() {
    let _this = this
    if (this.data.goodsId) {
      let changeParam = {
        goodsId: _this.data.goodsId,
        goodsName: _this.data.marketTitle,
        description: _this.data.marketDesc,
        goodsPrice: _this.data.marketPrice,
        category: _this.data.marketType,
        phone: _this.data.phone,
        contact: _this.data.name
      }
      if (_this.data.marketUrlArray) {
        changeParam.goodsImage = JSON.stringify(_this.data.marketUrlArray)
      }
      $api.GoodsListUpdate(changeParam).then((res) => {
        if (res.state) {
          wx.navigateBack({})
        } else {
          wx.showToast({
            title: res.message,
            icon: "none"
          })
        }
      })
    }
  },
  //标题
  bindTitleChange(value) {
    console.log(value)
    let title = value.detail.value
    this.setData({
      marketTitle: title
    })
  },
  //描述
  bindDescChange(value) {
    console.log("bindDescChange ===>", value)
    let desc = value.detail.value
    this.setData({
      marketDesc: desc
    })
  },
  //类型
  bindTypeChange(value) {
    let typeIndex = value.detail.value
    console.log(typeIndex)
    let typeObject = this.data.marketTypeArray[typeIndex]
    let markerTypeName = typeObject.name
    let marketType = typeObject.type
    console.log("22", marketType)
    console.log("33", markerTypeName)
    this.setData({
      marketType: marketType,
      marketTypeName: markerTypeName
    })
    console.log("this.data.marketType", this.data.marketType)
  },
  //价格
  bindPriceChange(value) {
    let price = value.detail.value
    this.setData({
      marketPrice: price
    })
  },
  //联系人
  bindNameChange(value) {
    let name = value.detail.value
    this.setData({
      name: name
    })
  },
  //电话
  bindPhoneChange(value) {
    let phone = value.detail.value
    this.setData({
      phone: phone
    })
  },
  //选择图片
  chooseImg() {
    if(this.data.readOnly) return
    var that = this
    wx.chooseImage({
      //从本地相册选择图片或使用相机拍照
      count: 1, // 默认9
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有

      success: function (res) {
        console.log(res)
        //前台显示
        that.setData({
          marketUrl: res.tempFilePaths
        })
        that.upLoadImage(res.tempFilePaths)
      }
    })
  },
  //图片上传
  upLoadImage(marketUrl) {
    let _this = this
    console.log("upLoadImage ===>", marketUrl)
    if (marketUrl != null && marketUrl.length > 0) {
      let url = marketUrl[0]
      console.log("upLoadImage url ===>", url)
      wx.uploadFile({
        url: $baseUrl + "/file/v1/fileUpload",
        filePath: url,
        name: "files",
        method: "POST",
        header: {
          "content-type": "application/json", // 默认值
          authorization: "Bearer " + wx.getStorageSync("token")
        },
        success: function (res) {
          console.log("upLoadImage ===>", res)
          if (res.statusCode == "200") {
            if (res.data) {
              let fileId = JSON.parse(res.data).fileId
              const img = [
                {
                  fileName: JSON.parse(res.data).fileName,
                  url: `https://tacj.openunion.cn/api/portal/file/onlinePreviewController/v1/getFileById_${fileId}`
                }
              ]
              console.log(img)
              _this.setData({
                marketUrlArray: img
              })
              _this.onlinePreview(fileId)
            } else {
            }
          } else {
            App.showError("上传失败")
          }
        }
      })
    }
  },

  onlinePreview(fileId) {
    let _this = this
    var imgList = []
    var imgData = {
      fileId: fileId
    }
    $api.onlinePreview(imgData).then((res) => {
      if (res.result != "error") {
        imgList.push(res.currentUrl)
        console.log("imgList ===>", imgList)
      } else {
        wx.showToast({
          title: res.message,
          icon: "none"
        })
      }
    })
  },

  //获取当前时间
  getNowDate() {
    var date = new Date()
    var year = date.getFullYear() //年
    var month = date.getMonth() + 1 //月
    if (month < 10) {
      month = "0" + month
    }
    var day = date.getDate() //日
    if (day < 10) {
      day = "0" + day
    }

    var hour = date.getHours() //时
    var minute = date.getMinutes() //分
    var second = date.getSeconds() //秒

    var xiaoshi = ""
    if (hour < 10) {
      xiaoshi = "0" + hour
    } else {
      xiaoshi = hour + ""
    }

    var fenzhong = ""
    if (minute < 10) {
      fenzhong = "0" + minute
    } else {
      fenzhong = minute + ""
    }

    var miao = ""
    if (second < 10) {
      miao = "0" + second
    } else {
      miao = second + ""
    }
    let nowTime =
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      xiaoshi +
      ":" +
      fenzhong +
      ":" +
      miao
    console.log("nowTime ===>", nowTime)
    return nowTime
  },

  // 动态计算高度
  setListHeight() {
    const systemInfo = wx.getSystemInfoSync()
    const rpx = systemInfo.windowWidth / 750
    const tapHeight = Math.floor(rpx * 40)
    console.log("systemInfo ===>", systemInfo)
    console.log("tapHeight ===>", tapHeight)
    const scrollHeight = systemInfo.windowHeight - tapHeight
    this.setData({
      scrollHeight
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