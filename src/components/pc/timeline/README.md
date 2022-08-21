# Timeline 时间线父组件

# TimelineItem 时间线内容子组件

#### 属性
##### 1. timestamp 时间戳
* 值为 String 类型 
* 非必填
##### 2. placement 时间戳位置 
* 值为 String 类型
* 默认值：bottom
  * 可选值 top / bottom
* 非必填
##### 3. type 配置对象
* 值为 String 类型
* 可选值 primary / success / warning / danger / info
* 非必填
##### 4. color 节点颜色
* 值为 String 类型
* 可选值支持格式为 hsl / hsv / hex / rgb
* 非必填
##### 5. size 节点尺寸
* 值为 String 类型
* 默认值：normal
  * 可选值 normal / large
* 非必填
##### 6. icon 节点图标
* 值为 String 类型
* 非必填


### 简单示例
```vue
<template>
  <Timeline>
    <TimelineItem
      v-for="(activity, index) in activities"
      :key="index"
      :timestamp="activity.timestamp">
      {{activity.content}}
    </TimelineItem>
  </Timeline>
</template>
<script>
import { Timeline, TimelineItem } from '@/components/pc/timeline'

export default {
  components: {
    Timeline,
    TimelineItem
  },
  data () {
    return {
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }],
    }
  }
}
</script>
```

