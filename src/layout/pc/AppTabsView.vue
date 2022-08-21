<template>
  <div class="container tabs-view-container">
    <div class="tabs-bar">
      <div class="tabs">
        <Scroll ref="scroll" :scrollY="false" scrollX :bounce="true" :scrollbar="false">
          <div class="tabs-wrapper" ref="tabsWrapper">
            <router-link
              v-for="tab in tabs"
              :key="tab.key"
              :ref="tab.key"
              :data-key="tab.key"
              :to="{ path: tab.fullPath, params: tab.params, query: tab.params }"
              :exact = "true"
              tag="span"
              class="tabs-item"
            >
              {{ tab.title }}
              <span v-if="!tab.fixed" class="tabs-item-close" @click.prevent.stop="closeTab(tab)">
              <BaseIcon name="close"></BaseIcon>
            </span>
            </router-link>
          </div>
        </Scroll>
      </div>
      <div class="full-screen" @click="switchFullScreen">
        <BaseIcon v-if="!this.isFullScreen" name="screen-expand"></BaseIcon>
        <BaseIcon v-else name="screen-contract"></BaseIcon>
      </div>
    </div>

    <div id="tabsViewContent" class="tabs-view-content">
      <keep-alive :include="cacheComponentNames" :exclude="excludeComponentNames">
        <router-view></router-view>
      </keep-alive>
    </div>
    <slot></slot>
  </div>
</template>
<script>
import Scroll from '@/components/base/scroll'
import menus from '@/assets/js/menus.js'

const menuList = [] // 所有菜单数组（不包含父菜单）
function appendMenu (menu) {
  if (menu.children && menu.children.length > 0) {
    menu.children.forEach((item) => {
      appendMenu(item)
    })
  } else {
    menuList.push(menu)
  }
}
menus.forEach((item) => {
  appendMenu(item)
})

