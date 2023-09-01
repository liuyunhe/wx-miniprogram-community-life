// pages/community/notice/index.js
const $api = require('../../../utils/api.js').API;
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataType: '',
    scrollHeight: null, // 列表容器高度
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    totalPages: 1,
    // 数据源
    noticeList:[
      // 更多数据...
    ],
    pageParam:{
      page: 1,
      pageSize: 10,
      state: '1'//state==1表示已经审核通过的公告
    },
    baseImageUrl:App.globalData.imgUrl,
  },
  // 跳转至公告详情
  noticeDetails(item){
    // wx.showToast({
    //   title: '功能建设中...',
    //   icon:'none'
    // })
    // return
    console.log("公告数据====>",item)
    let detailInfo = item.currentTarget.dataset.detail
    wx.navigateTo({
      url: "/subpackage/community/notice/details?noticeId=" + detailInfo.noticeId
    })
  },
  // 解析图片地址
  ParsePicture(jsonData){
    let parseUrl = "";
    let result  = "";
    if(jsonData == '' || jsonData == null){
      return result;
    }
    let pictureObject = JSON.parse(jsonData)
    console.log("pictureObject ===>",pictureObject);
  
    console.log("pictureObject.constructor === Array ",pictureObject.constructor === Array);
    if(pictureObject.constructor === Array){
      parseUrl = pictureObject.length > 0 ? pictureObject[0].url:"";
       result =  parseUrl;
    }else if(pictureObject.url){
      parseUrl = pictureObject.url;
       result =  + parseUrl;
    }else{
      result = '';
    }
      return result
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const dataType = options.dataType
    if(dataType){
      this.setData({
        dataType
      })
    }
    this.setListHeight();
  },
  /**
   * 下拉到底加载数据
   */
  bindDownLoad() {
    // 已经是最后一页
    if (this.data.pageParam.page >= this.data.totalPages) {
      this.setData({
        no_more: true
      });
      return false;
    }
    // 加载下一页列表
    this.showNoticeList(true, ++this.data.pageParam.page);
  },
  /**
   * 设置公告列表高度
   */
  setListHeight() {
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = Math.floor(rpx * 100), // tap高度
      scrollHeight = systemInfo.windowHeight - tapHeight; // swiper高度
    this.setData({
      scrollHeight
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  /* 展示公告列表 */
  showNoticeList(isPage,page){
    let _this = this
    page = page || 1;
    _this.data.pageParam.page = page;
    _this.setData({
      pageParam: _this.data.pageParam
    })
    $api.getCommunityNoticeList(_this.data.pageParam).then((res)=>{
      let noticeListTmp = [];
      if(res.value.rows && res.value.rows.length){
        noticeListTmp = res.value.rows;
        for(let i =0;i<noticeListTmp.length;i++){
          let url = noticeListTmp[i].noticeImage;
          let urlParse = _this.ParsePicture(url);
          noticeListTmp[i].noticeImage = urlParse;
        }
      }

      if(isPage == true){
        _this.setData({
          noticeList: _this.data.noticeList.concat(noticeListTmp),
          totalPages: res.value.totalPages,
          isLoading: false,
        })
      }else{
        this.setData({
          noticeList: noticeListTmp
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setListHeight()
    this.showNoticeList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})