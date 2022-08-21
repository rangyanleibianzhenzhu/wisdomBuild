# 按钮组件
### 属性
##### 1. text 按钮文字
可以通过btnText设置按钮文字，也可以像button标签一样通过标签内容设置按钮文字
##### 2. type 按钮类型
控制按钮样式
* primary 蓝色按钮
* disabled 灰色按钮
* success 绿色按钮
* danger 红色按钮
##### 3. size 按钮大小
* xs 特小
* s 小
* m 中
* l 大
* xl 特大
* full 100%宽(仅移动端支持，且为移动端默认大小)
##### 3. icon 按钮图标
svg图标库的图标名称，即assets/icon目录下svg图片的名称（不包含后缀）
##### 4. iconPosition 图标的位置
* start 图标在左侧，图标右边有空白
* end 图标在右侧，图标左边有空白
##### 5. charLength 汉字个数
* 值为2到10的数字，宽度等同于有指定个数汉字的按钮宽度
##### 6. throttle 是否启用函数节流（默认为true,启用）
值为布尔类型，如果启动函数节流在指定的时间内只触发一次点击事件
##### 7. throttleTime 函数节流等待时间
值为数字类型，单位:毫秒，默认值为：1000
##### 8. disabled 按钮是否可用
* true 按钮可用，触发click事件
* false 按钮不可用，不触发click事件

### 示例
```
<template>
  <div class="button-demo">
    <div class="button-demo">
      <BaseButton @click="clickHandle">默认按钮</BaseButton><br/>
      <BaseButton type="primary" @click="clickHandle">主题色</BaseButton><br/>
      <BaseButton :disabled="true" @click="clickHandle">不可用</BaseButton><br/>
      <BaseButton size="xl" @click="clickHandle">超大号</BaseButton><br/>
      <BaseButton size="l" @click="clickHandle">大号</BaseButton><br/>
      <BaseButton size="m" @click="clickHandle">中号</BaseButton><br/>
      <BaseButton size="s" @click="clickHandle">小号</BaseButton><br/>
      <BaseButton size="xs" @click="clickHandle">超小号</BaseButton><br/>
      <BaseButton size="m" @click="clickHandle">三个字</BaseButton><br/>
      <BaseButton :charLength="3" @click="clickHandle">确 定</BaseButton><br/>
      <BaseButton :charLength="3" @click="clickHandle">O K</BaseButton><br/>
      <BaseButton @click="clickHandle" class="btn-out">自定义样式</BaseButton><br/>
      <BaseButton type="primary" @click="clickHandle" icon="home"></BaseButton><br/>
      <BaseButton type="primary" @click="clickHandle" icon="search" iconPosition="end">
        <span>查询</span>
      </BaseButton><br/>
      <BaseButton @click="clickHandle" icon="home" iconPosition="start">
        <span>返回首页</span>
      </BaseButton>
      <BaseButton @click="clickHandle" :throttle="true">函数节流3秒</BaseButton>
      <BaseButton @click="clickHandle" :throttleTime="1000">函数节流1秒</BaseButton>
      <BaseButton @click="clickHandle" :throttle="false">禁用函数节流</BaseButton>
    </div>
  </div>
</template>
<script>
import BaseButton from '@/components/base/button/index.vue'

export default {
  name: 'ButtonDemo',
  components: {
    BaseButton
  },
  data () {
    return {}
  },
  methods: {
    clickHandle (event) {
      let text = event.currentTarget.innerText
      this.$toast(`点击了“${text}”按钮`)
    }
  }
}
</script>
<style lang="scss" scoped>
.button-demo{
  text-align: center;
  line-height: 120px;
}
button.btn-out{
  width: 360px;
  background-color: #333333;
  border-radius: 20px;
  color: #fff;
}
</style>
```

