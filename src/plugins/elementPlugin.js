/**
 * Element 组件库插件
 */
import Vue from 'vue'
import { DatePicker } from 'element-ui'
import CommonSelect from '@/components/el/select/CommonSelect.vue'

export default {
  install () {
    Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }

    Vue.component(DatePicker.name, DatePicker)
    Vue.component(CommonSelect.name, CommonSelect)
  }
}
