/**
 * 过滤器
 * 
 * @date 2018/7/16
 */
import dateUtil from './date.js'

// 'yyyy-MM-ddTHH:mm:ss.SSSZ'
/**
 * 转换为时间字符串
 * @param raw 原始时间数据（示例 ：'2021-01-01 10:20:56.102' , 1629713909, 1629713909797）
 * @param targetFormat 目标时间字符串格式
 * @param originFormat 原时间字符串格式(原始时间为时间字符串时使用，且必须)
 * @param originTimezoneOffset 原格式的时区偏移时间（单位为：分）
 */
function dateTime (raw,
  // targetFormat = 'yyyy-MM-dd HH:mm:ss.SSS',
  targetFormat = 'yyyy-MM-dd HH:mm:ss',
  originFormat,
  originTimezoneOffset = -480) {
  let date = null
  if (!raw) return
  if (typeof raw === 'string') {
    date = dateUtil.parse(raw, originFormat)
  } else if (typeof raw === 'number' && String(raw).length === 10) {
    date = new Date(raw * 1000)
  } else {
    date = new Date(raw)
  }

  let offset = originTimezoneOffset ? ((originTimezoneOffset - date.getTimezoneOffset()) * 60 * 1000) : 0
  return dateUtil.format(new Date(date.getTime() + offset), targetFormat)
}

/**
 * 转换为金额字符串，例："168,234.23"
 * @param num 数字（必需）
 * @param places 小数位数（默认为：2）
 * @param symbol 金额符号，如：“¥”（默认为：“”）
 * @param thousand 千分位分割符（默认为：“,”）
 * @param decimal 小数分割符（默认为：“.”）
 * @returns {string|*}
 */
export function money (num, places, symbol, thousand, decimal) {
  let number = Number(num)
  if (num !== undefined && num !== null && num !== '' && !isNaN(number)) {
    places = !isNaN(places = Math.abs(places)) ? places : 2
    symbol = symbol !== undefined ? symbol : ''
    thousand = thousand || ','
    decimal = decimal || '.'
    let negative = number < 0 ? '-' : ''
    let i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + ''
    let j = (j = i.length) > 3 ? j % 3 : 0
    return symbol + negative + (j ? i.substr(0, j) + thousand : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) +
      (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : '')
  }
  return num
}

export default {
  dateTime,
  money
}
