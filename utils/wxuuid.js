const wxuuid = function () {
  var s = []
  var hexDigits = "0123456789abcdef"
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = "4" // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-"

  var uuid = s.join("")
  return uuid
}

/**
 * 工具类
 */
module.exports = {
  wxuuid: wxuuid,

  /**
   * scene解码
   */
  scene_decode: function (e) {
    if (e === undefined) return {}
    let scene = decodeURIComponent(e),
      params = scene.split(","),
      data = {}
    for (let i in params) {
      var val = params[i].split(":")
      val.length > 0 && val[0] && (data[val[0]] = val[1] || null)
    }
    return data
  },

  /**
   * 格式化日期格式 (用于兼容ios Date对象)
   */
  format_date: function (time) {
    // 将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
    return time.replace(/\-/g, "/")
  },

  /**
   * 对象转URL
   */
  urlEncode: function (data) {
    var _result = []
    for (var key in data) {
      var value = data[key]
      if (value.constructor == Array) {
        value.forEach(function (_value) {
          _result.push(key + "=" + _value)
        })
      } else {
        _result.push(key + "=" + value)
      }
    }
    return _result.join("&")
  }
}
