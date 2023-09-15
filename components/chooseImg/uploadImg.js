var util = require('../../utils/util.js');
const $baseUrl = require('../../utils/api.js').baseUrl;
const $api = require('../../utils/api.js').API;
const App = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgNum: { // 属性名
      type: Number,
      value: 9
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgs: '/images/add_Item.png',
    picPaths: [],
    pics: [],
    // imgNum: 9,
    cWidth: 2000,
    cHeight: 2000,
    imgFiles: [],
    compressImgs: [],
    imgList: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    chooseImg: function () {
      let maxSize = 800;
      let dWidth = wx.getSystemInfoSync().windowWidth;
      let compressNum = 0;
      let i = 0;
      console.log(dWidth);
      var _this = this,
        pics = _this.data.pics;
      console.log("imgNum====", _this.data.imgNum);
      wx.chooseImage({
        count: _this.data.imgNum - pics.length, // 最多可以选择的图片张数，默认9
        //  quality:30,
        sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          wx.showLoading({
            title: '处理中...',
          })
          var imgsrc = res.tempFilePaths;
          pics = pics.concat(imgsrc);
          _this.setData({
            pics: pics,
          });
          console.log("图片集合=====" + _this.data.pics.length);
          // _this.beiginImg(_this.data.pics, i, compressNum, maxSize, dWidth);
          // 返回选定图片的本地文件列表，tempFilePaths可以作为img标签的src列表
          // 当一次选择多张图片的情况
          // _this.data.pics.forEach(v =>{
          for (var i = 0; i < pics.length; i++) {
            _this.data.imgFiles.push(_this.data.pics[i]);
            wx.getFileInfo({
              filePath: _this.data.pics[i],
              success: function (res) {
                var cW = res.width,
                  cH = res.height,
                  rat = 1.1;
                _this.cWidth = cW;
                _this.cHeight = cH;
              }
            })
            util.getLessLimitSizeImage('canvas', _this.data.pics[i], i, maxSize, dWidth, function (img, i) {
              _this.data.compressImgs.push(img);
              wx.getFileInfo({
                filePath: img,
                success: function (res) {
                  console.log('压缩后：' + res.size / 1024 + 'kb');
                  console.log("顺序========" + i);
                  console.log('压缩后数据：=========' + JSON.stringify(res));
                  compressNum = compressNum + 1;
                  console.log('compressNum==========' + compressNum);
                  if (compressNum == _this.data.pics.length) {
                    setTimeout(() => {
                      wx.hideLoading();
                    }, 100);
                  } else {
                    _this.beiginImg(_this.data.pics[i], i, compressNum, maxSize, dWidth);
                  }
                }
              })
            })
          }
          // });
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    },

    beiginImg: function (pics, i, compressNum, maxSize, dWidth) {
      var _this = this;
      _this.data.imgFiles.push(pics[i]);
      wx.getFileInfo({
        filePath: pics[i],
        success: function (res) {
          var cW = res.width,
            cH = res.height,
            rat = 1.1;
          _this.cWidth = cW;
          _this.cHeight = cH;
        }
      })
      util.getLessLimitSizeImage('canvas', pics[i], i, maxSize, dWidth, function (img, i) {
        _this.data.compressImgs.push(img);
        wx.getFileInfo({
          filePath: img,
          success: function (res) {
            console.log('压缩后：' + res.size / 1024 + 'kb');
            console.log("顺序========" + i);
            console.log('压缩后数据：=========' + JSON.stringify(res));
            compressNum = compressNum + 1;
            i = i + 1;
            console.log('compressNum==========' + compressNum);
            if (compressNum == _this.data.pics.length) {
              setTimeout(() => {
                wx.hideLoading();
              }, 100);
            } else {
              _this.beiginImg(pics, i, compressNum, maxSize, dWidth);
            }
          }
        })
      })
    },

    uploadImg: function () {
      var _this = this;
      if (_this.data.compressImgs.length == 0) {
        _this.triggerEvent("itemChange", '');
        return;
      }
      let imgArray = [];
      let resArray = [];
      let j = 0;
      _this.setData({
        compressImgs: _this.arrayUnique(_this.data.compressImgs)
      })
      for (var i = 0; i < _this.data.compressImgs.length; i++) {
        console.log("pics========" + _this.data.pics[i]);
        console.log("compressImgs========" + _this.data.compressImgs[i]);
      }
      console.log("杰======", _this.data.compressImgs);
      console.log("compressImgs长度========" + _this.data.compressImgs.length);
      for (var i = 0; i < _this.data.compressImgs.length; i++) {
        console.log("uploadFile======", _this.data.compressImgs);
        wx.uploadFile({
          url: $baseUrl + '/file/v1/fileUpload',
          filePath: _this.data.compressImgs[i],
          name: 'files',
          method: 'POST',
          header: {
            'content-type': 'application/json', // 默认值
            "authorization": "Bearer " + wx.getStorageSync('token')
          },
          success: function (res) {
            console.log("杰=======", res);
            if (res.statusCode == "200") {
              if (res.data) {
                imgArray[j] = JSON.parse(res.data).fileId;
                resArray[j] = JSON.parse(res.data)
                j = j + 1;
                if (imgArray.length == _this.data.compressImgs.length) {
                  console.log("imgArray=========", imgArray,resArray);
                  _this.onlinePreview(imgArray,resArray);
                  // _this.triggerEvent("itemChange", imgArray);
                  // values.image_id = imgArray;
                  // 提交到后端
                }
              } else {

              }
            } else {
              App.showError("上传失败")
            }
          }
        })
        console.log("i=======" + i);
      }
    },
    onlinePreview(imgArray, resArray) {
      let _this = this;
      var imgList = [];
      // _this.triggerEvent("itemChange", imgArray);
      for (var i = 0; i < imgArray.length; i++) {
        var imgData = {
          fileId: imgArray[i]
        }
        const j = i
        $api.onlinePreview(imgData).then(res => {
          console.log("浏览图片结果=====", res);
          if (res.result != 'error') {
            const img = {
              fileName: resArray[j].fileName,
              url: `https://tacj.openunion.cn/api/portal/file/onlinePreviewController/v1/getFileById_${resArray[j].fileId}`
            }
            imgList.push(img);
            var num = imgArray.length - 1;
            console.log(num);
            if (imgList.length == imgArray.length) {
              console.log(111111111111111, resArray, imgArray)
              _this.triggerEvent("itemChange", imgList);
              _this.triggerEvent("itemResChange", resArray);
            }
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      }
    },

    /**
     * 浏览图片
     */
    previewImages: function (e) {
      let index = e.currentTarget.dataset.index,
        imageUrls = [];
      this.data.pics.forEach(function (item) {
        imageUrls.push(item);
      });
      wx.previewImage({
        current: imageUrls[index],
        urls: imageUrls
      })
    },

    delImg: function (e) {
      var _this = this;
      console.log("图片顺序==========",_this.data.pics);
      console.log(e.currentTarget);
      wx.showModal({
        title: '友情提示',
        content: '您确定要删除吗？',
        confirmColor: '#26a886',
        success: function (res) {
          if (res.confirm) {
            _this.data.pics.splice(e.currentTarget.dataset.index, 1);
            _this.data.compressImgs.splice(e.currentTarget.dataset.index, 1);
            _this.setData({
              pics: _this.data.pics,
              compressImgs: _this.data.compressImgs
            })
            console.log("pics======" + _this.data.pics);
            console.log("compressImgs======" + _this.data.compressImgs);
            console.log("点击了下标======" + e.currentTarget.dataset.index);
          }
        }
      })
    },

    arrayUnique: function (arr) {
      var result = [],
        hash = {};
      for (var i = 0, elem;
        (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
          result.push(elem);
          hash[elem] = true;
        }
      }
      return result;
    },
  }
})