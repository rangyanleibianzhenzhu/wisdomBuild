<template>
  <div v-if="isIE9" class="spinner-loading loading-gif" :class="size ? 'size-' + size : ''"/>
  <component v-else :is="spinnerView" :theme="theme" :size="size"></component>
</template>

<script>
const SPINNERS = {
  // 默认类型，圆环上有一个旋转球
  DEFAULT: {
    render (createElement) {
      let theme = this.$attrs.theme
      let size = this.$attrs.size
      return createElement('i', {
        attrs: {
          class: `spinner-loading loading-default ${theme ? 'theme-' + theme : ''} ${size ? 'size-' + size : ''}`
        },
        style: {
          backgroundColor: this.$attrs.color
        }
      })
    }
  },
  // 由小到大的气泡旋转
  BUBBLES: {
    render (createElement) {
      let theme = this.$attrs.theme
      let size = this.$attrs.size
      return createElement('span', {
        attrs: {
          class: `spinner-loading loading-bubbles ${theme ? 'theme-' + theme : ''} ${size ? 'size-' + size : ''}`
        }
      }, Array.apply(Array, Array(8)).map(() => createElement('span', {
        attrs: {
          class: 'bubble-item'
        }
      })))
    }
  },
  // 多个圆点旋转
  CIRCLES: {
    render (createElement) {
      let theme = this.$attrs.theme
      let size = this.$attrs.size
      return createElement('span', {
        attrs: {
          class: `spinner-loading loading-circles  ${theme ? 'theme-' + theme : ''} ${size ? 'size-' + size : ''}`
        }
      }, Array.apply(Array, Array(8)).map(() => createElement('span', {
        attrs: {
          class: 'circle-item'
        }
      })))
    }
  },
  // 圆弧旋转
  SPIRAL: {
    render (createElement) {
      let theme = this.$attrs.theme
      let size = this.$attrs.size
      return createElement('i', {
        attrs: {
          class: `spinner-loading loading-spiral ${theme ? 'theme-' + theme : ''} ${size ? 'size-' + size : ''}`
        }
      })
    }
  },
  // 圆点波浪
  WAVEDOTS: {
    render (createElement) {
      let theme = this.$attrs.theme
      let size = this.$attrs.size
      return createElement('span', {
        attrs: {
          class: `spinner-loading loading-wave-dots ${theme ? 'theme-' + theme : ''} ${size ? 'size-' + size : ''}`
        }
      }, Array.apply(Array, Array(5)).map(() => createElement('span', {
        attrs: {
          class: 'wave-item'
        }
      })))
    }
  }
}

export default {
  name: 'Spinner',
  props: {
    spinner: {
      type: String,
      default: 'default'
    },
    // 主题样式，默认为灰色：white（白色）、primary(主题色，即variables.scss中定义的$color-primary)
    theme: {
      type: String,
      default: 'default'
    },
    // 大小：m（28px，默认）、s(18px)、l(38px)
    size: {
      type: String,
      default: 'm'
    }
  },
  data () {
    return {
      // 是否 IE9
      isIE9: window.__ieVersion && window.__ieVersion === 9
    }
  },
  computed: {
    spinnerView () {
      return (SPINNERS[(this.spinner || '').toUpperCase()] || SPINNERS.DEFAULT)
    }
  }
}
</script>

<style lang="scss" scoped px2rem="false">
.spinner-loading {
  display: inline-block;
  margin: 5px 0;
  width: 28px;
  height: 28px;
  font-size: 28px;
  line-height: 28px;
  border-radius: 50%;
  &.size-s {
    width: 18px;
    height: 18px;
    font-size: 18px;
    line-height: 18px;
  }
  &.size-l {
    width: 38px;
    height: 38px;
    font-size: 38px;
    line-height: 38px;
  }
}

/* default spinner */
.loading-default {
  position: relative;
  border: 1px solid #999;
  animation: loading-rotating ease 1.5s infinite;
  &:before {
    $size: 6px;
    content: '';
    position: absolute;
    display: block;
    top: 0;
    left: 50%;
    margin-top: -$size/2;
    margin-left: -$size/2;
    width: $size;
    height: $size;
    background-color: #999;
    border-radius: 50%;
  }
  &.theme-white {
    border-color: #FFF;
    &:before {
      background-color: #FFF;
    }
  }
  &.theme-primary {
     border-color: $color-primary;
     &:before {
       background-color: $color-primary;
     }
  }
  &.size-s {
    &:before {
      $size: 4px;
      margin-top: -$size/2;
      margin-left: -$size/2;
      width: $size;
      height: $size;
    }
  }
  &.size-l {
    &:before {
      $size: 8px;
      margin-top: -$size/2;
      margin-left: -$size/2;
      width: $size;
      height: $size;
    }
  }
}

