import axios from 'axios'
import Vue from 'vue'
// 是否显示重新登录弹框
let isShowUnauthorized = false

// 接口根地址（由webpack的插件DefinePlugin注入）
/* eslint-disable no-undef */
const baseUrl = API_BASE_URL
// 接口响应配置（由webpack的插件DefinePlugin注入）
/* eslint-disable no-undef */
const apiResponseConfig = API_RESPONSE_CONFIG

/**
 * 业务异常类
 */
class BusinessError extends Error {
  constructor (code, message, data) {
    super(message)
    this.code = code
    this.name = 'BusinessError'
    this.data = data
  }
}
/**
 * 系统异常类
 */
class SystemError extends Error {
  constructor (code, message, data) {
    super(message)
    this.code = code
    this.name = 'SystemError'
    this.data = data
  }
}

// axios 配置
// axios.defaults.timeout = 10000
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
/* axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.interceptors.request.use((config) => {
  if (config.method === 'post' && !(config.data instanceof FormData)) {
    config.data = qs.stringify(config.data)
  }
  return config
}, (error) => {
  console.error('错误的传参')
  return Promise.reject(error)
}) */

/**
 * POST 请求
 * @param option 参数
 *                url: 请求路径（会拼接到baseUrl后面，“/” 开头）
 *                data: 请求参数对象
 *                timeout: 请求超时时间（默认为：10000，即10秒）
 *                headers: 请求头信息
 *                toastError: 自动提示业务异常信息，默认为true，为false时不自动提示
 * @param vm Vue对象，如果this为Vue对象默认为this（用于异常时自动toast提示异常信息以及登录失效时弹出重新登录提示框）
 * @return {Promise} data 数据
 */
function post (option, vm) {
  option.method = 'POST'
  if (!vm && this instanceof Vue) {
    vm = this
  }
  return http(option, vm)
}

/**
 * GET 请求
 * @param option 参数
 *                url: 请求路径（会拼接到baseUrl后面，“/” 开头）
 *                data: 请求参数对象
 *                timeout: 请求超时时间（默认为：10000，即10秒）
 *                headers: 请求头信息
 *                toastError: 自动提示业务异常信息，默认为true，为false时不自动提示
 * @param vm Vue对象，如果this为Vue对象默认为this（用于异常时自动toast提示异常信息以及登录失效时弹出重新登录提示框）
 * @return {Promise} data 数据
 */
function get (option, vm) {
  option.method = 'GET'
  if (!vm && this instanceof Vue) {
    vm = this
  }
  return http(option, vm)
}

/**
 * 文件上传请求
 * @param option 参数
 *                url: 请求路径（会拼接到baseUrl后面，“/” 开头）
 *                data: 请求参数对象
 *                timeout: 请求超时时间（默认为：10000，即10秒）
 *                headers: 请求头信息
 *                toastError: 自动提示业务异常信息，默认为true，为false时不自动提示
 * @param vm Vue对象，如果this为Vue对象默认为this（用于异常时自动toast提示异常信息以及登录失效时弹出重新登录提示框）
 * @return {Promise} data 数据
 */
function upload (option, vm) {
  option.method = option.method || 'POST'
  option.isUpload = true
  if (!vm && this && this.__isVue) {
    vm = this
  }
  // 当发送 Content-Type 为 multipart/form-data 的 AJAX 请求时，不要显式设置 Content-Type；
  // 在部分浏览器中会阻止浏览器设置带 boundary（用于分隔请求体中的表单字段） 的 Content-Type，后台接口无法获取 boundary而报错。
  // headers['Content-Type'] = 'multipart/form-data'
  return http(option, vm)
}

/**
 * 文件下载请求
 * @param option 参数
 *                url: 请求路径（会拼接到baseUrl后面，“/” 开头）
 *                data: 请求参数对象
 *                timeout: 请求超时时间（默认为：10000，即10秒）
 *                headers: 请求头信息
 *                toastError: 自动提示业务异常信息，默认为true，为false时不自动提示
 * @param vm Vue对象，如果this为Vue对象默认为this（用于异常时自动toast提示异常信息以及登录失效时弹出重新登录提示框）
 * @return {Promise} response对象
 */
function download (option, vm) {
  option.method = option.method || 'GET'
  option.isDownload = true
  option.responseType = 'blob'
  if (!vm && this instanceof Vue) {
    vm = this
  }
  return http(option, vm)
}

/**
 * 请求后台接口
 * @param option 参数
 *                url: 请求路径（会拼接到baseUrl后面，“/” 开头）
 *                data: 请求参数对象
 *                timeout: 请求超时时间（默认为：10000，即10秒）
 *                headers: 请求头信息
 *                toastError: 自动提示业务异常信息，默认为true，为false时不自动提示
 * @param vm Vue对象（用于异常时自动toast提示异常信息以及登录失效时弹出重新登录提示框）
 * @return {Promise} Promise对象
 */