export default {
  name: 'AppTabsView',
  components: {
    Scroll
  },
  data () {
    return {
      // tab页签列表
      tabs: [],
      // keep-alive 需要缓存的组件名称列表
      cacheComponentNames: [],
      // keep-alive 不缓存的组件名称列表，只在关闭页签时临时添加，待清除缓存后从列表中移除，再次打开后就又能缓存
      excludeComponentNames: [],
      // 是否全屏
      isFullScreen: false
    }
  },
  computed: {
    // 页签主键数组
    tabKeys () {
      let keys = this.tabs.map((item) => item.key)
      return keys
    }
  },
  mounted () {
    this.initTabs()
    /* // 调试代码
    var children = this._vnode.children
    for (var i = 0; i < children.length; i++) {
      var curNode = children[i]
      if (curNode.elm.className.indexOf('tabs-view-content') > -1) {
        if (curNode.children && curNode.children.length > 0) {
          let keepAliveNode = curNode.children[0]
          if (keepAliveNode.componentInstance.cache) {
            console.log('打印 keep-alive 信息', keepAliveNode.componentInstance)
          }
        }
        break
      }
    } */
  },
  watch: {
    // 当路由改变时的处理
    $route (to) {
      this.appendTab(to) // 添加页签
      this.appendKeepAliveCache(to) // 添加到 keep-alive 缓存
      setTimeout(() => {
        this.scrollToCurTab() // 滚动到当前页签
      }, 100)
    }
  },
  methods: {
    // 初始化页签
    initTabs () {
      for (let i = 0; i < menuList.length; i++) {
        let menu = menuList[i]
        if (menu.name === '首页') {
          this.tabs.push({
            key: menu.url,
            menuId: menu.id,
            title: menu.name,
            exact: menu.exact,
            cache: menu.cache !== false,
            fullPath: menu.url,
            path: menu.url,
            params: null,
            query: null,
            fixed: true
          })
          break
        }
      }

      this.appendTab(this.$route)
      this.appendKeepAliveCache(this.$route)
    },
    // 将当前路由的组件添加到 keep-alive 的缓存中
    appendKeepAliveCache (route) {
      let menu = this.getMenu(route)
      if (menu) {
        let componentName = this.getComponentName(route.path)
        if ((menu.cache !== false) && componentName &&
          this.cacheComponentNames.indexOf(componentName) === -1) {
          this.cacheComponentNames.push(componentName)
        }
      }
    },
    // 获取路由对应的组件名称(加载过的路由才能获取到)
    getComponentName (path) {
      let matchedList = this.$router.getMatchedComponents(path)
      if (matchedList.length > 0) {
        let component = matchedList[matchedList.length - 1]
        if (component.name) {
          return component.name
        }
      }
      console.warn(`路由[${path}],未获取到对应的组件名称`)
      return ''
    },
    // 添加页签
    appendTab (route) {
      let menu = this.getMenu(route)
      if (menu) {
        let key = menu.cache !== false ? route.path : route.fullPath
        let tabIndex = this.tabKeys.indexOf(key)
        if (tabIndex === -1) {
          let tab = {
            key: menu.cache !== false ? route.path : route.fullPath, // 唯一主键
            menuId: menu.id, // 菜单ID
            title: route.meta.extendName ? route.meta.extendName : menu.name, // 页签标题
            exact: menu.exact, // 是否精确匹配路由
            cache: menu.cache !== false, // 是否对应的页面组件内容
            fullPath: route.fullPath, // 路由全路径
            path: route.path, // 路由路径
            params: route.params, // 路由参数
            query: route.query, // 查询参数
            componentName: this.getComponentName(route.path) // 对应组件名称
          }
          this.tabs.push(tab)
          return tab
        } else {
          this.tabs[tabIndex].fullPath = route.fullPath
        }
      }
    },
    // 获取菜单信息
    getMenu (route) {
      // 精确匹配
      for (let i = 0; i < menuList.length; i++) {
        let menu = menuList[i]
        let routeMenuId = route.meta.menuId
        if (routeMenuId && routeMenuId === menu.id) {
          return menu
        }
        if (route.fullPath === menu.url) {
          return menu
        }
      }
      // 如果未精确匹配成功，则匹配path
      for (let i = 0; i < menuList.length; i++) {
        let menu = menuList[i]
        if (this.$router.match(menu.url).path === route.path) {
          return menu
        }
      }
    },
    // 关闭页签
    closeTab (tab) {
      let idx = this.tabs.indexOf(tab)
      let nextTab = idx === (this.tabs.length - 1) ? this.tabs[idx - 1] : this.tabs[idx + 1]
      this.tabs.splice(idx, 1)
      if (this.$route.fullPath === tab.fullPath) {
        this.$router.push({ path: nextTab.fullPath, params: nextTab.params, query: nextTab.query })
      }
      // 将对应组件名称添加到不缓存的列表
      this.excludeComponentNames.push(tab.componentName)
      setTimeout(() => {
        // 等组件缓存自动清除后，从不缓存的列表中移除，方便下次打开时再缓存
        let idx = this.excludeComponentNames.indexOf(tab.componentName)
        this.excludeComponentNames.splice(idx, 1)
      }, 500)
    },
    // 滚动到当前页签
    scrollToCurTab () {
      let curKey = this.$route.fullPath
      if (this.tabKeys.indexOf(curKey) > -1) {
        let tabRef = this.$refs[curKey]
        let curTabElement = tabRef instanceof Array ? (tabRef.length > 0 ? tabRef[0].$el : null) : tabRef.$el
        if (curTabElement instanceof HTMLElement) {
          this.$refs.scroll.bs.scrollToElement(curTabElement, 300, true)
        }
      }
    },
    // 切换全屏
    switchFullScreen () {
      this.$eventBus.$emit('full-screen', !this.isFullScreen)
      this.isFullScreen = !this.isFullScreen
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 500)
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
$tabs-height: $app-tabs-height - 1px;
$tab-item-height: 26px;
.tabs-view-container{
  position: absolute;
  left: $app-menu-width;
  top: 0;
  right: 0;
  bottom: 0;
  transition: left .2s ease;
  transition-delay: .1s;
  .tabs-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    box-sizing: content-box;
    height: $tabs-height;
    border-top: solid 1px $border-color-light;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    background-color: #FFF;
    z-index: 1;
    .tabs {
      position: absolute;
      top: 0;
      left: 0;
      right: $tabs-height;
      height: $tabs-height;
      background-color: #FFF;
      white-space: nowrap;
      word-break: keep-all;
      .tabs-wrapper {
        height: $tabs-height;
        .tabs-item {
          display: inline-block;
          position: relative;
          margin-left: 5px;
          margin-top: $tabs-height - $tab-item-height;
          padding: 0 8px;
          height: $tab-item-height;
          line-height: $tab-item-height;
          border: 1px solid #d8dce5;
          border-bottom: 0;
          border-radius: 3px 3px 0 0;
          color: #495060;
          background: $bg-color-base;
          font-size: 12px;
          user-select:none;
          &:first-of-type {
            margin-left: 15px;
          }
          &:last-of-type {
            margin-right: 0;
          }
          &.active {
            background-color: #FFF;
            color: $color-primary;
            .tabs-item-close {
              color: $color-text-secondary;
            }
          }

          .tabs-item-close {
            display: inline-block;
            margin-right: -4px;
            width: 16px;
            height: 16px;
            line-height: 16px;
            border-radius: 50%;
            font-size: 8px;
            text-align: center;
            vertical-align: 3%;
            color: $color-text-secondary;
            &:hover {
              background-color: rgba(0, 0, 0, .08);
            }
          }
        }
      }
    }
    .full-screen {
      position: absolute;
      top: 0;
      right: 0;
      width: $tabs-height;
      height: $tabs-height;
      line-height: $tabs-height;
      text-align: center;
      cursor: pointer;
      color: $color-text-secondary;
    }
  }

  .tabs-view-content {
    position: absolute;
    top: $tabs-height;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-y: auto;
  }
}
</style>

<style lang="scss">
/* 覆盖 header 的阴影样式 */
.layout .app-header {
  box-shadow: none;
}
</style>
