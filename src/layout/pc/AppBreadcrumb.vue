<template>
  <div class="breadcrumb">
    <span class="item">
      <span class="home-icon"><BaseIcon name="home"></BaseIcon></span>
    </span>
    <span class="item" v-for="(item, index) in menuNameList" :key="index">
      <span class="arrow"></span>
      <span class="text">{{item}}</span>
    </span>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import menus from '@/assets/js/menus.js'

const menuChainMap = {}
function appendMenuChain (menu, menuChain = []) {
  if (menu.children && menu.children.length > 0) {
    menu.children.forEach((item) => {
      appendMenuChain(item, [...menuChain, menu])
    })
  } else {
    menuChainMap[menu.id] = [...menuChain, menu]
  }
}
menus.forEach((item) => {
  appendMenuChain(item)
})

export default {
  name: 'AppBreadcrumb',
  computed: {
    ...mapGetters(['curMenuId']),
    menuNameList () {
      const nameList = []
      let lastName = '' // 最后一级的名称
      if (this.curMenuId && menuChainMap[this.curMenuId]) {
        menuChainMap[this.curMenuId].forEach((menu) => {
          nameList.push(menu.name)
          lastName = menu.name
        })

        let extendName = this.$route.meta.extendName
        if (extendName && lastName !== extendName) {
          nameList.push(extendName)
        }
      }
      return nameList
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
.breadcrumb {
  height: $app-header-height;
  margin-left: 20px;
  transition: .1s ease-out;
  transition-delay: .2s;
  .item {
    float: left;
    display: block;
    height: $app-header-height;
    line-height: $app-header-height;
    padding-left: 0;
    color: $color-text-secondary;
    overflow: hidden;
    .home-icon {
      vertical-align: middle;
    }
    .arrow {
      float: left;
      width: 30px;
      height: 30px;
      text-align: center;
      // display: inline-block;
      // background: url("../../assets/img/ico_right.png") no-repeat center right;
      &:before {
        content: "/";
        display: inline-block;
      }
    }
    .text {
      float: left;
    }
    &:last-of-type {
      .text {
        color: $color-text-regular;
      }
    }
  }
}
</style>
