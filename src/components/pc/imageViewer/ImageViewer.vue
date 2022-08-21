<template>
  <div class="image-viewer">
    <transition name="img-mask">
      <div v-show="visible" class="popup-mask"></div>
    </transition>
    <transition name="img-pop">
      <div v-show="visible && loaded" ref="imageWrapper" class="image-wrap" @dblclick="close">
        <div class="image-container">
          <img ref="image" class="drawable-image" :src="urls[curIndex]" :style="style">
        </div>
      </div>
    </transition>
    <div v-show="visible && loaded" class="image-tools">
      <div class="image-tool" @click="handleScalePlus"><BaseIcon name="scale-plus"></BaseIcon></div>
      <div class="image-tool" @click="handleScaleMinus"><BaseIcon name="scale-minus"></BaseIcon></div>
      <div class="image-tool" @click="handleRotateLeft"><BaseIcon name="rotate-left"></BaseIcon></div>
      <div class="image-tool" @click="handleRotateRight"><BaseIcon name="rotate-right"></BaseIcon></div>
    </div>
    <div v-if="visible && !loaded" class="loading-wrapper" @dblclick="close">
      <div v-if="failed" class="failed">
        <BaseIcon class="failed-icon" name="warn"></BaseIcon>
        <div class="failed-text">图片加载失败</div>
      </div>
      <div v-else class="loading">
        <Spinner theme="white" size="l"></Spinner>
        <div class="loading-text">图片加载中</div>
      </div>
    </div>
    <div v-show="visible && urls.length > 1" class="page-tools">
      <div class="page-previous" @click="handlePrevious"><BaseIcon name="next" flip="horizontal"></BaseIcon></div>
      <div class="page-next" @click="handleNext"><BaseIcon name="next"></BaseIcon></div>
      <div class="page-text">第 {{curIndex + 1}} 张，共 {{urls.length}} 张</div>
    </div>
    <div v-show="visible" class="close" @click="close"><BaseIcon name="close"></BaseIcon></div>
  </div>
</template>
<script>
import Spinner from '@/components/base/spinner'

