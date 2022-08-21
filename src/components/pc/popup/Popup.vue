<!-- 弹出窗口组件 -->
<template>
  <div class="popup" :class="{'full-screen': fullScreen, 'fold-menu': foldMenu, 'show-tabs': isShowTabs,
                              'cover-full': cover==='full', 'cover-tab': cover==='tab'}">
    <transition name="mask">
      <div ref="popupMask" class="popup-mask" v-show="visible"></div>
    </transition>
    <transition name="pop">
      <div class="popup-box" v-show="visible" :class="className" :style="popupStyle" ref="popBox">
        <div class="close" v-show="showClose" @click="doClose"><BaseIcon name="close" class="close-icon"></BaseIcon></div>
        <div class="popup-pane" :class="noHeader? 'no-header' : ''">
          <div class="title" v-show="title">{{title}}</div>
          <div ref="contentWrap" class="content-wrap" :style="{overflow: needScroll ? 'auto' : 'hidden', ...contentWrapperStyle}">
            <slot>
              <div v-if="message" :class="needScroll ? 'scroll-message' : 'center-message'">{{message}}</div>
              <div v-else-if="html" class="html-message" v-html="html"></div>
              <component v-else-if="content" :is="content" v-bind="contentProps" v-on="contentEvents"></component>
            </slot>
          </div>
          <div class="bottom">
            <slot name="bottom"></slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
/* eslint-disable no-undef */
const isShowTabs = APP_SHOW_TABS // 是否显示功能切换tab页签

