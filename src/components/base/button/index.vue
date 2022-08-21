<template>
  <button class="btn"
          :class="[computedType, computedSize, computedCharLength]"
          :disabled="disabled" @click="doClick">
    <canvas class="zk-ripple" @click="ripple"></canvas>
    <BaseIcon v-if="icon && iconPosition==='start'" :name="icon" class="start-icon"></BaseIcon>
    <slot>{{ text }}</slot>
    <BaseIcon v-if="icon && iconPosition==='end'" :name="icon" class="end-icon"></BaseIcon>
    <BaseIcon v-if="icon && iconPosition!=='start' && iconPosition!=='end'" :name="icon"></BaseIcon>
  </button>
</template>
<script>
import { throttle } from '@/assets/js/utils'
import { getStyle, getStyleNumber } from './utils'
export default {
  name: 'Button',
  props: {
    // 按钮文字
    text: {
      type: String,
      default: ''
    },
    // 按钮类型：primary、disabled、success、danger
    type: {
      type: String,
      default: ''
    },
    // 按钮大小：xs、s、m、l、xl、full
    size: {
      type: String,
      default: 'full'
    },
    // 按钮图标
    icon: {
      type: String
    },
    // 图标位置：start、end
    iconPosition: {
      type: String
    },
    // 宽度等同于有指定个数汉字的按钮宽度（支持2到10个汉字数）
    charLength: {
      type: Number
    },
    // 是否启用函数节流
    throttle: {
      type: Boolean,
      default: true
    },
    // 函数节流等待时间，单位：毫秒
    throttleTime: {
      type: Number,
      default: 1000 // 1秒
    },
    // 按钮是否可用, 如果为true不触发点击事件
    disabled: {
      type: Boolean,
      default: false
    },
    // 动画速度
    speed: {
      type: Number,
      default: 20
    },
    // 动画透明度
    opacity: {
      type: Number,
      default: 0.4
    }
  },
  data () {
    return {
      color: '',
      radius: 0,
      oCanvas: null,
      context: null,
      initialized: false,
      speedOpacity: 0,
      timer: null,
      origin: {},
      // 函数节流方式触发点击事件
      throttleEmitClick: throttle(function (vm, event) {
        vm.$emit('click', event)
      }, this.throttleTime, { trailing: false })
    }
  },
  computed: {
    // 控制按钮的类型
    computedType () {
      if (this.disabled) {
        return 'btn-disabled'
      }
      return this.type ? `btn-${this.type}` : ''
    },
    // 控制按钮大小尺寸
    computedSize () {
      return this.size ? `btn-${this.size}` : ''
    },
    // 控制按钮宽度等同于有指定个数汉字的按钮
    computedCharLength () {
      return this.charLength && this.charLength >= 2 && this.charLength <= 10 ? `btn-char-length${this.charLength}` : ''
    }
  },
  methods: {
    init (el) {
      const oBtn = el.parentElement
      this.color = getStyle(el.parentElement, 'color')
      const w = getStyleNumber(oBtn, 'width')
      // 透明度的速度
      this.speedOpacity = (this.speed / w) * this.opacity
      // canvas 宽和高
      el.width = w
      el.height = getStyleNumber(oBtn, 'height')
      this.context = el.getContext('2d')
    },
    ripple (event) {
      // 清除上次没有执行的动画
      if (this.timer) {
        window.cancelAnimationFrame(this.timer)
      }
      this.el = event.target
      // 不可用或者按钮宽度小于180时不显示动画
      if (this.disabled || this.el.width < 180) return
      // 执行初始化
      if (!this.initialized) {
        this.initialized = true
        this.init(this.el)
      }
      this.radius = 0
      // 点击坐标原点
      this.origin.x = event.offsetX
      this.origin.y = event.offsetY
      this.context.clearRect(0, 0, this.el.width, this.el.height)
      this.el.style.opacity = this.opacity
      this.draw()
    },
    draw () {
      this.context.beginPath()
      // 绘制波纹
      this.context.arc(this.origin.x, this.origin.y, this.radius, 0, 2 * Math.PI, false)
      this.context.fillStyle = this.color
      this.context.fill()
      // 定义下次的绘制半径和透明度
      this.radius += this.speed
      this.el.style.opacity -= this.speedOpacity
      // 通过判断半径小于元素宽度或者还有透明度，不断绘制圆形
      if (this.radius < this.el.width || this.el.style.opacity > 0) {
        this.timer = window.requestAnimationFrame(this.draw)
      } else {
        // 清除画布
        this.context.clearRect(0, 0, this.el.width, this.el.height)
        this.el.style.opacity = 0
      }
    },
    doClick (event) {
      if (!this.disabled) {
        if (this.throttle) {
          this.throttleEmitClick(this, event)
        } else {
          this.$emit('click', event)
        }
      }
    }
  },
  destroyed () {
    // 清除上次没有执行的动画
    if (this.timer) {
      window.cancelAnimationFrame(this.timer)
      this.timer = null
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
$btn-font-size: 12px;
$btn-padding: 15px;
.btn {
  position: relative;
  padding: 0 $btn-padding;
  height: 30px;
  box-sizing: content-box;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  background-color: #FFF;
  border: 1px solid $border-color-base;
  border-radius: 5px;
  font-size: $btn-font-size;
  color: #666;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  overflow: hidden;
  outline: none;
  &+.btn {
    margin-left: 10px;
  }
  &>span, &>.fa-icon {
    vertical-align: middle;
  }
  & .start-icon {
    margin-right: 3px;
  }
  & .end-icon {
    margin-left: 3px;
  }
}
.btn:active {
  box-shadow: 0 1px 3px -1px rgba(0, 0, 0, .5), 0 0 5px 0 rgba(0, 0, 0, 0.12);
}
.zk-ripple {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.btn-primary {
  color: #fff;
  @include primary-background-color();
  @include primary-border-color();
}
.btn-primary:hover {
  color: #fff;
  @include primary-background-color();
  @include primary-border-color();
}
.btn-primary.disabled, .btn-primary:disabled {
  @include primary-background-color();
  @include primary-border-color();
}
.btn-success {
  color: #fff;
  background-color: $color-success;
  border-color: $color-success;
}
.btn-success:hover {
  color: #fff;
  background-color: $color-success;
  border-color: $color-success;
}
.btn-success.disabled, .btn-success:disabled {
  background-color: $color-success;
  border-color: $color-success;
}
.btn-danger {
  color: #fff;
  background-color: $color-danger;
  border-color: $color-danger;
}
.btn-danger :hover {
  color: #fff;
  background-color: $color-danger;
  border-color: $color-danger;
}
.btn-danger .disabled, .btn-danger:disabled {
  background-color: $color-danger;
  border-color: $color-danger;
}
.btn-xs{
  padding: 0 ($btn-padding - 6px);
  height: 22px;
  font-size: 12px;
}
.btn-s{
  padding: 0 ($btn-padding - 4px);
  height: 26px;
  font-size: 13px;
}
.btn-m{
}
.btn-l{
  padding: 0 ($btn-padding + 4px);
  height: 32px;
  font-size: 15px;
}
.btn-xl{
  padding: 0 ($btn-padding + 6px);
  height: 34px;
  font-size: 16px;
}
button.btn-char-length2{
  width: 2em;
}
button.btn-char-length3{
  width: 3em;
}
button.btn-char-length4{
  width: 4em;
}
button.btn-char-length5{
  width: 5em;
}
button.btn-char-length6{
  width: 6em;
}
button.btn-char-length7{
  width: 7em;
}
button.btn-char-length8{
  width: 8em;
}
button.btn-char-length9{
  width: 9em;
}
button.btn-char-length10{
  width: 10em;
}
button.btn-disabled {
  color: #fff;
  background-color: #ccc;
  border-color: #ccc;
}
</style>
// 下面注释勿删，用于根据配置文件 isMobile 配置项判断是否支持移动端，如果不支持，注释掉该样式
/* [auto html command START {isMobile=false}] */
<style lang="scss" scoped>
$btn-font-size: 32px;
$btn-padding: 20px;
@media (max-width: $max-mobile-width) {
  .btn {
    padding: 0 $btn-padding;
    height: 84px;
    box-sizing: border-box;
    font-size: $btn-font-size;/*yes*/
    border: none;
    background-color: #f3f3f3;
  }
  .btn-full{
    width: 100%;
  }
  .btn-xl{
    width: 600px;
  }
  .btn-l{
    width: 420px;
  }
  .btn-m{
    height: 80px;
  }
  .btn-s{
    height: 72px;
    font-size: 28px;/*yes*/
  }
  .btn-xs{
    height: 64px;
    font-size: 24px;/*yes*/
  }
  button.btn-char-length2{
    width: $btn-font-size * 2 + $btn-padding * 2;
  }
  button.btn-char-length3{
    width: $btn-font-size * 3 + $btn-padding * 2;
  }
  button.btn-char-length4{
    width: $btn-font-size * 4 + $btn-padding * 2;
  }
  button.btn-char-length5{
    width: $btn-font-size * 5 + $btn-padding * 2;
  }
  button.btn-char-length6{
    width: $btn-font-size * 6 + $btn-padding * 2;
  }
  button.btn-char-length7{
    width: $btn-font-size * 7 + $btn-padding * 2;
  }
  button.btn-char-length8{
    width: $btn-font-size * 8 + $btn-padding * 2;
  }
  button.btn-char-length9{
    width: $btn-font-size * 9 + $btn-padding * 2;
  }
  button.btn-char-length10{
    width: $btn-font-size * 10 + $btn-padding * 2;
  }
}
</style>
/* [auto html command END {isMobile=false}] */
