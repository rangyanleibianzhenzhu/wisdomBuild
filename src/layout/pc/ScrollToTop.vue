<template>
<div v-show="show" class="scroll-to-top" @click="toTop" ref="toTopNode">
  <BaseIcon name="top" class="top-icon"></BaseIcon>
</div>
</template>
<script>
import {debounce, throttle} from '@/assets/js/utils'
import animate from '@/assets/js/animate'
export default {
  name: 'ScrollToTop',
  data () {
    return {
      show: false,
      debounceScrollHandle: debounce(this.scrollHandle),
      scrollContainer: null
    }
  },
  mounted () {
    this.scrollContainer = this.$refs.toTopNode.parentNode
    this.scrollContainer.addEventListener('scroll', this.debounceScrollHandle)
  },
  beforeDestroy () {
    this.scrollContainer.removeEventListener('scroll', this.debounceScrollHandle)
  },
  methods: {
    toTop: throttle(function () {
      let curTop = this.scrollContainer.scrollTop
      animate.start(500, 'easeOutCubic', (value, percentComplete) => {
        this.scrollContainer.scrollTop = curTop * (1 - value)
      })
    }, 2000),
    scrollHandle () {
      this.show = this.scrollContainer.scrollTop > 400
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
.scroll-to-top{
  @include primary-background-color();
  position: fixed;
  right: 15px;
  bottom: 10px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 50%;
  text-align: center;
  opacity: .5;
  cursor: pointer;
  .top-icon{
    color: #FFF;
    font-size: 20px;
    vertical-align: middle;
  }
}
</style>