export default {
  name: 'PopupPC',
  props: {
    // 是否显示弹框
    value: {
      type: Boolean,
      default: false
    },
    // 标题
    title: String,
    // 是否显示关闭按钮
    showClose: {
      type: Boolean,
      default: true
    },
    // 信息内容
    message: String,
    // html字符串内容
    html: String,
    // 弹窗内容组件
    content: Object,
    // 弹窗内容组件的props
    contentProps: Object,
    // 弹窗内容组件的事件
    contentEvents: Object,
    // 内容包裹器样式
    contentWrapperStyle: Object,
    // 弹框宽度
    width: {
      type: Number,
      default: 300
    },
    // 弹框高度
    height: {
      type: Number,
      default: 220
    },
    // 样式名
    className: {
      type: String,
      default: ''
    },
    // 内容区域是否需要滚动条
    scroll: {
      type: Boolean,
      default: false
    },
    // 遮罩层覆盖范围(full: 覆盖整个页面， tab: 覆盖当前tab页功能区域)
    cover: {
      type: String,
      default: 'full'
    }
  },
  data () {
    return {
      // 是否显示
      visible: this.value,
      // 内容是否溢出
      contentOverflow: false,
      // 弹窗宽度
      boxWidth: this.width,
      // 弹窗高度
      boxHeight: this.height,
      // 是否显示功能切换tab页签
      isShowTabs: isShowTabs,
      // scrollEventId: 'popup' + new Date().getTime()
      // 定时器ID
      timeoutId: null
    }
  },
  computed: {
    // 是否不显示头部（标题和关闭按钮）
    noHeader () {
      return !this.title && !this.showClose
    },
    // 计算弹框宽高位置相关样式
    popupStyle () {
      let styleObj = {}
      let boxWidth = this.boxWidth
      let boxHeight = this.boxHeight
      styleObj.width = boxWidth + 'px'
      styleObj.height = boxHeight + 'px'
      styleObj.marginLeft = `-${boxWidth / 2}px`
      styleObj.marginTop = `-${boxHeight / 2}px`
      if (boxWidth < 150) {
        styleObj.opacity = '0'
      } else {
        styleObj.opacity = '1'
      }
      return styleObj
    },
    // 是否需要显示滚动条
    needScroll () {
      return this.scroll || this.contentOverflow
    },
    fullScreen () {
      if (this.$store && this.$store.getters && this.$store.getters.fullScreen) {
        return true
      }
      return false
    },
    foldMenu () {
      if (this.$store && this.$store.getters && this.$store.getters.foldMenu) {
        return true
      }
      return false
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      if (val && !this.scroll) {
        setTimeout(() => {
          const contentWrap = this.$refs.contentWrap
          const content = this.$refs.contentWrap.firstChild
          const contentWrapHeight = contentWrap.getBoundingClientRect().height
          const contentHeight = content.getBoundingClientRect().height
          console.log('弹窗内容包裹元素高度=', contentWrapHeight, ',弹窗内容元素高度=', contentHeight)
          if (contentHeight > contentWrapHeight) {
            this.contentOverflow = true
          }
        }, 100)
      }
      /* if (val && this.scroll) {
        this.$nextTick(() => {
          this.$eventBus.$emit('init-scroll-' + this.scrollEventId)
        })
      } */
    },
    cover (val) {
      if (val === 'tab') {
        // 弹出只遮罩页签功能区域的弹窗时，触发事件控制横向滚动条
        setTimeout(() => {
          this.$eventBus.$emit('TAB_POPUP')
        }, 10)
      }
    },
    width (val) {
      this.initSize()
    },
    height (val) {
      this.initSize()
    },
    fullScreen (val) {
      if (this.cover === 'tab') {
        setTimeout(() => {
          this.initSize()
        }, 300)
      }
    },
    foldMenu (val) {
      if (this.cover === 'tab') {
        setTimeout(() => {
          this.initSize()
        }, 300)
      }
    }
  },
  mounted () {
    // 初始化弹窗大小，设置弹窗大小不超过浏览器窗口大小
    setTimeout(() => {
      this.initSize()
    }, 50)
    window.addEventListener('resize', this.initSize)
    // 当用户登录失效时由于要跳转到登录页，关闭弹出窗口
    this.$eventBus.$on('NO_AUTH_EVENT', this.doClose)
  },
  beforeDestroy () {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
    window.removeEventListener('resize', this.initSize)
    this.$eventBus.$off('NO_AUTH_EVENT', this.doClose)
    // 关闭弹出窗口时，如果是只遮罩页签功能区域的弹窗，触发事件控制横向滚动条
    if (this.cover === 'tab') {
      this.$eventBus.$emit('TAB_POPUP')
    }
  },
  methods: {
    // 初始化弹窗大小，设置弹窗大小不超过浏览器窗口大小
    initSize () {
      let maxWidth = window.innerWidth
      let maxHeight = window.innerHeight

      let coverElement = document.getElementById('tabsViewContent')
      if (!coverElement) {
        coverElement = document.getElementById('viewContent')
      }
      if (this.cover === 'tab' && coverElement) {
        if (coverElement.clientWidth < maxWidth) {
          maxWidth = coverElement.clientWidth
        }
        if (coverElement.clientHeight < maxHeight) {
          maxHeight = coverElement.clientHeight
        }

        let offsetLeft = coverElement.getBoundingClientRect().left
        let winWidth = window.innerWidth
        let mainViewWidth = winWidth - offsetLeft
        if (mainViewWidth < maxWidth) {
          maxWidth = mainViewWidth
        }
      }

      if (maxWidth && (maxWidth - 10) < this.width) {
        this.boxWidth = maxWidth - 10
      } else {
        this.boxWidth = this.width
      }
      if (maxHeight && (maxHeight - 10) < this.height) {
        this.boxHeight = maxHeight - 10
      } else {
        this.boxHeight = this.height
      }
    },
    doClose () {
      this.visible = false
      this.$emit('input', this.visible)
      this.$emit('close')
    },
    close (timeout) {
      if (typeof timeout === 'number' && timeout > 0) {
        this.timeoutId = setTimeout(() => {
          this.doClose()
        }, timeout)
      } else {
        this.doClose()
      }
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
$box-border-radius: 3px;
$title-height: 54px;
$close-size: 12px;
$content-tb-padding: 18px;
$content-lr-padding: 24px;
.popup{
  z-index: 1000;
  .popup-mask{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.5);
    transition: all .3s ease;
    z-index: 1000;
  }
  .popup-box{
    position: fixed;
    width: 500px;
    height: 300px;
    top: 50%;
    left: 50%;
    margin-left: -250px;
    margin-top: -150px;
    background-color: #FFF;
    border-radius: $box-border-radius;
    transition: all .2s ease;
    z-index: 1000;
    .close{
      height: $title-height;
      width: $title-height;
      position: absolute;
      top: 0;
      right: 0;
      text-align: center;
      padding-top: ($title-height - $close-size) / 2;
      z-index: 1003;
      .close-icon{
        line-height: 1;
        font-size: $close-size;
        color: #666;
      }
    }
    .popup-pane{
      height: 100%;
      padding: 20px 0;
      .title{
        margin-top: -20px;
        height: $title-height;
        line-height: $title-height;
        border-bottom: solid 1px #E5E5E5;
        font-size: 16px;
        text-align: left;
        padding: 0 ($content-lr-padding * 2 + $close-size) 0 $content-lr-padding;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #666;
        font-weight: bold;
      }
      .content-wrap{
        position: absolute;
        top: $title-height;
        bottom: 0;
        left: 0;
        right: 0;
        .center-message{
          position: absolute;
          width: 100%;
          top: 50%;
          transform: translateY(-50%);
          padding: $content-tb-padding $content-lr-padding;
          box-sizing: border-box;
          font-size: 16px;
          line-height: 1.5;
          text-align: center;
          word-break: break-all;
          white-space: pre-wrap;
        }
        .scroll-message {
          padding: $content-tb-padding $content-lr-padding;
          font-size: 16px;
          line-height: 1.5;
        }
        .html-message {
          font-size: 16px;
          line-height: 1.5;
          ::v-deep .message{
            padding: $content-tb-padding $content-lr-padding;
            text-align: center;
          }
        }
      }
      &.no-header .content-wrap {
        top: 0;
      }
      .scroll{
        overflow-y: auto;
      }
      .bottom{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
      }
    }
  }
  &.cover-tab {
    .popup-mask {
      left: $app-menu-width;
      top: $app-header-height;
      transition: all .2s ease;
      transition-delay: .1s;
    }
    .popup-box {
      transform: translate($app-menu-width / 2, ($app-header-height) / 2);
    }
    &.fold-menu {
      .popup-mask {
        left: $app-menu-fold-width;
      }
      .popup-box {
        transform: translate($app-menu-fold-width / 2, $app-header-height / 2);
      }
    }

    &.show-tabs {
      .popup-mask {
        top: $app-header-height + $app-tabs-height;
      }
      .popup-box {
        transform: translate($app-menu-width / 2, ($app-header-height + $app-tabs-height) / 2);
      }
      &.fold-menu {
        .popup-box {
          transform: translate($app-menu-fold-width / 2, ($app-header-height + $app-tabs-height) / 2);
        }
      }
      &.full-screen {
        .popup-mask {
          left: 0;
          top: $app-tabs-height;
          transition-delay: .1s;
        }
        .popup-box {
          transform: translate(0, $app-tabs-height / 2);
        }
      }
    }
  }
}

.pop-enter-active, .pop-leave{
  transform: scale(1);
  opacity: 1;
}
.pop-enter, .pop-leave-active{
  transform: scale(.5);
  opacity: 0;
}
.mask-leave-active{
  opacity: 0;
}
</style>
