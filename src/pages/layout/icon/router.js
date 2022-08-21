/**
 * @file router
 * 
 */
import Icon from './IconDemo.vue'

export default {
  routes: [
    {
      path: '/',
      redirect: '/layout/icon'
    },
    {
      path: '/layout/icon',
      name: 'pcIcon',
      component: Icon
    }
  ]
}
