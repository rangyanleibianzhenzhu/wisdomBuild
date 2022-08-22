/**
 * @file PC 党建活动 router
 * 
 */
import DangActivity from './dangActivity.vue'

export default {
  routes: [
    {
      path: '/',
      redirect: '/layout/dangActivity'
    },
    {
      path: '/layout/dangActivity',
      name: 'dangActivity',
      component: DangActivity
    }
  ]
}
