<template>
  <div id="app" class="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted () {}
}
</script>

<style lang="scss" px2rem="false">
html, body {
  height: 100%;
  background-color: $bg-color-base;
}
.app{
  position: relative;
  min-height: 100%;
  margin: 0 auto;
  background-color: #FFF;
  box-sizing: border-box;
}
</style>
// 下面注释勿删，用于根据配置文件 isMobile 配置项判断是否支持移动端，如果不支持，注释掉该样式
/* [auto html command START {isMobile=false}] */
<style lang="scss">
@media (max-width: $max-mobile-width) {
  .app {
    width: 750px;
  }
}
</style>
/* [auto html command END {isMobile=false}] */
