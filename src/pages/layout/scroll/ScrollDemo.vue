<template>
  <div class="base-list">
    <div class="block">
      <div class="block-head">
        <h3>
          <span class="header-text">滚动条</span>
          <AppHelp readme="scroll"></AppHelp>
        </h3>
      </div>
      <div class="block-body">
        <Scroll>
          <div class="content">
            <h1>PC端使用滚动条组件后 textarea 的原生滚动不可用</h1>
            <textarea v-model="remark" name="" id="" cols="30" rows="5"></textarea>
            <h1>1</h1>
            <h1>2</h1>
            <h1>3</h1>
            <h1>4</h1>
            <h1>5</h1>
            <h1>6</h1>
            <h1>7</h1>
            <h1>8</h1>
            <h1>9</h1>
            <h1>10</h1>
          </div>
        </Scroll>
      </div>
    </div>

    <div class="block">
      <div class="block-head">
        <h3>
          <span class="header-text">原生滚动条</span>
        </h3>
      </div>
      <div class="block-body raw-scroll-wrap">
        <div class="content">
          <textarea v-model="remark" cols="30" rows="5"></textarea>
          <h1>1</h1>
          <h1>2</h1>
          <h1>3</h1>
          <h1>4</h1>
          <h1>5</h1>
          <h1>6</h1>
          <h1>7</h1>
          <h1>8</h1>
          <h1>9</h1>
          <h1>10</h1>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppHelp from '@/layout/pc/AppHelp.vue'
import Scroll from '@/components/base/scroll'

export default {
  name: 'ScrollDemoPC',
  components: {
    AppHelp,
    Scroll
  },
  data () {
    return {
      remark: `1
2
3
4
5
6
7
8
9
10`
    }
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped px2rem="false">
.base-list {
  margin: 20px;
  padding: 20px;
  .block {
    margin-bottom: 30px;
    border-radius: 5px;
    background-color: #fff;
    .block-head {
      height: 55px;
      padding: 0 25px;
      vertical-align: middle;
      border-bottom: 1px solid $border-color-light;
      h3 {
        font-size: 17px;
        line-height: 55px;
        .header-text {
          vertical-align: middle;
        }
        .header-right {
          float: right;
          height: 55px;
          padding-top: 7px;
          cursor: pointer;
          .refresh-icon {
            @include primary-font-color();
          }
        }
      }
    }
    .block-body {
      position: relative;
      height: 420px;
      overflow: hidden;
      &.raw-scroll-wrap {
        overflow-y: auto;
      }
      .content {
        padding: 20px;
      }
    }
  }
}
</style>
