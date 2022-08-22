<template>
  <div class="banners-container">
    <div class="banners-wrap" ref="bannersWrap"
         @touchstart="touchStartHandler"
         @touchmove="touchMoveHandler"
         @touchend="touchEndHandler">
      <div class="banner-item" v-for="item in banners" :key="item.src"
           :class="[item.animationClass]"
           :style="item.style"
           @click="linkHandle(item)">
      </div>
    </div>
    <div class="nav-wrap">
      <div class="nav-index-wrap" :class="[isStartNav && index === curIndex ? 'cur' : '']" v-for="(item, index) in bannerList" :key="item.src" @click="onChooseIndex(index)">
        {{item.name ? item.name : ''}}
        <b class="nav-index" :class="indexClass" v-if="!item.name">
          <span class="line-process" v-if="indexType === 'line'" :style="{transitionDuration: interval+'ms'}"></span>
        </b>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'banners',
  props: {
    bannerList: {
      type: Array,
      default: () => []
    },
    // 动画时长（毫秒）
    speed: {
      type: Number,
      default: 300
    },
    // 轮播间隔时间 （毫秒）
    interval: {
      type: Number,
      default: 3000
    },
    // 初始显示的轮播图的索引
    defaultIndex: {
      type: Number,
      default: 0
    },
    // 底部导航样式：dot(圆点)、line(横线)，默认:dot
    indexType: {
      type: String,
      default: 'dot'
    }
  },
  data () {
    const curIndex = (this.defaultIndex < 0 || this.defaultIndex >= this.bannerList.length) ? 0 : this.defaultIndex
    return {
      curIndex, // 当前索引
      lastIndex: null, // 上一个banner的索引
      intervalId: null, // 定时器ID
      isStart: false, // 是否开始banner切换动画
      isStartNav: false, // 是否开始导航动画
      isReverse: false, // 动画是否反向

      /* 触摸事件位置信息 */
      startX: 0,
      startY: 0,
      moveEndX: 0,
      moveEndY: 0
    }
  },
  computed: {
    indexClass () {
      return 'nav-' + this.indexType
    },
    banners () {
      let list = this.bannerList
      let length = this.bannerList.length
      for (let i = 0; i < length; i++) {
        let animationClass = ''
        let style = {
          animationDuration: this.speed + 'ms',
          backgroundImage: `url('${list[i].src}')`
        }
        if (this.isStart) {
          if (this.isReverse) {
            if (i === this.curIndex) {
              animationClass = 'show-reverse'
            } else if (i === this.lastIndex) { // i === (this.curIndex + 1) % length)
              animationClass = 'hide-reverse'
            }
          } else {
            if (i === this.curIndex) {
              animationClass = 'show'
            } else if (i === this.lastIndex) { // (i === (this.curIndex === 0 ? length - 1 : this.curIndex - 1))
              animationClass = 'hide'
            }
          }
        } else {
          if (i === this.curIndex) {
            animationClass = 'cur'
          }
        }
        list[i].animationClass = animationClass
        list[i].style = style
      }
      return list
    }
  },
  mounted () {
    setTimeout(() => { this.isStartNav = true }, 10)
    this.intervalId = setInterval(this.start, this.interval)
  },
  methods: {
    linkHandle (item) {
      if (item.link) {
        window.open(item.link)
      }
    },
    start () {
      this.isStart = true
      this.isReverse = false
      this.lastIndex = this.curIndex
      let maxIndex = this.bannerList.length - 1
      if (this.curIndex >= maxIndex) {
        this.curIndex = 0
      } else {
        this.curIndex++
      }
    },
    onSwipe (direction) {
      if (direction) {
        clearInterval(this.intervalId)
        this.lastIndex = this.curIndex
        this.isReverse = direction < 0
        this.curIndex += direction
        let listLength = this.bannerList.length
        if (this.curIndex >= listLength) {
          this.curIndex = 0
        } if (this.curIndex < 0) {
          this.curIndex = listLength - 1
        }
        this.isStart = true
        this.intervalId = setInterval(this.start, this.interval)
      }
    },
    onChooseIndex (index) {
      if (this.curIndex !== index) {
        clearInterval(this.intervalId)
        this.lastIndex = this.curIndex
        this.curIndex = index
        this.isStart = true
        this.intervalId = setInterval(this.start, this.interval)
      }
    },
    touchStartHandler (e) {
      this.startX = e.touches[0].pageX
      this.startY = e.touches[0].pageY
      this.moveEndX = this.startX
      this.moveEndY = this.startY
    },
    touchMoveHandler (e) {
      let moveEndX = e.changedTouches[0].pageX
      let moveEndY = e.changedTouches[0].pageY
      let moveX = Math.abs(moveEndX - this.moveEndX)
      let moveY = Math.abs(moveEndY - this.moveEndY)
      if (moveX > moveY) {
        e.stopPropagation()
        e.preventDefault()
        this.moveEndX = moveEndX
        this.moveEndY = moveEndY
      }
    },
    touchEndHandler (e) {
      if (this.moveEndX - this.startX > 50) {
        e.preventDefault()
        e.stopPropagation()
        this.onSwipe(-1)
      } else if (this.moveEndX - this.startX < -50) {
        e.preventDefault()
        e.stopPropagation()
        this.onSwipe(1)
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
  }
}
</script>
<style lang="scss" scoped px2rem="false">
$dotSize: 6px;
.banners-container{
  position: relative;
  height: 100%;
}
.banners-wrap{
  position: relative;
  overflow: hidden;
  height: 100%;
  white-space: nowrap;
  background-color: #cdcdcd;
  .banner-item{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #000 no-repeat center;
    background-size: cover;
    animation-timing-function: ease-in-out;
    z-index: 0;
  }
  .cur,.show,.show-reverse{
    z-index: 2;
  }
  .hide, .hide-reverse{
    z-index: 1;
  }
  .show{
    animation-name: show-in;
  }
  .hide{
    animation-name: show-out;
    transform: translate3d(-100%, 0, 0);
  }
  .show-reverse{
    animation-name: show-in-reverse;
  }
  .hide-reverse{
    animation-name: show-out-reverse;
    transform: translate3d(100%, 0, 0);
  }
}
.nav-wrap{
  position: absolute;
  bottom: 14px;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  line-height: $dotSize * 2;
  z-index: 3;
  .nav-index-wrap {
    display: inline-block;
    .nav-index {
      display: inline-block;
      vertical-align: middle;
    }
    .nav-dot{
      margin: 5px 10px;
      width: $dotSize * 2;
      height: $dotSize *  2;
      border-radius: 50%;
      background-color: rgba(0,0,0,.5);
    }
    .nav-line{
      margin: 5px;
      width: 40px;
      height: 2px;
      background-color: rgba(255, 255, 255, .5);
      .line-process {
        display: block;
        height: 100%;
        width: 0;
        background-color: #fff;
        transition: none;
      }
    }
  }

  .cur{
    .nav-dot {
      background-color: rgba(255, 255, 255, .5);
    }
    .nav-line{
      background-color: rgba(255, 255, 255, .5);
      .line-process {
        width: 100%;
        transition-property: width;
        transition-timing-function: ease;
      }
    }
  }
}
@keyframes show-in{
  0% {
    transform: translate3d(100%, 0, 0);
  }
  100% {
    transform: translate3d(1px, 0, 0);
  }
}
@keyframes show-out{
  0% {
    transform: translate3d(1px, 0, 0);
  }
  100% {
    transform: translate3d(-100%, 0, 0);
  }
}
@keyframes show-in-reverse{
  0% {
    transform: translate3d(-100%, 0, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
@keyframes show-out-reverse{
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(100%, 0, 0);
  }
}
</style>
// 下面注释勿删，用于根据配置文件 isMobile 配置项判断是否支持移动端，如果不支持，注释掉该样式
/* [auto html command START {isMobile=false}] */
<style lang="scss" scoped>
$dotSize: 8px;
@media (max-width: $max-mobile-width) {
  .nav-wrap{
    bottom: 10px;
    line-height: $dotSize * 2;/*no*/
    .nav-index-wrap {
      .nav-dot {
        width: $dotSize * 2; /*no*/
        height: $dotSize *  2; /*no*/
        border-radius: 50%; /*no*/
      }
      .nav-line {
        margin: 10px;
        width: 40px;
        height: 4px;
      }
    }
  }
  [data-dpr='1'] .nav-wrap{
    line-height: $dotSize;/*no*/
    .nav-dot{
      width: $dotSize;/*no*/
      height: $dotSize;/*no*/
    }
  }
  [data-dpr='3'] .nav-wrap{
    line-height: $dotSize * 3;/*no*/
    .nav-dot{
      width: $dotSize * 3;/*no*/
      height: $dotSize *  3;/*no*/
    }
  }
}
</style>
/* [auto html command END {isMobile=false}] */
