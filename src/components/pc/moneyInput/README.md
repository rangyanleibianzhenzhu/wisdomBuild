# 金额输入框组件
* 数值为128000时，显示为 128,000.00
#### 属性
##### 1. value 金额数值
* 值为数值类型
##### 2. decimal 小数部分位数
* 值为数值类型
* 默认值：2
##### 3. canRound 是否允许四舍五入
* 值为布尔类型
* 默认值： false
> 由于JS的 tofixed 方法的四舍五入存在精度问题，不建议设为true
##### 4. canNegative 是否允许输入负数
* 值为布尔类型
* 默认值： true
##### 5. suffixText 输入框后缀显示的文字
* 值为字符串
* 默认值：""
##### 6. icon 输入框后缀显示的图标 (suffixText 为空时有效)
* 值为布尔值或字符串（通过字符串则指定图标的名称）
* 默认值："rmb"
##### 7. disabled 是否不可用
* 值为布尔类型
##### 8. readonly 是否只读
* 值为布尔类型

#### 事件
##### 1. change 值改变事件
* 参数：value 输入的数值（值为数值类型）

### 示例
```vue
<template>
  <MoneyInput v-model="moneyValue" @change="handleChange" ></MoneyInput>
</template>
<script>
import MoneyInput from '@/components/pc/moneyInput'

export default {
  name: 'CheckboxDemo',
  components: {
    MoneyInput
  },
  data () {
    return {
      moneyValue: 128000
    }
  },
  methods: {
    handleChange (val) {
      console.log('输入的金额为：', val)
    }
  }
}
</script>
```
