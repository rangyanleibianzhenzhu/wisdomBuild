/**
 * @file PC 首页 router
 * 
 */
import Home from './Home.vue'

export default {
  routes: [
    {
      path: '/',
      redirect: '/layout/home'
    },
    {
      path: '/layout/home',
      name: 'home',
      component: Home
    }
  ]
}