// spiral spinner
.loading-spiral {
  border: 2px solid #999;
  border-right-color: transparent;
  animation: loading-rotating linear .85s infinite;
  &.theme-white {
    border-color: #F5F5F5;
    border-right-color: transparent;
  }
  &.theme-primary {
    border-color: $color-primary;
    border-right-color: transparent;
  }
  &.size-s {
    border-width: 1px;
  }
}

// rotate animation
@keyframes loading-rotating {
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
}

/* bubbles spinner */
.loading-bubbles {
  position: relative;
  @mixin bubbles($theme, $size) {
    $c-basic: #999;
    $bubble-size: 2px;
    $radius: 12px;
    $shallow: 2px;
    @if $theme == white {
      $c-basic: #FFF;
    } @else if $theme == primary {
      $c-basic: $color-primary;
    }

    @if $size == 's' {
      $bubble-size: 2px;
      $radius: 8px;
      $shallow: 1px;
    } @else if $size == 'l' {
      $bubble-size: 2px;
      $radius: 16px;
      $shallow: 4px;
    }

    ::v-deep .bubble-item {
      background: $c-basic;
      animation: loading-bubbles-#{$theme}-#{$size} linear .75s infinite;
      &:first-child {
        margin-top: -$bubble-size/2 + -$radius;
        margin-left: -$bubble-size/2;
      }
      &:nth-child(2) {
        margin-top: -$bubble-size/2 + -$radius * .73;
        margin-left: -$bubble-size/2 + $radius * .73;
      }
      &:nth-child(3) {
        margin-top: -$bubble-size/2;
        margin-left: -$bubble-size/2 + $radius;
      }
      &:nth-child(4) {
        margin-top: -$bubble-size/2 + $radius * .73;
        margin-left: -$bubble-size/2 + $radius * .73;
      }
      &:nth-child(5) {
        margin-top: -$bubble-size/2 + $radius;
        margin-left: -$bubble-size/2;
      }
      &:nth-child(6) {
        margin-top: -$bubble-size/2 + $radius * .73;
        margin-left: -$bubble-size/2 + -$radius * .73;
      }
      &:nth-child(7) {
        margin-top: -$bubble-size/2;
        margin-left: -$bubble-size/2 + -$radius;
      }
      &:last-child {
        margin-top: -$bubble-size/2 + -$radius * .73;
        margin-left: -$bubble-size/2 + -$radius * .73;
      }

      $delay: .093s;
      position: absolute;
      top: 50%;
      left: 50%;
      display: inline-block;
      border-radius: 50%;
      &:nth-child(2) {
        animation-delay: $delay;
      }
      &:nth-child(3) {
        animation-delay: $delay * 2;
      }
      &:nth-child(4) {
        animation-delay: $delay * 3;
      }
      &:nth-child(5) {
        animation-delay: $delay * 4;
      }
      &:nth-child(6) {
        animation-delay: $delay * 5;
      }
      &:nth-child(7) {
        animation-delay: $delay * 6;
      }
      &:last-child {
        animation-delay: $delay * 7;
      }
      @keyframes loading-bubbles-#{""+$theme}-#{$size} {
        0% {
          width: $bubble-size;
          height: $bubble-size;
          box-shadow: 0 0 0 $shallow $c-basic;
        }
        90% {
          width: $bubble-size;
          height: $bubble-size;
          box-shadow: 0 0 0 0 $c-basic;
        }
        100% {
          width: $bubble-size;
          height: $bubble-size;
          box-shadow: 0 0 0 $shallow $c-basic;
        }
      }
    }
  }

  &.theme-default{
    &.size-s {
      @include bubbles(default, s);
    }
    &.size-m {
      @include bubbles(default, m);
    }
    &.size-l {
      @include bubbles(default, l);
    }
  }

  &.theme-white {
    &.size-s {
      @include bubbles(white, s);
    }
    &.size-m {
      @include bubbles(white, m);
    }
    &.size-l {
      @include bubbles(white, l);
    }
  }
  &.theme-primary{
    &.size-s {
      @include bubbles(primary, s);
    }
    &.size-m {
      @include bubbles(primary, m);
    }
    &.size-l {
      @include bubbles(primary, l);
    }
  }
}

