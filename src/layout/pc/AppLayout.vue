<template>
  <div ref="layout" class="layout" :class="{'full-screen': fullScreen, 'fold-menu': foldMenu, 'show-tabs': showTabs, 'show-tab-popup': showTabPopup}">
    <AppHeader :foldMenu="foldMenu" :fullScreen="fullScreen" />
    <!-- <div class="main">
      <AppMenu :foldMenu="foldMenu" :fullScreen="fullScreen" />
      <component v-bind:is="containerComponent">
        <ScrollToTop></ScrollToTop>
        <div v-show="isShowLoading" class="loading">
          <div>
            <BaseSpinner spinner="spiral" theme="white" size="l"></BaseSpinner>
            <div v-if="loadingMessage" class="msg">{{loadingMessage}}</div>
          </div>
        </div>
      </component>
    </div> -->
  </div>
</template>
<script>
import BaseSpinner from '@/components/base/spinner'
import AppHeader from './AppHeader.vue'
import AppMenu from './AppMenu.vue'
import AppTabsView from './AppTabsView.vue'
import AppView from './AppView.vue'
import ScrollToTop from './ScrollToTop.vue'
import { mapGetters, mapMutations } from 'vuex'
import { SET_CUR_FULL_SCREEN, SET_CUR_FOLD_MENU } from '@/store/mutation-types.js'
import { QUERY_USER_INFO } from '@/store/action-types.js'

/* eslint-disable no-undef */
const isShowTabs = APP_SHOW_TABS // 是否显示功能切换tab页签

export default {
  name: 'AppLayout',
  components: {
    AppHeader,
    AppMenu,
    ScrollToTop,
    BaseSpinner
  },
  data () {
    return {
      // 是否显示加加载中蒙层
      isShowLoading: false,
      // 加载信息
      loadingMessage: '',
      // 是否显示功能切换tab页签
      showTabs: isShowTabs,
      // 是否显示了紧覆盖页签功能区域的弹出窗口
      showTabPopup: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo', // 用户信息
      'fullScreen', // 是否将tabs标签面板全屏(含页签和功能展示区域)
      'foldMenu' // 是否将菜单折叠（菜单栏变窄）
    ]),
    // 根据 showTabs 配置获取主要内容容器组件
    containerComponent () {
      return this.showTabs ? AppTabsView : AppView
    }
  },
  created () {
    // 下面注释勿动，当需要创建前获取用户信息时，会自动注释掉该段代码
    /* [auto multi-line command START {getUserInfoBeforeCreate=true}] */
    // this.$store.dispatch(QUERY_USER_INFO, { vm: this }).then((userInfo) => {
    //   // 获取用户信息成功后，触发全局 ready 事件：USER_INFO_READY
    //   this.$eventBus.$emitReady('USER_INFO_READY', userInfo)
    // })
    /* [auto multi-line command END {getUserInfoBeforeCreate=true}] */
    this.$eventBus.$on('show-loading', (msg) => {
      this.loadingMessage = msg
      this.isShowLoading = true
    })
    this.$eventBus.$on('hide-loading', () => {
      this.isShowLoading = false
    })
    this.$eventBus.$on('full-screen', (isFullScreen) => {
      this[SET_CUR_FULL_SCREEN](isFullScreen)
    })
    this.$eventBus.$on('fold-menu', (isFoldMenu) => {
      this[SET_CUR_FOLD_MENU](isFoldMenu)
    })
    // 当显示或关闭只遮罩主功能区域的弹窗时，控制横向滚动条
    this.$eventBus.$on('TAB_POPUP', () => {
      // 为避免横向滚动导致弹窗遮罩层无法覆盖主功能区域，禁用横向滚动，滚动条位置设置为0
      this.showTabPopup = window.document.getElementsByClassName('cover-tab').length > 0
      if (this.showTabPopup) {
        this.$refs.layout.scrollLeft = 0
      }
    })
  },
  beforeDestroy () {
    this.$eventBus.$off('show-loading')
    this.$eventBus.$off('hide-loading')
    this.$eventBus.$off('full-screen')
    this.$eventBus.$off('fold-menu')
    this.$eventBus.$off('TAB_POPUP')
  },
  methods: {
    ...mapMutations([SET_CUR_FULL_SCREEN, SET_CUR_FOLD_MENU])
  }
}
</script>
<style lang="scss" scoped px2rem="false">
.layout {
  min-height: 100vh;
  position: relative;
  overflow-x: auto;
  background: url("../../assets/img/backgroud.png") no-repeat center;
  background-size: cover;
  &.show-tab-popup {
    overflow: hidden; /* 当显示tab页签时不出现横向滚动条，为避免tab页内弹窗随滚动条滚动 */
  }
  .main {
    min-width: $app-min-width;
    position: absolute;
    left: 0;
    top: $app-header-height;
    right: 0;
    bottom: 0;
    background-color: $bg-color-base;
    transition: top .2s ease;
    transition-delay: .1s;
  }
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, .65);
    text-align: center;
    z-index: 2000;
    .msg {
      margin-top: 10px;
      color: $color-text-placeholder;
      font-size: 16px;
    }
  }
}
.fold-menu {
  .main {
    .container {
      left: 50px;
    }
  }
}
.full-screen {
  .main {
    top: 0;
    .container {
      left: 0;
    }
  }
}
</style>
