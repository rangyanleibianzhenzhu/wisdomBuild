# Progress 进度条组件

#### 属性
##### 1. percentage 百分比 
* 值为 Number 类型 
* 可选值 0-100
* 必填
##### 2. status 进度条当前状态 
* 值为 String 类型
* 可选值 success / error / warn
* 非必填
##### 3. format 指定进度条文字内容
* 值为 Function 类型
* 非必填
* 说明：
  * 参数：percentage 百分比
  * 返回值：自定义百分比格式内容
##### 4. textInside 进度条显示文字内置在进度条内（只在 type=line 时可用）
* 值为 Boolean 类型
* 非必填
##### 5. strokeWidth 进度条的宽度，单位px
* 值为 Number 类型
* 默认值：6
* 非必填
##### 6. type 进度条类型
* 值为 String 类型
* 可选值 line / circle / dashboard
* 非必填
##### 7. color 进度条背景色（会覆盖 status 状态颜色）
* 值为 String 类型
* 可选值 string / function / array
* function说明：
  * 参数：percentage 百分比
  * 返回值：自定义颜色
* array格式：
  * 数组中对象示例：{ color: '#f56c6c', percentage: 20}
  * color：自定义颜色
  * percentage： 百分比
* 非必填


### 简单示例
```vue
<template>
  <Progress :percentage="percentage" status="success"></Progress>
</template>
<script>
import Progress from '@/components/pc/progress'

export default {
  components: {
    Progress
  },
  data () {
    return {
      percentage: 20,
    }
  }
}
</script>
```

