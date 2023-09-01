const $api = require('../../../utils/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataType: '',
    scrollHeight: null, // 列表容器高度
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    list: [],
    appointData: {
      page: 1,
      pageSize: 10,
      status: ''
    },
    latituge: '',//纬度
    longituge: '',//经度
    totalPages: 1,
    communityList:[],
    isBindCommunity:false,
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
    // this.getCommunityList();
    let _this = this
    wx.getStorage({
      key:'myCommunityInfo',
      success:function(res){
        _this.setData({
          isBindCommunity : true,
        })
      },
      fail:function(err){
        _this.setData({
          isBindCommunity : false,
        })
      }
    })
  },

   /* 获取社区列表 */
   getCommunityList(){
    let pageParam = null
    if(this.pageParam){
      pageParam = this.pageParam
    }else{
      pageParam={
        page: 1,
        pageSize: 10,
      }
    }
    pageParam.latituge = this.data.latituge
    pageParam.longituge = this.data.longituge
    $api.getCommunityInfoList(pageParam).then((res)=>{
      console.log("社区列表返回的数据====>",res)
      this.setData({
        communityList: res.value.rows
      })
    })
  },

    //绑定社区
  bindCommunity(item){
    wx.showLoading({
      title: '正在加载中',
    })
    console.log('item==>',item)
    let community = item.currentTarget.dataset.community
    if(community){
      let custId = ''
      wx.getStorage({
        key:'custId',
        success:function(res){
          custId = res.data
          console.log("99999999999999999",custId)
          let paramObject = {
            communityId:community.communityId,
            custId:custId,
            orgId:community.orgId
          }
          $api.communityBinding(paramObject).then((response)=>{
            console.log("绑定接口返回",response)
            if(response.state == true){
              wx.navigateBack({
              })
              // wx.showToast({
              //   title: '绑定社区成功',
              //   icon: 'success',
              //   duration: 2000,
              //   success:function(){
              //     wx.navigateBack({
              //     })
              //   }
              // })
            }
          })
        }
      })
      
    }
  },

  /**
   * 设置商品列表高度
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

  bindHeaderTap(e) {
    let _this = this;
    _this.data.appointData.status = e.currentTarget.dataset.type;
    _this.setData({
      dataType: e.currentTarget.dataset.type,
      isLoading: true,
      no_more: false,
      orderList: [],
      appointData: _this.data.appointData
    });
    _this.appointList();
  },
  appointList(isPage, page) {
    let _this = this;
    page = page || 1;
    _this.data.appointData.page = page;
    _this.setData({
      appointData: _this.data.appointData
    })
    $api.getCommunityInfoList(_this.data.appointData).then(res => {
      if (res.state) {
        if (isPage == true) {
          _this.setData({
            list: _this.data.list.concat(res.value.rows),
            totalPages: res.value.totalPages,
            isLoading: false,
          })
        } else {
          _this.setData({
            list: res.value.rows,
            totalPages: res.value.totalPages,
            isLoading: false,
          })
        }
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },

  details(e) {
    // wx.navigateTo({
    //   url: '/pages/community/info/detail',
    // })
  },





  /**
   * 下拉到底加载数据
   */
  bindDownLoad() {
    // 已经是最后一页
    if (this.data.appointData.page >= this.data.totalPages) {
      this.setData({
        no_more: true
      });
      return false;
    }
    // 加载下一页列表
    this.appointList(true, ++this.data.appointData.page);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const that = this
    this.appointList();
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log("经纬度接口返回的数据=>",res)
        that.setData({
          latituge: res.latitude,
          longituge: res.longitude
        })
        that.getCommunityList();
        // that.getByTypeId()
      },
      fail(err) {
        that.getCommunityList();
        // that.getByTypeId()
      }
    })
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
    wx.stopPullDownRefresh();
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