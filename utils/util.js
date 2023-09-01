const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

//*************** 图片压缩 ***********
// 判断图片大小是否满足需求
function imageSizeIsLessLimitSize(imagePath, limitSize, lessCallBack, moreCallBack) {
  wx.getFileInfo({
    filePath: imagePath,
    success(res) {
      console.log("压缩前图片大小:", res.size / 1024, 'kb');
      if (res.size > 1024 * limitSize) {
        moreCallBack();
      } else {
        lessCallBack();
      }
    }
  })
};
/**
 * 获取画布图片 
 */
// 利用cavas进行压缩  每次压缩都需要ctx.draw()  wx.canvasToTempFilePath()连用
function getCanvasImage(canvasId, imagePath, imageW, imageH, getImgsuccess) {
  const ctx = wx.createCanvasContext(canvasId);
  ctx.drawImage(imagePath, 0, 0, imageW, imageH);
  ctx.draw(false, setTimeout(function () { // 一定要加定时器，因为ctx.draw()应用到canvas是有个时间的
    wx.canvasToTempFilePath({
      canvasId: canvasId,
      x: 0,
      y: 0,
      width: imageW,
      height: imageH,
      quality: 1,
      success: function (res) {
        getImgsuccess(res.tempFilePath);
      },
    });
  }, 200));
};

// 主调用方法

/**
 * 获取小于限制大小的Image, limitSize默认为100KB，递归调用。
 */
function getLessLimitSizeImage(canvasId, imagePath, i, limitSize, drawWidth, callBack) {
  imageSizeIsLessLimitSize(imagePath, limitSize,
    (lessRes) => {
      callBack(imagePath, i);
    },
    (moreRes) => {
      wx.getImageInfo({
        src: imagePath,
        success: function (imageInfo) {
          var maxSide = Math.max(imageInfo.width, imageInfo.height);
          //画板的宽高默认是windowWidth
          var windowW = drawWidth;
          var scale = 1;
          if (maxSide > windowW) {
            scale = windowW / maxSide;
          }
          var imageW = Math.trunc(imageInfo.width * scale);
          var imageH = Math.trunc(imageInfo.height * scale);
          console.log('调用压缩', imageW, imageH);
          getCanvasImage(canvasId, imagePath, imageW, imageH,
            (pressImgPath) => {
              getLessLimitSizeImage(canvasId, pressImgPath, i, limitSize, drawWidth * 0.95, callBack);
            }
          );
        }
      })
    }
  )
};
// 图片转basee64    io操作 使用异步方式
function getBase64(img) {
  return new Promise(function (resolve, reject) {
    const FSM = wx.getFileSystemManager();
    FSM.readFile({
      filePath: img,
      encoding: 'base64',
      success(data) {
        resolve(data)
      }
    })
  })
}

const dateTime = unixtime => {
  var dateTime = new Date(parseInt(unixtime) * 1000)
  var year = dateTime.getFullYear();
  var month = (dateTime.getMonth() + 1 < 10 ? '0' + (dateTime.getMonth() + 1) : dateTime.getMonth() + 1)
  var day = (dateTime.getDate() < 10 ? '0' + (dateTime.getDate()) : dateTime.getDate())
  var hour = (dateTime.getHours() < 10 ? '0' + (dateTime.getHours()) : dateTime.getHours())
  var minute = (dateTime.getMinutes() < 10 ? '0' + (dateTime.getMinutes()) : dateTime.getMinutes())
  var second = (dateTime.getSeconds() < 10 ? '0' + (dateTime.getSeconds()) : dateTime.getSeconds())
  var now = new Date();
  var now_new = Date.parse(now.toDateString()); //typescript转换写法
  var milliseconds = now_new - dateTime;
  var timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
  return timeSpanStr;
}

function getMyDay(date) {
  var week;
  if (date.getDay() == 0) week = "周日"
  if (date.getDay() == 1) week = "周一"
  if (date.getDay() == 2) week = "周二"
  if (date.getDay() == 3) week = "周三"
  if (date.getDay() == 4) week = "周四"
  if (date.getDay() == 5) week = "周五"
  if (date.getDay() == 6) week = "周六"
  return week;
}

module.exports = {
  formatTime: formatTime,
  getLessLimitSizeImage: getLessLimitSizeImage,
  imageSizeIsLessLimitSize: imageSizeIsLessLimitSize,
  getCanvasImage: getCanvasImage,
  getBase64: getBase64,
  dateTime: dateTime,
  getMyDay: getMyDay
}