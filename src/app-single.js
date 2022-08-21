/**
 * @file 单页应用程序入口文件
 * 
 * @date 2019/5/29
 */
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App.vue'
import router from './router-single.js'
import store from './store'
import BaseIcon from '@/components/base/icon/Icon.vue'
import BaseButton from '@/components/base/button/index.vue'
import ApiPlugin from './plugins/apiPlugin.js'
import eventBusPlugin from './plugins/eventBusPlugin.js'
/* [auto single-line command {useElement=false}] */ import elementPlugin from './plugins/elementPlugin.js'
// import JsBridgePlugin from './plugins/jsbridge-plugin/index.js'
import filters from '@/assets/js/filters.js'
import { QUERY_USER_INFO } from '@/store/action-types.js'

import './assets/style/reset.css'
import './assets/style/main.scss'
/* [auto single-line command {isPC!=true}] */ import './assets/style/common-pc.scss?px2rem=false'
/* [auto single-line command {isMobile!=true}] */ import './assets/style/common-m.scss?px2rem=true'

// 处理移动端click事件300毫秒延迟
FastClick.attach(document.body)
// 注册全局按钮n组件
Vue.component('BaseIcon', BaseIcon)
// 注册全局按钮组件
Vue.component('BaseButton', BaseButton)
// 下面注释勿动，用于svg-loader自动添加svg注册代码
/* [svg register mark] */

// 注册全局事件总线
Vue.use(eventBusPlugin)
// 注册JSBridge插件 【注：依赖全局事件总线】
// Vue.use(JsBridgePlugin)
// 后台接口插件
Vue.use(ApiPlugin)
// Element 组件库插件
/* [auto single-line command {useElement=false}] */ Vue.use(elementPlugin)

// 添加全局过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// 下面注释勿动，当不需要创建前获取用户信息时，会自动注释掉该行代码
/* [auto single-line command {getUserInfoBeforeCreate=false}] */ store.dispatch(QUERY_USER_INFO, {}).finally(() => {
  new Vue({
    router: router(store),
    store,
    render: h => h(App)
  }).$mount('#app')
// 下面注释勿动，当不需要创建前获取用户信息时，会自动注释掉该行代码
/* [auto single-line command {getUserInfoBeforeCreate=false}] */ })
