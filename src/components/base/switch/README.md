# 开关组件
#### 属性
##### 1. value
* 是否打开
* 值为布尔类型
* 默认为：false

##### 2. disabled
* 是否不可用
* 值为布尔类型
* 默认为：false

##### 3. showText
* 是否显示字，“开”或者“关”
* 值为布尔类型
* 默认为：true

#### 事件
##### 1. change 值改变事件
* 参数：value 是否打开（值为布尔类型）

### 示例
template:
```
<div class="switch-list">
  <div class="item">
    <span>开启系统通知</span>
    <BaseSwitch v-model="isOpen1" @change="doChange"></BaseSwitch>
  </div>
  <div class="item">
    <span>开启短息提醒</span>
    <BaseSwitch v-model="isOpen2" @change="doChange"></BaseSwitch>
  </div>
  <div class="item">
    <span>不显示字：关</span>
    <BaseSwitch v-model="isOpen3" :showText="false" @change="doChange"></BaseSwitch>
  </div>
  <div class="item">
    <span>不显示字：开</span>
    <BaseSwitch v-model="isOpen4" :showText="false" @change="doChange"></BaseSwitch>
  </div>
  <div class="item">
    <span>不可用：关</span>
    <BaseSwitch v-model="isOpen5" :disabled="true" @change="doChange"></BaseSwitch>
  </div>
  <div class="item">
    <span>不可用：开</span>
    <BaseSwitch v-model="isOpen6" :disabled="true" @change="doChange"></BaseSwitch>
  </div>
</div>
```
js:
```
import BaseSwitch from '@/components/base/switch/index.vue'
export default {
  name: 'SwitchDemo',
  components: {
    BaseSwitch
  },
  data () {
    return {
      isOpen1: false,
      isOpen2: true,
      isOpen3: false,
      isOpen4: true,
      isOpen5: false,
      isOpen6: true
    }
  },
  methods: {
    doChange (val) {
      console.log('触发change事件，value = ', val)
    }
  }
}
```
