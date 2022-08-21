import dateUtil from './date'

// 转化为date对象
export const toDate = function (date) {
  date = new Date(date)
  if (isNaN(date.getTime())) {
    return null
  }
  clearTime(date)
  return date
}

/**
 * Date对象转化为字符串
 * @param date 日期对象
 * @param format 日期格式，默认：“yyyy-MM-dd”
 * @return {string} 日期字符串
 */
export const formatDate = function (date, format) {
  date = toDate(date)
  if (!date) return ''
  return dateUtil.format(date, format || 'yyyy-MM-dd')
}

/**
 * 日期字符串转化为Date对象
 * @param str  日期字符串
 * @param format 日期格式，默认：“yyyy-MM-dd”
 * @return {Date|boolean} 日期对象，如果转化错误返回false
 */
export const parseDate = function (str, format) {
  return str ? dateUtil.parse(str, format || 'yyyy-MM-dd') : null
}

/**
 * 获取指定月份的天数
 * @param year 年
 * @param month 月
 * @return {number} 天数
 */
export const getDayCountOfMonth = function (year, month) {
  if (month === 3 || month === 5 || month === 8 || month === 10) {
    return 30
  }

  if (month === 1) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      return 29
    } else {
      return 28
    }
  }

  return 31
}

/**
 * 获取指定日期当月1号是星期几
 * @param date 指定日期
 * @return {number} 星期几（值为0至6，表示周日至周六）
 */
export const getFirstDayOfMonth = function (date) {
  const temp = new Date(date.getTime())
  temp.setDate(1)
  return temp.getDay()
}

/**
 * 获取今天日期，并且时、分、秒、毫秒值全部为0
 * @return today {Date} 今天的Date对象
 */
export const getTodayDate = function () {
  const today = new Date()
  today.setHours(0)
  today.setMinutes(0)
  today.setSeconds(0)
  today.setMilliseconds(0)
  return today
}

/**
 * 将Date对象的时、分、秒、毫秒值全部设为0
 * @param date 日期对象
 */
export const clearTime = function (date) {
  if (date instanceof Date) {
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
  }
  return date
}

/**
 * 获取将Date对象的时间戳，时、分、秒、毫秒值全部为0
 * @param date 日期对象
 */
export const getDateTimestamp = function (date) {
  clearTime(date)
  if (date instanceof Date) {
    const timestamp = date.getTime()
    return isNaN(timestamp) ? null : timestamp
  }
  return null
}

/**
 * 将各种类型的日期值转化为Date对象
 * @param val {String | Number | Date}日期值
 */
export function convertToDate (val, format) {
  if (typeof val === 'string') {
    return parseDate(val, format)
  } else if (typeof val === 'number') {
    return toDate(val)
  } else if (val instanceof Date) {
    const timestamp = getDateTimestamp(val)
    return toDate(timestamp)
  }
  return null
}

/**
 * 将Date对象转化为指定类型的值
 * @param date dete对象
 * @param valueType 要转化的类型：'string', 'timestamp', 'date'
 * @param format 字符串类型日期值的格式
 * @return value 指定类型的值
 */
export function convertToValue (date, valueType, format) {
  let value = null
  if (date) {
    if (valueType === 'string') {
      value = date && formatDate(date, format)
    } else if (valueType === 'timestamp') {
      value = date && date.getTime()
    } else {
      value = date
    }
  }
  return value
}

/**
 * 判断是否相同值
 * @param newValue 新值
 * @param oldValue 原来的值
 * @param type 值的类型
 */
export function isSameValue (newValue, oldValue, type) {
  if (newValue === oldValue) {
    return true
  } else if (type === 'date' && newValue instanceof Date && oldValue instanceof Date) {
    return newValue.getTime() === oldValue.getTime()
  }
  return false
}
