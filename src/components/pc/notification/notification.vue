<template>
  <transition name="fade" @after-leave="afterLeave" @after-enter="afterEnter">
    <div
      class="notification"
      :style="style"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="createTimer"
    >
      <div class="icon-wrap">
        <BaseIcon v-if="type && type!== 'normal'"  :name="type" class="type-icon" :class="[type+'-icon']"></BaseIcon>
      </div>
      <span class="content">{{content}}</span>
      <a class="btn" @click="handleClose">
        <BaseIcon name="close" class="close-svg"></BaseIcon>
      </a>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    // 通知类型：normal、success、info、warn、error
    type: {
      type: String,
      default: 'normal'
    },
    // 通知内容
    content: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      visible: true
    }
  },
  computed: {
    style () {
      return {}
    }
  },
  methods: {
    handleClose (e) {
      e.preventDefault()
      this.$emit('close')
    },
    afterLeave () {
      this.$emit('closed')
    },
    afterEnter () {},
    clearTimer () {},
    createTimer () {}
  },
  components: {
    // Icon
  }
}
</script>

<style lang="scss" scoped px2rem="false">
.notification{
  display: inline-flex;
  position: absolute;
  background-color: #303030;
  color: rgba(255, 255, 255, 1);
  align-items: center;
  padding: 20px;
  min-width: 280px;
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  flex-wrap: wrap;
  transition: all .3s;
  border-radius: 5px;
  z-index: 999;
}
.icon-wrap{
  width: 16px;
  height: 16px;
  margin-right: 7px;
  .type-icon{
    width: 16px;
    height: 16px;
    fill: #fff;
  }
  .error-icon{
    fill: #fe3a3a;
  }
  .warn-icon{
    fill: #ffa908;
  }
  .info-icon{
    fill: #2abbf3;
  }
  .success-icon{
    fill: #8ccf66;
  }
}

.content{
  padding: 0;
}
.btn {
  padding-left: 24px;
  margin-left: auto;
  cursor: pointer;
  .close-svg{
    width: 16px;
    height: 16px;
    fill: #bfbfbf;
  }
}
/* IE9 样式 */
[ie-version="9"] {
  .notification {
    position: relative;
    white-space: nowrap;
    .icon-wrap {
      display: inline-block;
      vertical-align: -20%;
    }
    .content {
      margin-right: 40px;
    }
    .btn {
      position: absolute;
      right: 20px;
    }
  }
}
</style>
