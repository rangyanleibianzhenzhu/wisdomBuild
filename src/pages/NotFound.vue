<template>
  <div class="app-not-found-page">
    <div class="not-found-content">
      <img class="img-404" src="@/assets/img/404.png" alt="">
      <p class="message">访问的页面不存在</p>
      <BaseButton type="primary" size="xl" @click="goHome">返回首页</BaseButton>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goHome () {
      this.$router.replace('/')
    }
  }
}
</script>

<style lang="scss" scoped px2rem="false">
.app-not-found-page {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #FFF;

  .not-found-content {
    position: absolute;
    padding: 30px;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
    text-align: center;
    background-color: #FFF;

    .message {
      margin-top: 30px;
      margin-bottom: 20px;
      font-size: 20px;
      text-align: center;
    }
  }
}
</style>
// 下面注释勿删，用于根据配置文件 isMobile 配置项判断是否支持移动端，如果不支持，注释掉该样式
/* [auto html command START {isMobile=false}] */
<style lang="scss" scoped>
@media (max-width: $max-mobile-width) {
  .app-not-found-page {
    .not-found-content {
      .img-404 {
        width: 634px;
        height: 360px;
      }
    }
  }
}
</style>
/* [auto html command END {isMobile=false}] */
