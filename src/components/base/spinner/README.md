# Loading 旋转器组件（IE9不支持）
#### 属性

##### 1. spinner
* 旋转器类型
* 值为字符串类型
  * default: 默认类型，圆环上有一个旋转球
  * circles: 多个圆点旋转
  * bubbles: 由小到大的气泡旋转（不建议使用，个别浏览器效果不太好）
  * spiral: 圆弧旋转
  * wavedots: 圆点波浪
##### 2. theme
* 主题色
* 值为字符串类型
  * default: 灰色(默认)
  * white: 白色
  * primary: 主题色，与$color-primary保持一致

##### 3. size
* 大小
* 值为字符串类型
  * s: 小（18px）
  * m: 中（28px,默认）
  * l: 大（38px）

### 示例
```vue
<template>
  <div class="spinner-wrap">
    <BaseSpinner spinner="circles"></BaseSpinner>
  </div>
</template>
<script>
import BaseSpinner from '@/components/base/spinner'
export default {
  name: 'SpinnerDemo',
  components: {
    BaseSpinner
  }
}
</script>
<style lang="scss" scoped>
.spinner-wrap{
  text-align: center;
}
</style>
```