function http (option, vm) {
  return new Promise((resolve, reject) => {
    let method = option.method || 'POST'
    let url = baseUrl + option.url
    let headers = option.headers || {}
    let timeout = option.timeout || 10000
    let data = {} // 可以在此设置默认值

    if (option.data) {
      if (option.data instanceof FormData) {
        // headers['Content-Type'] = 'multipart/form-data'
        let formData = option.data
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key])
        })
        data = formData
      } else {
        data = { ...data, ...option.data }
      }
    }

    let otherOptions = { ...option }
    delete otherOptions.method
    delete otherOptions.url
    delete otherOptions.data
    delete otherOptions.headers
    delete otherOptions.toastError
    delete otherOptions.timeout
    let requestOptions = { method, url, headers, timeout, ...otherOptions }
    if (method.toUpperCase() === 'GET') {
      requestOptions.params = data
    } else {
      requestOptions.data = data
    }
    axios(requestOptions).then((res) => {
      // Content-Disposition: attachment;fileName=贷中项目进度表0907.xlsx;filename*=UTF-8''%C3%A8%C2%B4%C2%B7%C3%A4%C2%B8%C2%AD%C3%A9%C2%A1%C2%B9%C3%A7%C2%9B%C2%AE%C3%A8%C2%BF%C2%9B%C3%A5%C2%BA%C2%A6%C3%A8%C2%A1%C2%A80907.xlsx
      const contentDisposition = res.headers['content-disposition']
      // 文件下载
      if (contentDisposition &&
        (/filename\*=UTF-8''(.*)/.test(contentDisposition) || /filename="(.*)"/.test(contentDisposition))) { // 如果是文件下载
        const utf8Match = contentDisposition.match(/filename\*=UTF-8''(.*)/) // 匹配UTF-8的文件名
        const normalMatch = contentDisposition.match(/filename="(.*)"/) // 匹配普通英文文件名
        const filename = utf8Match ? decodeURIComponent(utf8Match[1]) : normalMatch[1]
        const blob = new Blob([res.data])
        if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE
          window.navigator.msSaveOrOpenBlob(blob, filename)
        } else { // 其他浏览器
          const downloadElement = document.createElement('a')
          const href = window.URL.createObjectURL(blob)
          downloadElement.href = href
          downloadElement.download = filename
          document.body.appendChild(downloadElement)
          downloadElement.click()
          document.body.removeChild(downloadElement)
          window.URL.revokeObjectURL(href)
        }
        resolve(res)
      } else { // JSON信息
        getResponseInfo(res).then((resInfo) => {
          responseInfoHandle(resInfo, resolve, reject, option, vm, requestOptions)
        })
      }
    }, err => {
      console.error('请求失败！', err)
      errorhandle(err, reject, option, vm)
    }).catch(function (err) {
      console.error('请求失败！', err)
      errorhandle(err, reject, option, vm)
    })
  })
}

// 处理响应信息
function responseInfoHandle (resInfo, resolve, reject, option, vm) {
  // 请求是否成功
  let isSuccess = resInfo[apiResponseConfig.codeProperty] === apiResponseConfig.successCodeValue
  // 状态码
  let code = resInfo[apiResponseConfig.codeProperty]
  // 描述信息
  let message = resInfo[apiResponseConfig.messageProperty] || '请求失败！'
  // 数据
  let data = (apiResponseConfig.dataProperty ? resInfo[apiResponseConfig.dataProperty] : resInfo) || {}

  if (isSuccess) { // 请求成功
    console.log(`[${option.method || 'POST'}]${option.url} 请求成功！\n请求参数:`, option.data, '\n响应结果:', resInfo)
    resolve(data)
  } else { // 业务异常
    console.error(`[${option.method} || 'POST']${option.url} 请求失败！\n请求参数:`, option.data, '\n响应结果:', resInfo)
    let err = new BusinessError(code, message, data)
    errorhandle(err, reject, option, vm)
  }
}

// 获取响应信息json对象
function getResponseInfo (res) {
  return new Promise((resolve, reject) => {
    // 返回的信息
    let resInfo = res.data
    if (resInfo instanceof Blob) {
      const reader = new FileReader()
      reader.readAsText(resInfo, 'utf-8')
      reader.onload = () => {
        resInfo = JSON.parse(reader.result)
        resolve(resInfo)
      }
    } else {
      resolve(resInfo)
    }
  })
}

/* function getCookie (key) {
  const reg = new RegExp('(?:^|;+|\\s+)' + key + '=([^;]*)')
  const m = window.document.cookie.match(reg)
  return !m ? '' : m[1]
} */

/* 异常处理 */
function errorhandle (err, reject, option, vm) {
  console.error(option.url, '请求失败！', err.code, err)
  let error = null
  if (err.name === 'BusinessError') {
    error = err
  } else {
    console.error(option.url, '请求失败！', err.code, err)
    error = new SystemError(500, '非常抱歉，系统出现错误，请稍后重试！')
  }
  console.log('error = ', error)
  if (vm) {
    if (error.name === 'BusinessError') { // 业务异常
      // 没有权限
      if (error.code === 401) {
        alert(9999)
        if (!isShowUnauthorized) {
          vm.$popupAlert({
            title: '提示',
            message: '未登录或者会话已过期，请重新登录！',
            // width: 330,
            btnText: '重新登录',
            onOK: () => {
              isShowUnauthorized = false // 是否显示重新登录弹框设为true
              // 跳转到登录页面，登录成功后还跳转到原路径
              vm.$router.push({ path: '/login', params: { fromPath: vm.$route.fullPath } })
              vm.$eventBus.$emit('NO_AUTH_EVENT')
            }
          })
          isShowUnauthorized = true // 是否显示重新登录弹框设为true
        }
        error.isAuthFailed = true
      } else if (option.toastError !== false) {
        vm.$toast({ type: 'error', message: error.message })
      }
    } else { // 系统异常
      vm.$toast('网络异常！')
    }
  }
  reject(error)
}

export default {
  baseUrl,
  http,
  post,
  get,
  upload,
  download
}
