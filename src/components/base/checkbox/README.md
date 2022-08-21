# 复选框
#### 属性
##### 1. value 复选框是否选中
* 值为布尔类型
##### 2. disabled 是否可用
* 值为布尔类型

#### 事件
##### 1. change 值改变事件
* 参数：value 是否选中（值为布尔类型）

### 示例
```vue
<template>
  <div class="checkbox-list">
    <div class="item normal">
      <BaseCheckbox v-model="isChecked1" @change="doChange">是否会员</BaseCheckbox>
      <span>值为:{{isChecked1}}</span>
    </div>
    <div class="item normal">
      <BaseCheckbox v-model="isChecked2" @change="doChange">是否停用</BaseCheckbox>
      <span>值为:{{isChecked2}}</span>
    </div>
    <div class="item normal">
      <BaseCheckbox v-model="isChecked3" :disabled="true" @change="doChange">不可用</BaseCheckbox>
      <span>值为:{{isChecked3}}</span>
    </div>
    <div class="item normal">
      <BaseCheckbox v-model="isChecked4" :disabled="true" @change="doChange">不可用</BaseCheckbox>
      <span>值为:{{isChecked4}}</span>
    </div>
  </div>
</template>
<script>
import BaseCheckbox from '@/components/base/checkbox/index.vue'
export default {
  name: 'CheckboxDemo',
  components: {
    DetailShell,
    BaseCheckbox
  },
  data () {
    return {
      isChecked1: false,
      isChecked2: true,
      isChecked3: false,
      isChecked4: true
    }
  },
  methods: {
    doChange (val) {
      console.log('触发change事件，value = ', val)
    }
  }
}
</script>
```
