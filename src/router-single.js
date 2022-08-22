/**
 * @file 单页应用路由
 * 
 */
import Vue from 'vue'
import Router from 'vue-router'

/* eslint-disable no-undef */
const routerMode = APP_ROUTER_MODE // 路由模式 （由webpack的插件DefinePlugin注入）
/* eslint-disable no-undef */
const routerRoot = APP_ROUTER_ROOT // 路由根路径 （由webpack的插件DefinePlugin注入）
// 是否需要记录滚动条位置
/* eslint-disable no-undef */
const isRecordScrollPosition = APP_SHOW_TABS // 是否显示功能tab页签

const Layout = () => import(/* webpackChunkName: "layout" */ '@/layout/pc/AppLayout.vue')
const NotFound = () => import(/* webpackChunkName: "not-found" */ '@/pages/NotFound.vue')
const Home = () => import(/* webpackChunkName: "pc-home" */ './pages/layout/home/Home.vue')
const DangCost = () => import(/* webpackChunkName: "pc-dangCost" */ './pages/layout/dangCost/DangCost.vue')
const SecondLevel = () => import(/* webpackChunkName: "pc-secondLevel" */ './pages/layout/secondLevel/SecondLevel.vue')
const DangActivity = () => import(/* webpackChunkName: "pc-dangActivity" */ './pages/layout/dangActivity/DangActivity.vue')

Vue.use(Router)

export default function (store) {
  let router = new Router({
    mode: routerMode,
    base: routerRoot,
    linkActiveClass: 'active', // 将激活的路由添加一个mui-active类名称
    routes: [
      {
        name: 'index',
        path: '/',
        // 下面注释勿动，当需要创建前获取用户信息时，会自动注释掉该行代码
        /* [auto single-line command {getUserInfoBeforeCreate=true}] */ redirect: { name: 'home' }
      },
      {
        path: '/layout',
        component: Layout,
        redirect: { name: 'home' },
        children: [
          {
            path: 'home',
            name: 'home',
            component: Home
          },
          {
            path: 'dangCost',
            name: 'dangCost',
            component: DangCost
          },
          {
            path: 'secondLevel',
            name: 'secondLevel',
            component: SecondLevel
          },
          {
            path: 'dangActivity',
            name: 'dangActivity',
            component: DangActivity
          }
        ]
      },
      {
        path: '*',
        name: 'not-found',
        component: NotFound
      }
    ]
  })

  router.beforeEach((to, from, next) => {
    // 记录滚动条位置
    if (isRecordScrollPosition) {
      let scrollElement = document.getElementById('tabsViewContent')
      if (scrollElement && from.meta.recordScrollPosition !== false) {
        from.meta.__scrollTop = scrollElement.scrollTop
      }
    }

    // 下面注释勿动，当不需要创建前获取用户信息时，会自动注释掉该段代码
    /* [auto multi-line command START {getUserInfoBeforeCreate=false}] */
    // 根据用户登录状态，跳转页面
    if (Object.keys(store.getters.userInfo).length > 0) { // 如果用户已登录
      if (to.name === 'index') { // 如果是根路径，由于根路径没有页面，重定向到首页
        router.replace('/layout/home')
        return
      }
    } else { // 如果用户未登录
      if (/^\/layout\//.test(to.path)) { // 如果是登录后才能显示的页面，跳转到登录页，登录成功后还跳回此路径
        router.push({ path: '/login', params: { fromPath: to.fullPath } })
        return
      } else if (to.name === 'index') { // 如果是根路径，跳转到登录页，由于根路径没有页面，登录成功后不再跳回此路径
        router.replace('/login')
        return
      }
    }
    /* [auto multi-line command END {getUserInfoBeforeCreate=false}] */

    next()
  })
  router.afterEach((to, from) => {
    // 滚动条回到上次位置
    if (isRecordScrollPosition) {
      let scrollElement = document.getElementById('tabsViewContent')
      if (scrollElement) {
        setTimeout(() => {
          let scrollTop = to.meta.__scrollTop || 0
          if (scrollElement.scrollTo) {
            scrollElement.scrollTo(0, scrollTop)
          } else { // 兼容 IE
            scrollElement.scrollTop = scrollTop
          }
        }, 10)
      }
    }

    Vue.prototype.$eventBus.$emit('ROUTER_CHANGE', to, from)
  })
  return router
}
