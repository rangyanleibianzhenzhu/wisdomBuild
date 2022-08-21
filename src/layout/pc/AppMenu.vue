<template>
  <aside class="menu" :class="{fold: foldMenu, hidden: fullScreen}">
    <div class="instruct"></div>
<!--    <component v-bind:is="wrapComponent" ref="scroll" :scrollbar="false">-->
    <Scroll ref="scroll" :bounce="false" :scrollbar="false">
      <ul class="menu-list">
        <template v-for="menu in menus">
          <li :key="menu.id"
              class="menu-item"
              :data-id="menu.id">
            <router-link v-if="!menu.children"
                         :to="menu.url"
                         :exact="menu.exact"
                         class="menu-link"
                         :class="{cur: menu.active}"
                         :title="foldMenu ? menu.name : null">
              <span class="menu-icon"><BaseIcon :name="menu.icon" /></span>
              <span class="menu-text">{{menu.name}}</span>
            </router-link>

            <template v-else>
              <div class="parentmenu-title sub1-title" :class="{open: menu.open}"
                   @click="switchOpen(menu)"
                   :data-id="menu.id" :title="foldMenu ? menu.name : null">
                <span class="menu-icon"><BaseIcon :name="menu.icon" /></span>
                <span class="menu-text">{{menu.name}}</span>
<!--                <i class="submenu-arrow"></i>-->
                <span class="group-arrow"><BaseIcon name="next" class="group-arrow-icon" /></span>
              </div>
              <BaseCollapse :value="!(menu.open || foldMenu || fullScreen)">
                <ul class="submenu-list sub1-list">
                  <li v-for="subMenu in menu.children"
                      :key="subMenu.name"
                      class="submenu-item"
                      :data-id="subMenu.id">
                    <router-link v-if="!subMenu.children"
                                 :to="subMenu.url"
                                 class="menu-link"
                                 :class="{cur: subMenu.active}">
                      <span class="menu-text">{{subMenu.name}}</span>
                    </router-link>
                    <template v-else>
                      <div class="parentmenu-title sub2-title" :class="{open: subMenu.open}"
                          @click="switchOpen(subMenu)"
                          :data-id="subMenu.id" :title="subMenu.name">
                        <span class="menu-icon"><BaseIcon :name="subMenu.icon" /></span>
                        <span class="menu-text">{{subMenu.name}}</span>
<!--                        <i class="submenu-arrow sub2Menu-arrow"></i>-->
                        <span class="group-arrow"><BaseIcon name="next" class="group-arrow-icon" /></span>
                      </div>
                      <BaseCollapse :value="!(subMenu.open || foldMenu || fullScreen)">
                        <ul class="submenu-list sub2-list">
                          <li v-for="sub2Menu in subMenu.children"
                              :key="sub2Menu.name"
                              class="submenu-item"
                              :data-id="sub2Menu.id">
                            <router-link  :to="sub2Menu.url"
                                          class="menu-link"
                                          :class="{cur: sub2Menu.active}">
                              <span class="menu-text">{{sub2Menu.name}}</span>
                            </router-link>
                          </li>
                        </ul>
                      </BaseCollapse>
                    </template>
                  </li>
                </ul>
              </BaseCollapse>
            </template>
          </li>
        </template>
      </ul>
<!--    </component>-->
    </Scroll>
  </aside>
</template>
<script>
import BaseCollapse from '@/components/base/collapse/index.vue'
import Scroll from '@/components/base/scroll'
import menuList from '@/assets/js/menus.js'
import { SET_CUR_MENU_ID } from '@/store/mutation-types'

