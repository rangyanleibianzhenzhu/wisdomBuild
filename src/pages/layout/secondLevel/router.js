/**
 * @file PC 二级单位 router
 * 
 */
import SecondLevel from './SecondLevel.vue'

export default {
  routes: [
    {
      path: '/',
      redirect: '/layout/secondLevel'
    },
    {
      path: '/layout/secondLevel',
      name: 'secondLevel',
      component: SecondLevel
    }
  ]
}
