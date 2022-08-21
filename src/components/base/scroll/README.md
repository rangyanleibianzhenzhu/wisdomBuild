# 滚动组件
> https://better-scroll.github.io/docs/zh-CN/

### 1.  属性
##### scrollX - 是否开启横向滚动
* 类型：Boolean
* 默认值：false
##### scrollY - 是否开启纵向滚动
* 类型：Boolean
* 默认值：true
##### scrollbar - 是否显示滚动条
* 类型：Boolean
* 默认值：true
##### mouseWheel - 是否支持鼠标滚轮
* 类型：Boolean | Object
* 默认值：true
* Object类型值示例：
  ```
  {
    speed: 20,
      invert: false,
    easeTime: 300,
    discreteTime: 400,
    throttleTime: 0,
    dampingFactor: 0.1
  }
  ```    
##### bounce - 是否显示回弹动画
* 类型：Boolean | Object
* 默认值：false
* Object类型值示例：
  ```
  {
      top: true,
      bottom: true,
      left: true,
      right: true
    }
  ```
##### nestedScroll - 是否多层嵌套滚动条
* 类型：Boolean | Object
* 默认值：false
* Object类型值示例：
  ```
  { groupId: 'dummy-divide' }
  ```
##### pullDownRefresh - 是否支持下拉刷新
* 类型：Boolean | Object
* 默认值：false
* Object类型值示例：
  ```
  {
    threshold: 90,
    stop: 40
  }
  ```

##### pullUpLoad - 是否支持上拉加载
* 类型：Boolean | Object
* 默认值：false
* Object类型值示例：
  ```
  {
    threshold: 0
  }
  ```
##### wrapperBgColor - 包裹器背景色（上拉、下拉漏出的底色）
* 类型：String
* 默认值：transparent
* 备注：非BetterScroll 配置项

##### contentBgColor - 内容区域背景色（上拉、下拉漏出的底色）
* 类型：String
* 默认值：transparent
* 备注：非BetterScroll 配置项

##### eventId - 重新初始化滚动条事件的ID
* 类型：String
* 无默认值
* 备注：非BetterScroll 配置项
* 其他组件中触发重新初始化滚动条事件
  ```
  this.$eventBus.$emit('init-scroll-' + this.scrollEventId)
  ```
* 其他组件中触发刷新滚动条事件
  ```
  this.$eventBus.$emit('refresh-scroll-' + this.scrollEventId)
  ```
##### stretch - 是否拉伸内容区域的第一个子元素（将第一个子元素的min-height设置为包裹区域的高度）
* 类型：Boolean
* 默认值：false
* 备注：非BetterScroll 配置项

##### observeDOM - 是否开启 DOM 改变的探测
* 类型：Boolean
* 默认值：true

##### observeImage - 开启图片元素加载的探测
* 类型：Boolean
* 默认值：false

##### probeType - 何时派发 scroll 事件
* 类型：Number
* 默认值：0
* 说明：
    * probeType 为 0，在任何时候都不派发 scroll 事件，
    * probeType 为 1，仅仅当手指按在滚动区域上，每隔 momentumLimitTime 毫秒派发一次 scroll 事件，
    * probeType 为 2，仅仅当手指按在滚动区域上，一直派发 scroll 事件，
    * probeType 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画

##### eventPassthrough - 保留原生的滚动的方向
* 类型：String
* 默认值：''
* 可选值：
  * 'vertical': 保留纵向的原生滚动
  * 'horizontal': 保留横向的原生滚动
  
##### click - 点击时是否派发click事件
* 类型：Boolean
* 默认值：true

##### stopPropagation - 是否阻止事件冒泡
* 类型：Boolean
* 默认值：false

##### bounceTime - 回弹动画的动画时长(单位:ms)
* 类型：Number
* 默认值：800
    
##### useTransition - 是否使用 CSS3 transition 动画(如果设置为 false，则使用 requestAnimationFrame 做动画)
* 类型：Boolean
* 默认值：true  
    

### 2. 样式要求
* 组件外面需要包裹可以相对定位的元素，增加样式：```position: relative```
```vue
<template>
  <div class="scroll-parent">
    <Scroll>
      <!-- 可滚动区域内容 -->
    </Scroll>
  </div>
</template>
<script>
import Scroll from '@/components/base/scroll'
export default {
  components: {
    Scroll
  }
}
</script>
<style lang="scss" scoped>
.scroll-parent {
  position: relative;
  height: 100px;
}
</style>
```
* 示例中的scroll-parent，position 为 relative，的可滚动区域的大小与该元素大小相同