export default {
  name: 'AppMenu',
  components: {
    BaseCollapse,
    Scroll
  },
  props: {
    // 是否折叠菜单
    foldMenu: Boolean,
    // 是否全屏
    fullScreen: Boolean
  },
  data () {
    return {
      // 菜单信息
      menus: []
    }
  },
  computed: {
    /* wrapComponent () {
      // 动态变更组件时，生产包显示异常，改为一直使用滚动条组件
      return this.foldMenu ? { template: '<div><slot></slot></div>' } : Scroll
    } */
  },
  created () {
    this.initMenu()
    // 当路由切换时重新设置当前菜单
    this.$eventBus.$on('ROUTER_CHANGE', (to, from) => {
      this.resetActive()
    })
  },
  methods: {
    // 初始化菜单
    initMenu (data) {
      let menus = (data || menuList) || []
      let menuMap = {}
      if (menus && menus.length > 0) {
        menus.forEach((menu) => {
          menu.open = false
          if (menu.children && menu.children.length > 0) {
            menu.children.forEach((subMenu) => {
              let active = this.isCurMenu(subMenu)
              subMenu.active = active
              if (active) {
                menu.open = true
              }
              subMenu.parentId = menu.id
              menuMap[subMenu.id] = subMenu

              if(subMenu.children && subMenu.children.length > 0){
                this.initMenu(menu.children)
              }
            })
          } else {
            let active = this.isCurMenu(menu)
            menu.active = active
          }
          menuMap[menu.id] = menu
        })
      }
      this.menus = menus
      this.menuMap = Object.assign({}, this.menuMap, menuMap)
    },
    // 是否当前菜单
    isCurMenu (menu) {
      let isCur = false
      let curMenuId = this.$route.meta.menuId
      if (curMenuId) { // 如果路由中指定的 menuId 与 当前菜单的id 一致则认为是当前菜单
        isCur = menu.id === curMenuId
      } else if (menu.url) { // 如果菜单的url与当前路由匹配，则认为是当前菜单
        // 菜单地址路径
        let menuPath = this.$router.match(menu.url).path
        if (/.+\/$/.test(menuPath)) {
          menuPath = menuPath.replace(/\/$/, '')
        }
        // 当前路由路径
        let routerPath = this.$route.path
        if (/.+\/$/.test(routerPath)) {
          routerPath = routerPath.replace(/\/$/, '')
        }

        isCur = menuPath === routerPath
      }
      if (isCur) {
        this.$store.commit(SET_CUR_MENU_ID, menu.id) // 设置当前菜单ID
      }
      return isCur
    },
    // 重置当前菜单
    resetActive () {
      let menuIds = Object.keys(this.menuMap)
      let menu
      menuIds.forEach((menuId) => {
        menu = this.menuMap[menuId]
        if (menu) {
          if (this.isCurMenu(menu)) {
            menu.active = true
          } else {
            menu.active = false
          }
        }
      })
    },
    // 父菜单展开收起转换
    switchOpen (menu) {
      menu.open = !menu.open
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
/* 全屏时左侧隐藏菜单的宽度 */
$app-menu-full-width: 30px;
$menu-font-color: #a6adb4;
$submenu-bg: #000c17;
$submenu-font-color: #8e97a0;
.menu {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: $app-menu-width;
  background-color: $menu-bg;
  box-shadow: 2px 0 6px rgba(0,21,41,.35);
  overflow: hidden;
  z-index: 8;
  transition: width .2s ease;
  transition-delay: .1s;
  .instruct{
    display: none;
    position: absolute;
    top: 29px;
    bottom: 0;
    left: 0px;
    width: 10px;
    border-left: none;
    background-color: #D9D9D9;
    &:before, &:after {
      content: "";
      position: absolute;
      left: 3px;
      top: 50%;
      vertical-align: baseline;
      background: #999;
      width: 6px;
      height: 1.5px;
      border-radius: 2px;
      transition: background .3s cubic-bezier(.645, .045, .355, 1), transform .3s cubic-bezier(.645, .045, .355, 1), top .3s cubic-bezier(.645, .045, .355, 1);
    }

    &:before {
      transform: rotate(-315deg) translateY(2px);
    }
    &:after {
      transform: rotate(135deg) translateY(2px);
    }
  }
  .menu-list {
    padding-top: 20px;
    padding-bottom: 80px;
    .menu-item {
      margin: 4px 0;
      transition: .1s ease-out;
      transition-delay: .2s;
      .menu-link, .parentmenu-title {
        display: block;
        height: 40px;
        line-height: 40px;
        text-align: left;
        color: $menu-font-color;
        transition: .1s ease;
        transition-delay: .1s;
        white-space: nowrap;
        &.cur {
          @include primary-background-color();
          color: #FFF;
        }
        .menu-icon {
          display: inline-block;
          margin-left: 20px;
          width: 1em;
          .fa-icon {
            vertical-align: -5%;
          }
        }
        .menu-text {
          margin-left: 10px;
          opacity: 1;
          transition: opacity .1s ease-out;
          transition-delay: .2s;
        }
      }
      .parentmenu-title {
        position: relative;
        cursor: pointer;
        .group-arrow {
          position: absolute;
          top: 50%;
          right: 16px;
          transform: translateY(-45%);
          font-size: 20px;
          line-height: 1;
          .group-arrow-icon {
            transition: .3s ease;
            transition-delay: .1s;
          }
        }
        &.open {
          .group-arrow .group-arrow-icon{
            transform-origin: 50%;
            transform: rotate(90deg);
          }

        }
      }

      .submenu-list {
        padding: 5px 0;
        list-style: none;
        background-color: $submenu-bg;
        .submenu-item {
          .menu-link {
            padding-left: 32px;
            color: $submenu-font-color;
            &.cur {
              @include primary-background-color();
              color: #FFF;
            }
          }
        }
        &.sub2-list {
          .submenu-item {
            .menu-link {
              padding-left: 48px;
            }
          }
        }
      }
    }
  }

  &.fold, &.hidden {
    width: $app-menu-fold-width;
    overflow: visible;
    .scroll-wrapper {
      overflow: visible;
    }
    .menu-list .menu-item {
      position: relative;
      text-align: center;
      overflow: hidden;
      .fa-icon {
        margin-left: 0;
      }
      >.menu-link, .parentmenu-title {
        padding: 0;
        text-align: center;
        .menu-icon {
          margin-left: 0;
        }
        .menu-text {
          display: inline-block;
          margin-left: 0;
          opacity: 0;
          width: 0;
          transition: none;
        }
        .submenu-arrow {
          opacity: 0;
          transition: none;
        }
      }
      .sub2-title{
        text-align: initial;
        .menu-icon {
          opacity: 0;
        }
        .menu-text {
          display: inline-block;
          margin-left: 5px;
          opacity: 1;
          width: auto;
          color: $submenu-font-color;
          transition: opacity .1s ease-out;
          transition-delay: .2s;
        }
        .sub2Menu-arrow {
          opacity: 1;
          transition: .1s ease;
          transition-delay: .3s;
          &:before {
            transform: rotate(-135deg) translateY(2px);
          }
          &:after {
            transform: rotate(315deg) translateY(2px);
          }
        }
      }

      ::v-deep .collapse-wrap {
        display: none;
        position: absolute;
        top: 0;
        left: $app-menu-fold-width;
        width: $app-menu-width;
        padding-left: 5px;
        .submenu-list {
          border-radius: 5px;
          .menu-link {
            padding-left: 10px;
          }
        }
      }
      &:hover {
        overflow: visible;
        .parentmenu-title {
          @include primary-font-color();
        }
        ::v-deep >.collapse-wrap {
          display: block;
        }
      }
    }
    .submenu-list .submenu-item{
      ::v-deep .collapse-wrap {
        display: none;
        position: absolute;
        top: 0;
        left: $app-menu-width;
        width: $app-menu-width;
        padding-left: 5px;
        .submenu-list {
          border-radius: 5px;
          .menu-link {
            padding-left: 10px;
          }
        }
      }
      &:hover {
        .parentmenu-title {
          @include primary-font-color();
        }
        ::v-deep >.collapse-wrap {
          display: block;
        }
        .sub2Menu-arrow{
          &:before {
            transform: rotate(-315deg) translateY(2px);
          }
          &:after {
            transform: rotate(135deg) translateY(2px);
          }
        }
      }
    }
  }
  &.hidden {
    width: 0;
    .instruct{
      display: block;
    }
    &::before {
      content: "";
      position: absolute;
      top: $app-tabs-height;
      left: 0;
      right: -5px;
      bottom: 0;
      // background-color: #2CD7AA;
    }
    .menu-list {
      margin-left: 0 - $app-menu-full-width;
      margin-top: $app-tabs-height;
      padding: 5px 0;
      width: $app-menu-full-width;
      background-color: $menu-bg;
      transition:  margin-left .2s ease;
      border-radius: 0 5px 5px 0;
      .menu-item {
        .collapse-wrap {
          left: $app-menu-full-width;
        }
        .submenu-list .submenu-item{
          ::v-deep .collapse-wrap {
            left: $app-menu-width;
          }
        }
      }
    }

    &:hover {
      //&::before {
      //  background-color: #761c19;
      //}
      .instruct{
        display: none;
      }
      .menu-list {
        margin-left: -2px;
      }
    }
  }
}
</style>
