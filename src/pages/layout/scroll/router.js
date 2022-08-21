/**
 * @file router
 * 
 */
import Scroll from './ScrollDemo.vue'

export default {
  routes: [
    {
      path: '/',
      redirect: '/layout/scroll'
    },
    {
      path: '/layout/scroll',
      name: 'pcScroll',
      component: Scroll
    }
  ]
}
