/**
 * @file 登录页面 router
 * 
 */
import Login from './index.vue'

export default {
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
}
