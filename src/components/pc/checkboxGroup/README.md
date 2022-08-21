# 复选框组
#### 属性
##### 1. value 值
* 值为 Array 类型
* 数组中每一项为 options 中选中的选项对象的 value值

##### 2. options 选项数组
* 必填
> 数组中对象示例：{ value: ‘01’， label: '男'， disabled：false}
> * value： 值
> * label： 显示的文字
> * disabled: 是否可用

##### 3. disabled 是否可用
* 值为布尔类型

#### 事件
##### 1. change 值改变事件
* 参数：value 选中的值（value数组）

### 示例
```vue
<template>
  <CheckboxGroup v-model="value" :options="options"></CheckboxGroup>
</template>
<script>
import CheckboxGroup from '@/components/base/checkboxGroup/index.vue'

export default {
  components: {
    CheckboxGroup
  },
  data () {
    return {
      value: ['01', '03'],
      options: [
        { value: '01', label: '工商银行' },
        { value: '02', label: '建设银行' },
        { value: '03', label: '中国银行' },
        { value: '04', label: '农业银行' },
        { value: '05', label: '天地银行', disabled: true }
      ]
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