export default {
  name: 'ImageViewer',
  components: {
    Spinner
  },
  props: {
    // 是否显示弹框
    value: {
      type: Boolean,
      default: false
    },
    // 图片地址
    url: {
      type: [String, Array],
      required: true
    }
  },
  data () {
    return {
      // 当前显示图片的索引
      curIndex: 0,
      // 是否显示
      visible: this.value,
      // 图片是否加载完成
      loaded: false,
      // 图片是否加载失败
      failed: false,
      // 图片原始宽度
      rawWidth: null,
      // 图片原始高度
      rawHeight: null,
      // 初始缩放比
      rawScale: 1,
      // 缩放比
      scale: 1,
      // 旋转角度
      rotate: 0,
      // 鼠标按下事件处理方法
      mousedownHandler: null,
      // 鼠标移动事件处理方法
      mousemoveHandlers: [],
      // 鼠标抬起事件处理方法
      mouseupHandlers: [],
      // 鼠标滚轮滚动事件
      mouseScrollHandler: null
    }
  },
  computed: {
    // 图片宽度
    width () {
      return this.rawWidth === null ? null : this.rawWidth * this.scale
    },
    // 图片高度
    height () {
      return this.rawHeight === null ? null : this.rawHeight * this.scale
    },
    // 图片样式
    style () {
      return {
        width: this.width ? `${this.width}px` : 'auto',
        height: this.height ? `${this.height}px` : 'auto',
        transformOrigin: 'center',
        transform: `translate(-50%, -50%) rotate(${this.rotate}deg)`
      }
    },
    // 图片数组
    urls () {
      return typeof this.url === 'string' ? [this.url] : this.url
    }
  },
  watch: {
    value (val) {
      this.visible = val
    }
  },
  mounted () {
    this.initScale()
    this.initScroll()
    this.initImageDrag()
  },
  beforeDestroy () {
    this.mousemoveHandlers && this.mousemoveHandlers.forEach((mousemoveHandler) => {
      document.removeEventListener('mousemove', mousemoveHandler)
    })
    this.mouseupHandlers && this.mouseupHandlers.forEach((mouseupHandler) => {
      document.removeEventListener('mouseup', mouseupHandler)
    })
    if (this.$refs.image && this.mousedownHandler) {
      this.$refs.image.removeEventListener('mousedown', this.mousedownHandler)
    }
    if (this.$refs.imageWrapper && this.mouseScrollHandler) {
      this.$refs.imageWrapper.removeEventListener('mousewheel', this.mouseScrollHandler)
    }
  },
  methods: {
    // 初始化缩放倍数
    initScale () {
      let currentIndex = this.curIndex
      let image = new Image()
      image.src = this.urls[this.curIndex]
      image.onload = (event) => {
        if (this.curIndex !== currentIndex) {
          return
        }
        this.loaded = true

        let img = {}
        if (event.srcElement) { // IE
          img = event.srcElement
        } else if (event.path && event.path.length > 0) {
          img = event.path[0]
        }

        let rawWidth = img.naturalWidth
        let rawHeight = img.naturalHeight
        let clientWidth = window.innerWidth
        let clientHeight = window.innerHeight
        let maxWidth = clientWidth - 46 - 46
        let maxHeight = clientHeight - 10 - 46

        let scale = 1
        if (rawWidth * scale > maxWidth) {
          scale = maxWidth / rawWidth
        }
        if (rawHeight * scale > maxHeight) {
          scale = maxHeight / rawHeight
        }
        this.rawWidth = rawWidth
        this.rawHeight = rawHeight
        this.rawScale = scale
        this.scale = scale
      }

      image.onerror = (event) => {
        if (this.curIndex !== currentIndex) {
          return
        }
        this.failed = true
        console.log('图片加载失败', event)
      }
    },
    // 图片位置修正
    fixPosition (left, top) {
      let obj = this.$refs.image
      let wrapper = this.$refs.imageWrapper
      if (!obj || !wrapper) {
        console.warn('无法获取 this.$refs.image 或者 this.$refs.imageWrapper ')
        return
      }
      let vm = this
      if (typeof left === 'undefined') {
        let leftStr = obj.style.left.replace('px', '')
        left = Number(leftStr)
      }
      if (typeof top === 'undefined') {
        let topStr = obj.style.top.replace('px', '')
        top = Number(topStr)
      }

      // 边界判断
      let imgWidth = vm.rotate % 180 === 0 ? vm.width : vm.height
      let imgHeight = vm.rotate % 180 === 0 ? vm.height : vm.width
      let wrapperWidth = wrapper.offsetWidth
      let wrapperHeight = wrapper.offsetHeight
      let maxLeft = wrapperWidth >= imgWidth ? 0 : (imgWidth / 2 - wrapperWidth / 2)
      let minLeft = wrapperWidth >= imgWidth ? 0 : (wrapperWidth / 2 - imgWidth / 2)
      let maxTop = wrapperHeight >= imgHeight ? 0 : (imgHeight / 2 - wrapperHeight / 2)
      let minTop = wrapperHeight >= imgHeight ? 0 : (wrapperHeight / 2 - imgHeight / 2)
      left = left > maxLeft ? maxLeft : left
      left = left < minLeft ? minLeft : left
      top = top > maxTop ? maxTop : top
      top = top < minTop ? minTop : top
      // console.log(`maxLeft=${maxLeft},minLeft=${minLeft},maxTop=${maxTop},minTop=${minTop}`)

      // 修改box1的坐标
      obj.style.left = left + 'px'
      obj.style.top = top + 'px'
    },
    // 放大
    handleScalePlus () {
      this.scale = this.scale * 1.2
      this.$nextTick(() => this.fixPosition())
    },
    // 缩小
    handleScaleMinus () {
      let newScale = this.scale * 0.8
      if (newScale - this.rawScale * 0.2 > 0) {
        this.scale = newScale
        this.$nextTick(() => this.fixPosition())
      }
    },
    // 左旋转
    handleRotateLeft () {
      this.rotate -= 90
      this.$nextTick(() => this.fixPosition())
    },
    // 右旋转
    handleRotateRight () {
      this.rotate += 90
      this.$nextTick(() => this.fixPosition())
    },
    // 初始化滚轮事件（滚轮滚动时，图片放大缩小）
    initScroll () {
      let wrapper = this.$refs.imageWrapper
      const mouseScrollHandler = (event) => {
        event.preventDefault()
        if (event.wheelDelta > 0 || event.detail < 0) {
          this.handleScalePlus()
        } else {
          this.handleScaleMinus()
        }
        return false
      }
      wrapper.addEventListener('mousewheel', mouseScrollHandler)
      this.mouseScrollHandler = mouseScrollHandler
    },
    // 初始化图片拖动事件
    initImageDrag () {
      const vm = this
      let obj = this.$refs.image
      const mousedownHandler = function (event) {
        if (!vm.loaded) return
        // 在火狐中不支持setCapture()和releaseCapture()两个方法但是调用时，他不会报错。
        // 在chrome中也不支持这两个方法，但是调用的时候会报错
        // 开启全局捕获：使box1可以捕获到所有的事件，解决IE低版本浏览器默认行为问题
        obj.setCapture && obj.setCapture()

        // 处理事件对象
        event = event || window.event

        // 获得开始时元素的偏移
        var eleOffset = {
          left: obj.offsetLeft,
          top: obj.offsetTop
        }
        // 获得开始时鼠标的位置
        var startPoint = {
          x: event.clientX,
          y: event.clientY
        }

        // 当该事件触发时开始拖拽
        // 2.当鼠标移动时，被拖拽的元素跟随鼠标移动 onmousemove
        // 为document绑定一个onmousemove
        const mousemoveHandler = function (event) {
          event.preventDefault()
          // console.log('mousemove')

          // 处理事件对象
          event = event || window.event
          // 当前鼠标位置
          var nowPoint = {
            x: event.clientX,
            y: event.clientY
          }
          // 获取鼠标的坐标
          var left = eleOffset.left + (nowPoint.x - startPoint.x)
          var top = eleOffset.top + (nowPoint.y - startPoint.y)

          vm.fixPosition(left, top)
        }
        document.addEventListener('mousemove', mousemoveHandler)
        vm.mousemoveHandlers.push(mousemoveHandler)

        // 3.当鼠标松开时，被拖拽元素固定在当前位置 onmouseup
        // 绑定一个 onmouseup
        const mouseupHandler = function () {
          event.preventDefault()
          // 当鼠标松开，使元素固定，使其不随鼠标移动
          // 取消document的mousemove事件
          vm.mousemoveHandlers.forEach((mousemoveHandler) => {
            document.removeEventListener('mousemove', mousemoveHandler)
          })
          // 取消document的onmouseup事件
          vm.mouseupHandlers.forEach((mouseupHandler) => {
            document.removeEventListener('mouseup', mouseupHandler)
          })

          // 释放全局捕获(注意：用obj开始，用document释放)
          document.releaseCapture && document.releaseCapture()
        }
        document.addEventListener('mouseup', mouseupHandler)
        vm.mouseupHandlers.push(mouseupHandler)

        // 当处理拖拽行为时，如果同时选中了文字，由于浏览器的默认行为，会同时将文字一起拖拽
        // 如果不需要这个行为，可以在函数的最后取消默认行为即可
        // 但是这个办法不适用于ie8
        return false
      }
      obj.addEventListener('mousedown', mousedownHandler)
      vm.mousedownHandler = mousedownHandler
    },
    // 上一张
    handlePrevious () {
      if (this.urls.length > 1) {
        this.curIndex = this.curIndex <= 0 ? (this.urls.length - 1) : (this.curIndex - 1)
        this.reset()
      }
    },
    // 下一张
    handleNext () {
      if (this.urls.length > 1) {
        this.curIndex = this.curIndex >= (this.urls.length - 1) ? 0 : (this.curIndex + 1)
        this.reset()
      }
    },
    // 重置图片
    reset () {
      this.loaded = false
      this.failed = false
      this.rotate = 0
      this.initScale()
      this.$nextTick(() => this.fixPosition(0, 0))
    },
    // 关闭
    close () {
      this.visible = false
      this.$emit('input', this.visible)
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
.image-viewer {
  position: fixed;
  z-index: 2000;
  .popup-mask{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.7);
    transition: all .3s ease;
  }
  .image-wrap {
    position: fixed;
    top: 10px;
    left: 46px;
    right: 46px;
    bottom: 46px;
    overflow: hidden;
    .image-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .drawable-image{
        position: absolute;
        background-color: #FFF;
        user-select: none;
      }
    }
  }

  .image-tools {
    position: fixed;
    left: 50%;
    bottom: 0;
    z-index: 2000;
    color: #FFF;
    font-size: 20px;
    transform: translate(-50%, 0);
    .image-tool {
      float: left;
      padding: 10px;
      cursor: pointer;
      user-select: none;
      cursor: pointer;
    }
  }

  .loading-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .loading, .failed {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: $bg-color-black;
      border-radius: 10px;
      width: 160px;
      height: 160px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      user-select: none;
    }
    .loading {
      .loading-text {
        margin-top: 15px;
        color: #FFF;
      }
      animation: fadeIn .5s ease-in;
    }
    .failed {
      .failed-icon {
        color: $color-danger;
        font-size: 42px;
      }
      .failed-text {
        margin-top: 10px;
        color: #FFF;
      }
    }
  }

  .page-tools {
    .page-previous, .page-next {
      position: fixed;
      top: 50%;
      width: 46px;
      height: 46px;
      transform: translate(0, -75%);
      font-size: 46px;
      color: #FFF;
      user-select: none;
      cursor: pointer;
    }
    .page-previous {
      left: 0;
    }
    .page-next {
      right: 0;
    }
    .page-text {
      color: #FFF;
      position: fixed;
      bottom: 14px;
      right: 46px;
      font-size: 18px;
    }
  }

  .close {
    position: fixed;
    top: 16px;
    right: 16px;
    cursor: pointer;
    color: #FFF;
    font-size: 16px;
  }

  .img-pop-enter-active, .img-pop-leave{
    transform: scale(1);
    opacity: 1;
  }
  .img-pop-enter, .img-pop-leave-active{
    transform: scale(.5);
    opacity: 0;
  }
  .img-mask-leave-active{
    opacity: 0;
  }
  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
