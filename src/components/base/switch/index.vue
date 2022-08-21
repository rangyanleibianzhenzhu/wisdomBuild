<template>
  <div class="switch-bar" :class="statusClass" @click="doSwitch">
    <span v-if="showText" class="text">{{currentValue?'开':'关'}}</span><div class="switch-handle"></div>
  </div>
</template>
<script>
export default {
  name: 'BaseSwitch',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showText: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      currentValue: this.value
    }
  },
  computed: {
    statusClass () {
      let statusClass = []
      if (this.currentValue) {
        statusClass.push('on')
      }
      if (this.disabled) {
        statusClass.push('disabled')
      }
      return statusClass
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    }
  },
  methods: {
    doSwitch () {
      if (!this.disabled) {
        this.currentValue = !this.currentValue
        this.$emit('input', this.currentValue)
        this.$emit('change', this.currentValue)
      }
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
$bar-width: 40px;
$bar-height: 20px;
$bar-padding: 2px;
$text-padding: 7px;
$switch-bg-color: $border-color-base;
.switch-bar{
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  width: $bar-width;
  height: $bar-height;
  line-height: $bar-height;
  border-radius: $bar-height / 2;
  background-color: $switch-bg-color;
  color: #FFF;
  text-align: right;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  .text {
    position: absolute;
    left: $text-padding;
    top: 0;
    right: $text-padding;
    bottom: 0;
    line-height: $bar-height;
    font-size: 12px;
    vertical-align: middle;
  }
  .switch-handle{
    position: absolute;
    left: $bar-padding;
    top: $bar-padding;
    width: $bar-height - $bar-padding * 2;
    height: $bar-height - $bar-padding * 2;
    border-radius: 50%;
    background-color: #FFF;
    transition: all 0.3s ease-in-out;
  }
}
.switch-bar.on{
  @include primary-border-color();
  @include primary-background-color();
  color: #FFF;
  text-align: left;
  .switch-handle{
    background-color: #FFF;
    transform: translateX($bar-width - $bar-height);
  }
}
.switch-bar.disabled {
  background-color: #E5E5E5;
  cursor: not-allowed;
  .switch-handle{
    background-color: #F2F2F2;
  }
}
.switch-bar.on.disabled{
  @include primary-border-color(0.6);
  @include primary-background-color(0.6);
  .switch-handle{
    background-color: #F9F9F9;
  }
  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, .5);
    border-radius: $bar-height / 2;
  }
}

</style>
// 下面注释勿删，用于根据配置文件 isMobile 配置项判断是否支持移动端，如果不支持，注释掉该样式
/* [auto html command START {isMobile=false}] */
<style lang="scss" scoped>
$bar-width: 116px;
$bar-height: 60px;
$bar-padding: 4px;
$text-padding: 22px;
@media (max-width: $max-mobile-width) {
  .switch-bar{
    width: $bar-width;
    height: $bar-height;
    line-height: $bar-height;
    border-radius: $bar-height / 2;/*yes*/
    .text {
      font-size: 28px;/*yes*/
      line-height: $bar-height;
      left: $text-padding;
      right: $text-padding;
    }
    .switch-handle{
      left: $bar-padding;
      top: $bar-padding;
      width: $bar-height - $bar-padding * 2;
      height: $bar-height - $bar-padding * 2;
    }
  }
  .switch-bar.on{
    .switch-handle{
      transform: translateX($bar-width - $bar-height);
    }
  }
  .switch-bar.on.disabled:before {
    border-radius: $bar-height / 2;
  }
}
</style>
/* [auto html command END {isMobile=false}] */
