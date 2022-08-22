/**
 * @file PC 党费情况 router
 * 
 */
import DangCost from './DangCost.vue'

export default {
  routes: [
    {
      path: '/',
      redirect: '/layout/dangCost'
    },
    {
      path: '/layout/dangCost',
      name: 'dangCost',
      component: DangCost
    }
  ]
}
