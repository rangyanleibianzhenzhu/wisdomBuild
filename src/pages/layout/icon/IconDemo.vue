<template>
  <div class="icon-list">
    <div class="block">
      <div class="block-head">
        <h3>
          <span class="header-text">系统图标</span>
          <AppHelp readme="icon"></AppHelp>
        </h3>
      </div>

      <ul class="block-body clearfix">
        <li v-for="(i) in icons" :key="i">
          <BaseIcon :name="i"></BaseIcon>
          <p>{{i}}</p>
        </li>
      </ul>
    </div>

    <div class="block">
      <div class="block-head">
        <h3>图标变换</h3>
      </div>

      <ul class="block-body clearfix">
        <li>
          <BaseIcon name="logo"></BaseIcon>
          <p>简单使用</p>
        </li>
        <li>
          <BaseIcon name="logo" class="customer-icon"></BaseIcon>
          <p>自定义样式</p>
        </li>
        <li>
          <BaseIcon name="logo" :spin="true"></BaseIcon>
          <p>旋转效果(不兼容IE9)</p>
        </li>
        <li>
          <BaseIcon name="logo" :pulse="true"></BaseIcon>
          <p>脉冲旋转(不兼容IE9)</p>
        </li>
        <li>
          <BaseIcon name="logo" flip="horizontal"></BaseIcon>
          <p>水平翻转</p>
        </li>
        <li>
          <BaseIcon name="logo" flip="vertical"></BaseIcon>
          <p>垂直翻转</p>
        </li>
        <li>
          <BaseIcon name="logo" scale="2"></BaseIcon>
          <p>放大两倍</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import AppHelp from '@/layout/pc/AppHelp.vue'

export default {
  name: 'IconDemoPC',
  components: {
    AppHelp
  },
  data () {
    return {
      icons: [
        'logo',
        'user',
        'home',
        'help',
        'top',
        'logout',
        'close',
        'close-fill',
        'tick',
        'trangle',
        'refresh',
        'menu-on',
        'menu-off',
        'search',
        'right-arrow',
        'next',
        'next-double',
        'success',
        'info',
        'warn',
        'error',
        'rmb',
        'pluse',
        'eye',
        'upload',
        'delete',
        'scale-minus',
        'scale-plus',
        'screen-contract',
        'screen-expand',
        'select-all',
        'select-half',
        'select-none',
        'no-data',
        'pc',
        'mobile',
        'cry'
      ]
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
.icon-list{
  margin: 20px;
  padding: 20px;
  .block {
    margin-bottom: 30px;
    border-radius: 5px;
    background-color: #fff;
    ul, li {
      list-style: none;
    }
    .block-head {
      height: 55px;
      padding: 0 25px;
      vertical-align: middle;
      border-bottom: 1px solid $border-color-light;
      h3 {
        font-size: 17px;
        line-height: 55px;
        .header-text {
          vertical-align: middle;
        }
      }
    }
    .block-body {
      padding: 25px;
      li {
        float: left;
        width: 150px;
        padding: 15px 20px;
        text-align: center;
        .fa-icon {
          font-size: 24px;
          color: $color-text-regular;
        }
        .customer-icon{
          // color: #cb1de1 !important;
          @include primary-font-color();
        }
        p {
          color: $color-text-secondary;
          line-height: 1.5;
        }
      }
    }
  }
}
</style>
