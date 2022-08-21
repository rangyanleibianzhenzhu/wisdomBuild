<!-- 简单提示信息组件 -->
<template>
  <transition name="toast-pop">
    <div v-show="visible" class="toast" :class="customClass" @click="handleClose">
      <span class="text">{{message}}</span>
    </div>
  </transition>
</template>
<script>

export default {
  name: 'Toast',
  props: {
    message: String, // 提示信息内容
    // 样式名
    className: {
      type: String,
      default: ''
    },
    // 位置: top、middle、bottom
    position: {
      type: String,
      default: 'bottom'
    },
    // 提示类型：normal、error
    type: {
      type: String,
      default: 'normal'
    }
  },
  data () {
    return {
      // 是否显示
      visible: false
    }
  },
  computed: {
    // 获取样式
    customClass () {
      let classes = []
      classes.push('toast-' + this.type)
      switch (this.position) {
        case 'top':
          classes.push('is-placetop')
          break
        case 'bottom':
          classes.push('is-placebottom')
          break
        default:
          classes.push('is-placemiddle')
      }
      this.className && classes.push(this.className)
      // console.log('classes=', classes)
      return classes
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
.toast {
  position: fixed;
  box-sizing: border-box;
  min-width: 200px;
  max-width: 50%;
  max-height: 85%;
  margin-top: 0;
  padding: 18px 30px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  text-align: center;
  overflow-y: auto;
  z-index: 3000;
  .text {
    display: block;
    font-size: 16px;
    line-height: 1.5;
    text-align: center;
    word-wrap: break-word;
  }
}
.is-placetop {
  top: 50px;
  left: 50%;
  transform: translate(-50%, 0);
}
.is-placemiddle {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.is-placebottom {
  bottom: 50px;
  left: 50%;
  transform: translate(-50%, 0);
}

.is-placetop.toast-pop-enter-active, .is-placetop.toast-pop-leave-active,
.is-placemiddle.toast-pop-enter-active, .is-placemiddle.toast-pop-leave-active {
  transition: opacity .3s linear, margin-top .3s ease;
}

.is-placetop.toast-pop-enter, .is-placetop.toast-pop-leave-to,
.is-placemiddle.toast-pop-enter, .is-placemiddle.toast-pop-leave-to {
  margin-top: 30px;
  opacity: 0;
}
.is-placebottom.toast-pop-enter-active, .is-placebottom.toast-pop-leave-active {
  transition: opacity .3s linear, margin-bottom .3s ease;
}
.is-placebottom.toast-pop-enter, .is-placebottom.toast-pop-leave-to {
  margin-bottom: -30px;
  opacity: 0;
}

.toast-error {
  /* position: absolute;
  top: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
  height: 46px;
  padding: 0 10px;
  font-size: 14px;
  line-height: 46px;
  text-align: center;
  color: #fff;
  background-color: #FF6668; */
  background: rgba(255,102,104,.9);
  /* overflow: hidden;
  z-index: 3000; */
}
/*.toast-error.toast-pop-enter-active, .toast-error.toast-pop-leave-active{
  transition: opacity .3s ease;
}
.toast-error.toast-pop-enter, .toast-error.toast-pop-leave-to {
  opacity: 0;
}*/
</style>
// 下面注释勿删，用于根据配置文件 isMobile 配置项判断是否支持移动端，如果不支持，注释掉该样式
/* [auto html command START {isMobile=false}] */
<style lang="scss" scoped>
@media (max-width: $max-mobile-width) {
  .toast-normal {
    min-width: 140px;
    max-width: 80%;
    padding: 24px 40px;
    .text {
      font-size: 30px;
    }
  }
  .toast-error {
    height: 90px;
    padding: 20px;
    font-size: 28px;
    line-height: 40px;
  }
}
</style>
/* [auto html command END {isMobile=false}] */
