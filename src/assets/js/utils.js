/**
 * 函数相关工具
 * 
 * @date 2018/12/26
 */

function restArguments (func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex
  return function () {
    let length = Math.max(arguments.length - startIndex, 0)
    let rest = Array(length)
    let index = 0
    for (; index < length; index++) {
      rest[index] = arguments[index + startIndex]
    }
    switch (startIndex) {
      case 0: return func.call(this, rest)
      case 1: return func.call(this, arguments[0], rest)
      case 2: return func.call(this, arguments[0], arguments[1], rest)
    }
    let args = Array(startIndex + 1)
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index]
    }
    args[startIndex] = rest
    return func.apply(this, args)
  }
}

const delay = restArguments(function (func, wait, args) {
  return setTimeout(function () {
    return func.apply(null, args)
  }, wait)
})

const nowTime = Date.now || function () {
  return new Date().getTime()
}
/**
 * 防抖动
 * @param func
 * @param wait
 * @param immediate
 * 参考：http://underscorejs.org/#debounce
 */
export function debounce (func, wait, immediate) {
  let timeout, result

  let later = function (context, args) {
    timeout = null
    if (args) result = func.apply(context, args)
  }

  let debounced = restArguments(function (args) {
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      let callNow = !timeout
      timeout = setTimeout(later, wait)
      if (callNow) result = func.apply(this, args)
    } else {
      timeout = delay(later, wait, this, args)
    }

    return result
  })

  debounced.cancel = function () {
    clearTimeout(timeout)
    timeout = null
  }
  return debounced
}

/**
 * 函数节流
 * @param func
 * @param wait
 * @param options
 * @returns {throttled}
 * 参考：http://underscorejs.org/#throttle
 */
export function throttle (func, wait, options) {
  let timeout, context, args, result
  let previous = 0
  if (!options) options = {}

  let later = function () {
    previous = options.leading === false ? 0 : nowTime()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }

  let throttled = function () {
    let now = nowTime()
    if (!previous && options.leading === false) previous = now
    let remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }

  throttled.cancel = function () {
    clearTimeout(timeout)
    previous = 0
    timeout = context = args = null
  }

  return throttled
}

/**
 * 生成唯一主键 UUID
 * @return {string}
 */
export function generateUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 加载脚本
 * @param src 脚本文件地址
 * @param id script元素id,用于判断是否已加载
 * @param attrs script元素属性对象
 * @return {Promise}
 */
export function loadScript (src, id, attrs) {
  return new Promise((resolve, reject) => {
    if (id && document.getElementById(id)) {
      resolve()
      return
    }
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src
    if (id) {
      script.id = id
    }
    if (attrs) {
      for (let attr in attrs) {
        script.setAttribute(attr, attrs[attr])
      }
    }
    if (script.readyState) { // IE
      script.onreadystatechange = function () {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null
          resolve()
        }
      }
    } else { // Chrome, Opera, ...
      script.onload = function (event) {
        resolve()
      }
    }
    document.body.appendChild(script)
  })
}

/**
 * 加载样式文件
 * @param href 样式url
 * @param id 样式id
 */
export function loadCss (href, id) {
  if (id && document.getElementById(id)) {
    return
  }
  let link = document.createElement('link')
  link.rel = 'stylesheet'
  link.type = 'text/css'
  link.href = href
  let head = document.getElementsByTagName('head')[0]
  head.appendChild(link)
}

/**
 * 加载样式文本
 * @param cssText 样式文本
 * @param id 样式id
 */
export function loadStyle (cssText, id) {
  if (id && document.getElementById(id)) {
    return
  }
  let style = document.createElement('style')
  style.setAttribute('type', 'text/css')
  let text = document.createTextNode(cssText)
  style.appendChild(text)
  let head = document.getElementsByTagName('head')[0]
  head.appendChild(style)
}
