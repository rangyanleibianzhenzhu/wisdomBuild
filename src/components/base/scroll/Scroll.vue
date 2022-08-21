<template>
  <div ref="wrapper" class="scroll-wrapper" :style="wrapperStyle" @touchmove="propagationFilter">
    <div class="scroll-content" :style="contentStyle" ref="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import MouseWheel from '@better-scroll/mouse-wheel'
import ScrollBar from '@better-scroll/scroll-bar'
import ObserveDOM from '@better-scroll/observe-dom'
import ObserveImage from '@better-scroll/observe-image'
import NestedScroll from '@better-scroll/nested-scroll'
import PullDown from '@better-scroll/pull-down'
import Pullup from '@better-scroll/pull-up'

BScroll.use(ScrollBar)
BScroll.use(MouseWheel)
BScroll.use(ObserveDOM)
BScroll.use(ObserveImage)
BScroll.use(NestedScroll)
BScroll.use(PullDown)
// BScroll.use(Pullup)

export default {
  name: 'scroll',
  props: {
    // 是否开启横向滚动
    scrollX: {
      type: Boolean,
      default: false
    },
    // 是否开启纵向滚动
    scrollY: {
      type: Boolean,
      default: true
    },
    // 是否显示滚动条
    scrollbar: {
      type: Boolean,
      default: true
    },
    // 是否支持鼠标滚轮
    /* 对象示例：
    {
      speed: 20,
        invert: false,
      easeTime: 300,
      discreteTime: 400,
      throttleTime: 0,
      dampingFactor: 0.1
    }
    */
    mouseWheel: {
      type: [Boolean, Object],
      default: true
    },
    // 是否显示回弹动画
    /* 对象示例：
    {
      top: true,
      bottom: true,
      left: true,
      right: true
    }
    */
    bounce: {
      type: [Boolean, Object],
      default: false
    },
    // 是否多层嵌套滚动条
    /* 对象实例：
    { groupId: 'dummy-divide' }
    */
    nestedScroll: {
      type: [Boolean, Object],
      default: false
    },
    // 是否支持下拉刷新
    pullDownRefresh: {
      type: [Boolean, Object],
      default: false
    },
    // 是否支持上拉加载
    pullUpLoad: {
      type: [Boolean, Object],
      default: false
    },
    /**
     * 【非BetterScroll 配置项】包裹器背景色（上拉、下拉漏出的底色）
     */
    wrapperBgColor: {
      type: String,
      default: 'transparent'
    },
    /**
     * 【非BetterScroll 配置项】内容区域背景色
     */
    contentBgColor: {
      type: String,
      default: 'transparent'
    },
    /**
     * 【非BetterScroll 配置项】重新初始化滚动条事件的ID
     */
    eventId: {
      type: String,
      default: null
    },
    // 【非BetterScroll 配置项】是否拉伸内容区域的第一个子元素（将第一个子元素的min-height设置为包裹区域的高度）
    stretch: {
      type: Boolean,
      default: false
    },
    // 是否开启对 content 以及 content 子元素 DOM 改变的探测
    observeDOM: {
      type: Boolean,
      default: true
    },
    // 开启对 wrapper 子元素中图片元素的加载的探测
    // 【注意】：对于已经用 CSS 确定图片宽高的场景，不应该使用该插件，因为每次调用 refresh 对性能会有影响。只有在图片的宽度或者高度不确定的情况下，你才需要它。
    observeImage: {
      type: Boolean,
      default: false
    },
    /**
     * 1. probeType 为 0，在任何时候都不派发 scroll 事件，
     * 2. probeType 为 1，仅仅当手指按在滚动区域上，每隔 momentumLimitTime 毫秒派发一次 scroll 事件，
     * 3. probeType 为 2，仅仅当手指按在滚动区域上，一直派发 scroll 事件，
     * 4. probeType 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画
     */
    probeType: {
      type: Number,
      default: 0
    },
    /**
     * 保留原生的滚动的方向，可选值：'vertical'、'horizontal'
     */
    eventPassthrough: {
      type: String,
      default: ''
    },
    /**
     * 点击时是否派发click事件
     * BetterScroll 默认会阻止浏览器的原生 click 事件。当设置为 true，BetterScroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true
     */
    click: {
      type: Boolean,
      default: true
    },
    // 是否阻止事件冒泡
    stopPropagation: {
      type: Boolean,
      default: false
    },
    // 回弹动画的动画时长(单位:ms)
    bounceTime: {
      type: Number,
      default: 800
    },
    // 是否使用 CSS3 transition 动画(如果设置为 false，则使用 requestAnimationFrame 做动画)
    useTransition: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      bs: null // BetterScroll 实例对象
    }
  },
  computed: {
    wrapperStyle () {
      return { backgroundColor: this.wrapperBgColor }
    },
    contentStyle () {
      let contentStyle = { backgroundColor: this.contentBgColor }
      if (this.scrollX) {
        contentStyle.display = 'inline-block'
      }
      return contentStyle
    }
  },
  created () {
    if (this.eventId) {
      this.$eventBus.$on('init-scroll-' + this.eventId, holdPosition => {
        this.initScroll(holdPosition)
      })
      this.$eventBus.$on('refresh-scroll-' + this.eventId, holdPosition => {
        this.refresh()
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.stretch) {
        this.stretchContentChild() // 拉伸内容区域的第一个子元素的高度
      }
      this.initScroll()
    })
  },
  beforeDestroy () {
    if (this.eventId) {
      this.$eventBus.$off('init-scroll-' + this.eventId)
      this.$eventBus.$off('refresh-scroll-' + this.eventId)
    }
    if (this.bs) {
      this.bs.destroy()
    }
  },
  methods: {
    /**
     * 初始化滚动条
     * holdPosition 是否保持滚动条的位置，默认为：false, 重新初始化后滚动条在顶部或左侧
     */
    initScroll (holdPosition = false) {
      // console.log('initScroll')
      // 滚动条的起始位置
      let startX = 0
      let startY = 0
      if (this.bs) {
        // 是否需要保持滚动条的位置
        if (holdPosition) {
          startX = this.bs.x
          startY = this.bs.y
        }
        // 销毁原滚动条，并解绑事件
        this.bs.destroy()
      }

      let options = {
        startX,
        startY,
        scrollX: this.scrollX, // 是否开启橫向滚动
        scrollY: this.scrollY, // 是否开启纵向滚动
        bounce: this.bounce, // 是否显示回弹动画
        probeType: this.probeType, // 何时派发 scroll 事件
        click: this.click, // 是否阻止浏览器的原生 click 事件
        stopPropagation: this.stopPropagation, // 是否阻止事件冒泡
        eventPassthrough: this.eventPassthrough // 保留某个方向的原生滚动
      }
      // bug: 插件类的选项，值为false时插件依然生效。改为值为true时才增加配置项
      // 是否显示滚动条
      if (this.scrollbar) {
        options.scrollbar = this.scrollbar
      }
      // 是否支持鼠标滚轮
      if (this.mouseWheel) {
        options.mouseWheel = (this.mouseWheel === true) ? { speed: 20, invert: false, easeTime: 300 } : this.mouseWheel
      }
      // 是否开启 DOM 改变的探测
      if (this.observeDOM) {
        options.observeDOM = this.observeDOM
      }
      // 是否开启图片加载的探测
      if (this.observeImage) {
        options.observeImage = this.observeImage
      }
      // 是否嵌套滚动条
      if (this.nestedScroll) {
        options.nestedScroll = this.nestedScroll
      }
      // 是否支持下拉刷新
      if (this.pullDownRefresh) {
        options.pullDownRefresh = this.pullDownRefresh
      }
      // 是否支持上拉加载
      if (this.pullUpLoad) {
        options.pullUpLoad = this.pullUpLoad
      }

      console.log('滚动条初始化配置：', options)
      // 重新创建BetterScroll
      const bs = new BScroll(this.$refs.wrapper, options)
      this.bs = bs
      this.$emit('created', bs)
      this.bs.hooks.on('refresh', () => { console.log('滚动条刷新 ' + new Date()) })
    },
    disable () {
      this.bs && this.bs.disable()
    },
    enable () {
      this.bs && this.bs.enable()
    },
    refresh () {
      this.bs && this.bs.refresh()
    },
    // 拉伸内容区域（内容区域的子元素的最小高度设为包裹区域的高度）
    stretchContentChild () {
      let wrapperHeight = this.$refs.wrapper.getBoundingClientRect().height
      let children = this.$refs.content.children
      if (wrapperHeight && children && children.length === 1) {
        let child = children[0]
        child.style.minHeight = wrapperHeight + 'px'
      }
    },
    // 事件冒泡过滤
    propagationFilter (e) {
      if (e.target && e.target.tagName === 'TEXTAREA') { // textarea 阻止冒泡
        e.stopPropagation()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.scroll-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
.scroll-content {
  min-height: 100%;
  &:before {
    content: '';
    display: table;
  }
  &:after {
    content: '';
    display: table;
    clear: both;
  }
}
.pulldown-wrapper {
  position: absolute;
  width: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all;
}
.pullup-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
}
.pulldown {
  position: absolute;
  top: 0;
  left: 0;
}
.pulldown-enter-active {
  transition: all 0.2s;
}
.pulldown-enter, .pulldown-leave-active {
  transform: translateY(-100%);
  transition: all 0.2s;
}
.tip-msg {
  position: absolute;
  width: 100%;
  text-align: center;
}
::v-deep .bscroll-vertical-scrollbar{
  width: 10px !important;
}
::v-deep .bscroll-horizontal-scrollbar {
  height: 10px !important;
}
</style>
