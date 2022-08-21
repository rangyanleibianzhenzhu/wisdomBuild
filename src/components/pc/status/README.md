# 状态组件
> 不同状态显示不同颜色的小圆点
#### 属性
##### 1. value 状态值
* 值可为数字、字符串或布尔类型
* value值与greenValue、redValue、yellowValue、blueValue的值进行匹配，如果一致显示对应颜色的小圆点，否则显示灰色小圆点
##### 2. greenValue 显示绿色时的状态值
* 值可为数字、字符串或布尔类型
##### 3. redValue 显示红色时的状态值
* 值可为数字、字符串或布尔类型
##### 4. yellowValue 显示黄色时的状态值
* 值可为数字、字符串或布尔类型
##### 5. blueValue 显示蓝色时的状态值
* 值可为数字、字符串或布尔类型
##### 6. greenActive 绿色状态点是否闪烁
* 值为布尔类型，默认为： false
##### 7. redActive 红色状态点是否闪烁
* 值为布尔类型，默认为： false
##### 8. yellowActive 黄色状态点是否闪烁
* 值为布尔类型，默认为： false
##### 9. blueActive 蓝色状态点是否闪烁
* 值为布尔类型，默认为： false

#### 事件
##### 1. change 值改变事件
* 参数：value 输入的数值（值为数值类型）

### 示例
```vue
<template>
  <Status :value="val" blueValue="running" greenValue="online" redValue="exception" blueActive></Status>
</template>
<script>
import Status from '@/components/pc/status'

export default {
  components: {
    Status
  },
  data () {
    return {
      val: 'running'
    }
  }
}
</script>
```
