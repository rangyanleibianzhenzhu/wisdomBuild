<template>
  <div id="viewContent" class="container">
    <router-view></router-view>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'AppView'
}
</script>
<style lang="scss" scoped px2rem="false">
.container {
  position: absolute;
  left: $app-menu-width;
  top: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  transition: left .2s ease;
  transition-delay: .1s;
}
</style>
