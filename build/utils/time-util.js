/**
 * 时间处理工具
 * 
 * @date 2019/11/14
 */

/**
 * 时间格式化为字符串
 * @param time 时间对象或时间毫秒数
 * @param format 格式字符串, 如：‘yyyy-MM-dd hh:mm:ss’
 * @returns {String} 时间字符串
 */
function formatTime(time, format) {
  let curDate = null
  if (typeof time === 'number') {
    curDate = new Date(time)
  } else if (time instanceof Date) {
    curDate = time
  } else {
    return ''
  }
  /*
   * eg:format="yyyy-MM-dd hh:mm:ss";
   */
  const o = {
    'M+': curDate.getMonth() + 1, // month
    'd+': curDate.getDate(), // day
    'h+': curDate.getHours(), // hour
    'm+': curDate.getMinutes(), // minute
    's+': curDate.getSeconds(), // second
    'q+': Math.floor((curDate.getMonth() + 3) / 3), // quarter
    'S': curDate.getMilliseconds() // millisecond
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (curDate.getFullYear() + '').substr(4 -
      RegExp.$1.length))
  }

  for (const k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1
        ? o[k]
        : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

module.exports = {
  formatTime
}