### 一、简单示例
```vue
<template>
  <scroll :bounce="false" :observeImage="true" wrapperBgColor="#f9f9f9" contentBgColor="#fff">
    <div>
      <img src="https://tinypng.com/images/panda-confetti.png" alt=""><br>
      <img src="https://tinypng.com/images/bamboo.png" alt=""><br>
      <img src="https://tinypng.com/images/apng/panda-waving.png" alt=""><br>
      <h1>1</h1>
      <h1>2</h1>
      <h1>3</h1>
      <h1>4</h1>
      <h1>5</h1>
      <h1>6</h1>
      <h1>7</h1>
      <h1>8</h1>
      <h1>9</h1>
      <h1>10</h1>
    </div>
  </scroll>
</template>
<script>
import Scroll from '@/components/base/scroll'
export default {
  components: {
    Scroll
  }
}
</script>
```
### 二、横向滚动示例
#### 1.  相关属性
  * scrollX - 是否支持横向滚动
  * scrollY - 是否支持纵向滚动

#### 2. 样式要求
* 内容必须为行内元素并且不能折行

```
<template>
  <div class="nav-wrap">
    <scroll :scrollbar="false" :bounce="true" :scrollX="true" :scrollY="false">
      <ul class="nav">
        <li>推荐</li>
        <li>娱乐</li>
        <li>视频</li>
        <li>生活</li>
        <li>资讯</li>
        <li>时尚</li>
        <li>美妆</li>
        <li>健康</li>
        <li>体育</li>
      </ul>
    </scroll>
  </div>
</template>
<script>
import Scroll from '@/components/base/scroll'
export default {
  name: 'ScrollHorizontal',
  components: {
    Scroll
  }
}
</script>
<style lang="scss" scoped>
$nav-height: 92px;
.nav-wrap{
  position: relative;
  height: $nav-height;
}
.nav{
  display: inline-flex;
  flex-wrap: nowrap;
  height: $nav-height;
  min-width: 750px;
  padding: 0 30px;
  background-color: #f5fffc;
  list-style: none;
  li {
    line-height: $nav-height;
    font-size: 36px;
    text-align: center;
    white-space: nowrap;
    padding: 0 40px;
  }
}
</style>
```

### 三、滚动条嵌套
#### 1.  相关属性
* nestedScroll - 是否多层嵌套滚动条
  * 说明：同向的嵌套需要设置此属性，非同向不需要
```vue
<template>
  <scroll :bounce="true" :observeImage="true"
          wrapperBgColor="#f9f9f9" contentBgColor="#fff" :nestedScroll="{ groupId: 'myGroup' }">
    <div class="page-content">
      <h1>1</h1>
      <h1>2</h1>
      <h1>3</h1>
      <h1>4</h1>
      <h1>5</h1>
      <div class="vertical-wrapper">
        <scroll :bounce="true" :nestedScroll="{ groupId: 'myGroup' }">
          <div class="vertical">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
            <div>7</div>
            <div>8</div>
            <div>9</div>
            <div>10</div>
          </div>
        </scroll>
      </div>
      <h1>6</h1>
      <h1>7</h1>
      <h1>8</h1>
      <h1>9</h1>
      <h1>10</h1>
      <div class="horizontal-wrapper">
        <scroll :bounce="true" :scrollX="true" :scrollY="false">
          <div class="horizontal">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
            <div>7</div>
            <div>8</div>
            <div>9</div>
            <div>10</div>
          </div>
        </scroll>
      </div>
      <h1>11</h1>
      <h1>12</h1>
      <h1>13</h1>
      <h1>14</h1>
      <h1>15</h1>
    </div>
  </scroll>
</template>
<script>
import Scroll from '@/components/base/scroll'
export default {
  name: 'ScrollNested',
  components: {
    Scroll
  }
}
</script>
```

### 四、刷新滚动条示例
滚动条组件嵌套多层时，当需要刷新滚动条时，可以通过全局EventBus刷新滚动条。
#### 1. 相关属性
##### 1) eventId
事件ID
#### 2. 执行方式
* 通过全局的EventBus发布重新初始化滚动条事件，事件名称为‘refresh-scroll-’ + eventId

```
<scroll eventId="myScroll">
    ...
</scroll>
```
```
// 其他组件触发滚动条刷新
this.$eventBus.$emit('refresh-scroll-myScroll')
```

### 五、重新初始化滚动条示例
滚动条组件嵌套多层时，当个别滚动条参数改变后需要重新初始化滚动条时，可以通过全局EventBus重新初始化滚动条。
#### 1. 相关属性
##### 1) eventId
事件ID
#### 2. 执行方式
* 通过全局的EventBus发布重新初始化滚动条事件，事件名称为‘init-scroll-’ + eventId
* 事件参数为布尔类型：如果为true, 表示重新初始化时保持滚动条的位置

```
<scroll eventId="myScroll">
    ...
</scroll>
```
```
// 其他组件触发滚动条重新初始化，并保持滚动条位置不变
this.$eventBus.$emit('init-scroll-myScroll', true)
```