/* circles spinner */
.loading-circles {
  position: relative;
  @mixin loading-circles-animate ($theme) {
    $color1: #888;
    $color2: lighten($color1, 42%);
    @if $theme == white {
      $color1: #FFF;
      $color2: darken($color1, 36%);
    } @else if $theme == primary {
      $color1: $color-primary;
      $color2: lighten($color1, 42%);
    }

    @keyframes loading-circles-#{""+$theme} {
      0% {
        background: $color2;
      }
      90% {
        background: $color1;
      }
      100% {
        background: $color2;
      }
    }

    ::v-deep .circle-item {
      $delay: .093s;
      position: absolute;
      top: 50%;
      left: 50%;
      display: inline-block;
      border-radius: 50%;
      animation: loading-circles-#{$theme} linear .75s infinite;
      &:nth-child(2) {
        animation-delay: $delay;
      }
      &:nth-child(3) {
        animation-delay: $delay * 2;
      }
      &:nth-child(4) {
        animation-delay: $delay * 3;
      }
      &:nth-child(5) {
        animation-delay: $delay * 4;
      }
      &:nth-child(6) {
        animation-delay: $delay * 5;
      }
      &:nth-child(7) {
        animation-delay: $delay * 6;
      }
      &:last-child {
        animation-delay: $delay * 7;
      }
    }
  }

  @mixin circles-size($size, $radius) {
    // $size: $size !global;
    // $radius: $radius !global;
    ::v-deep .circle-item {
      width: $size;
      height: $size;
      &:first-child {
        margin-top: -$size/2 + -$radius;
        margin-left: -$size/2;
      }
      &:nth-child(2) {
        margin-top: -$size/2 + -$radius * .73;
        margin-left: -$size/2 + $radius * .73;
      }
      &:nth-child(3) {
        margin-top: -$size/2;
        margin-left: -$size/2 + $radius;
      }
      &:nth-child(4) {
        margin-top: -$size/2 + $radius * .73;
        margin-left: -$size/2 + $radius * .73;
      }
      &:nth-child(5) {
        margin-top: -$size/2 + $radius;
        margin-left: -$size/2;
      }
      &:nth-child(6) {
        margin-top: -$size/2 + $radius * .73;
        margin-left: -$size/2 + -$radius * .73;
      }
      &:nth-child(7) {
        margin-top: -$size/2;
        margin-left: -$size/2 + -$radius;
      }
      &:last-child {
        margin-top: -$size/2 + -$radius * .73;
        margin-left: -$size/2 + -$radius * .73;
      }
    }
  }

  &.theme-default {
    @include loading-circles-animate(default);
  }
  &.theme-white {
    @include loading-circles-animate(white);
  }
  &.theme-primary {
    @include loading-circles-animate(primary);
  }
  &.size-l {
    @include circles-size(6px, 15px);
  }
  &.size-m {
    @include circles-size(5px, 11px);
  }
  &.size-s {
    @include circles-size(3px, 7px);
  }
}

/* wavedots spinner */
.loading-wave-dots {
  position: relative;

  $delay: .14s;
  @mixin wave-dots ($theme, $spinner-size) {
    $color1: #bbb;
    $color2: #999;
    $size: 8px;
    $wave: -6px;

    @if $theme == white {
      $color1: #FFF;
      $color2: darken($color1, 7%);
    } @else if $theme == primary {
      $color1: $color-primary;
      $color2: lighten($color-primary, 20%);
    }

    @if $spinner-size == 's' {
      $size: 6px;
      $wave: -4px;
    } @else if $spinner-size == 'l' {
      $size: 10px;
      $wave: -8px;
    }

    width: $size * 5 - $wave * 4;
    border-radius: 0;

    ::v-deep .wave-item {
      position: absolute;
      top: 50%;
      left: 50%;
      display: inline-block;
      margin-top: -$size/2;
      width: $size;
      height: $size;
      border-radius: 50%;
      animation: loading-wave-dots-#{$theme}-#{$spinner-size} linear 2.8s infinite;
      &:first-child {
        margin-left: -$size/2 + -$size * 4;
      }
      &:nth-child(2) {
        margin-left: -$size/2 + -$size * 2;
        animation-delay: $delay;
      }
      &:nth-child(3) {
        margin-left: -$size/2;
        animation-delay: $delay * 2;
      }
      &:nth-child(4) {
        margin-left: -$size/2 + $size * 2;
        animation-delay: $delay * 3;
      }
      &:last-child {
        margin-left: -$size/2 + $size * 4;
        animation-delay: $delay * 4;
      }
    }
    @keyframes loading-wave-dots-#{""+$theme}-#{$spinner-size} {
      0% {
        transform: translateY(0);
        background: $color1;
      }
      10% {
        transform: translateY($wave);
        background: $color2;
      }
      20% {
        transform: translateY(0);
        background: $color1;
      }
      100% {
        transform: translateY(0);
        background: $color1;
      }
    }
  }

  &.theme-default{
    &.size-s {
      @include wave-dots(default, s);
    }
    &.size-m {
      @include wave-dots(default, m);
    }
    &.size-l {
      @include wave-dots(default, l);
    }
  }

  &.theme-white {
    &.size-s {
      @include wave-dots(white, s);
    }
    &.size-m {
      @include wave-dots(white, m);
    }
    &.size-l {
      @include wave-dots(white, l);
    }
  }
  &.theme-primary{
    &.size-s {
      @include wave-dots(primary, s);
    }
    &.size-m {
      @include wave-dots(primary, m);
    }
    &.size-l {
      @include wave-dots(primary, l);
    }
  }
}

/* 图片加载器（兼容IE9） */
.loading-gif {
  padding: 5px 0;
  background: url(../../../assets/img/loading.gif) no-repeat;
  background-size: contain;
}
</style>
