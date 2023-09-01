//获取应用实例
var app = getApp()
Page({
  data: {
    navigate_type: "", //分类类型，是否包含二级分类
    slideWidth: "", //滑块宽
    slideLeft: 0, //滑块位置
    totalLength: "", //当前滚动列表总长
    slideShow: false,
    slideRatio: ""
  },
  onLoad: function () {
    const _list = [
      {
        categoryId: "1684823991539339264",
        parentId: "1",
        categoryName: "服装鞋帽",
        categoryImage:
          "https://tacj.openunion.cn/api/portal/file/onlinePreviewController/v1/getFileById_1684823987600887808",
        status: "1",
        createTime: "2023-07-28 15:11:56",
        orgId: "1592423575938273280",
        tenantId: "1591995381682671616"
      },
      {
        categoryId: "1694161435720028160",
        parentId: "1",
        categoryName: "食品饮料",
        categoryImage:
          "https://tacj.openunion.cn/api/portal/file/onlinePreviewController/v1/getFileById_1694161407785963520",
        status: "1",
        createTime: "2023-08-23 09:35:36",
        orgId: "1592423575938273280",
        tenantId: "1591995381682671616"
      },
      {
        categoryId: "1696785452763320320",
        parentId: "1",
        categoryName: "个护美妆",
        categoryImage:
          "https://tacj.openunion.cn/api/portal/file/onlinePreviewController/v1/getFileById_1694161407785963520",

        status: "1",
        createTime: "2023-08-30 15:22:31",
        tenantId: "1591995381682671616"
      },
      {
        categoryId: "1696785702689312768",
        parentId: "1",
        categoryName: "生鲜果品",
        categoryImage:
          "https://tacj.openunion.cn/api/portal/file/onlinePreviewController/v1/getFileById_1694161407785963520",

        status: "1",
        createTime: "2023-08-30 15:23:30",
        tenantId: "1591995381682671616"
      },
      {
        categoryId: "1696785785967218688",
        parentId: "1",
        categoryName: "燃气灶具",
        categoryImage:
          "https://tacj.openunion.cn/api/portal/file/onlinePreviewController/v1/getFileById_1694161407785963520",

        status: "1",
        createTime: "2023-08-30 15:23:50",
        tenantId: "1591995381682671616"
      },
      {
        categoryId: "1696786257629286400",
        parentId: "1",
        categoryName: "家用电器",
        categoryImage:
          "https://tacj.openunion.cn/api/portal/file/onlinePreviewController/v1/getFileById_1694161407785963520",

        status: "1",
        createTime: "2023-08-30 15:25:42",
        tenantId: "1591995381682671616"
      },
      {
        categoryId: "1696809356433166336",
        parentId: "1",
        categoryName: "冰饮食品",
        categoryImage:
          "https://tacj.openunion.cn/api/portal/file/onlinePreviewController/v1/getFileById_1696809349642588160",
        status: "1",
        createTime: "2023-08-30 16:57:30",
        tenantId: "1591995381682671616"
      }
    ]
    var self = this
    var systemInfo = wx.getSystemInfoSync()
    self.setData({
      list: _list,
      windowHeight:
        app.globalData.navigate_type == 1
          ? systemInfo.windowHeight
          : systemInfo.windowHeight - 35,
      windowWidth: systemInfo.windowWidth,
      navigate_type: app.globalData.navigate_type
    })
    //计算比例
    self.getRatio()
  },
  //根据分类获取比例
  getRatio() {
    var self = this
    if (
      !self.data.list ||
      self.data.list.length <= 5
    ) {
      this.setData({
        slideShow: false
      })
    } else {
      var _totalLength = self.data.list.length * 150 //分类列表总长度
      var _ratio = (230 / _totalLength) * (750 / this.data.windowWidth) //滚动列表长度与滑条长度比例
      var _showLength = (750 / _totalLength) * 230 //当前显示红色滑条的长度(保留两位小数)
      this.setData({
        slideWidth: _showLength,
        totalLength: _totalLength,
        slideShow: true,
        slideRatio: _ratio
      })
    }
  },
  //slideLeft动态变化
  getleft(e) {
    this.setData({
      slideLeft: e.detail.scrollLeft * this.data.slideRatio
    })
  }
})
