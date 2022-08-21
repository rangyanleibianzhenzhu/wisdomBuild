/**
 * 后台接口插件
 * 
 * @date 2018/7/3
 */
import Vue from 'vue'
import api from '@/assets/js/api.js'
export default {
  install () {
    Vue.prototype.$apiGet = api.get
    Vue.prototype.$apiPost = api.post
    Vue.prototype.$apiUpload = api.upload
    Vue.prototype.$apiDownload = api.download
    Vue.prototype.$apiBaseUrl = api.baseUrl
  }
}
