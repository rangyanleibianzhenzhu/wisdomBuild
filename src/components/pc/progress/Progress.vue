<template>
  <div
    role="progressbar"
    :aria-valuenow="percentage"
    aria-valuemin="0"
    aria-valuemax="100"
    :class="['progress', 'progress--line', status && 'is-'+status, type == 'line' && textInside && 'progress--text-inside']"
  >
    <div class="progress-bar">
      <div class="progress-bar__outer" :style="{height: strokeWidth+'px'}">
        <div class="progress-bar__inner" :style="{width: percentage+'%',backgroundColor: colorStyle}">
          <div class="progress-bar__innerText" v-if="textInside">{{percentage+'%'}}</div>
        </div>
      </div>
    </div>
    <div class="progress__text" style="font-size: 14.4px" v-if="!textInside">
      <template v-if="!status">{{format ? format(percentage) : percentage+'%'}}</template>
      <BaseIcon :name="status" v-else></BaseIcon>
    </div>
  </div>
</template>
<script>
export default {
  name: "Progress",
  components: {},
  props: {
		// 百分比（必填） 0-100
		percentage: {
      type: Number,
      default: 0
    },
    // 进度条当前状态 success/error/warn
		status: String, 
    // 指定进度条文字内容
		format: Function, 
    // 进度条显示文字内置在进度条内（只在 type=line 时可用）
    textInside: {
      type: Boolean,
      default: false
    },
    // 进度条的宽度，单位 px
    strokeWidth: {
      type: Number,
      default: 6
    },
    // 进度条类型 line/circle/dashboard
    type: {
      type: String,
      default: 'line'
    },
    // 进度条背景色（会覆盖 status 状态颜色）string/function/array
    color: [String, Function, Array]
	},
  data() {
    return {};
  },
  computed: {
    colorStyle () {
      if(typeof(this.color) == 'function'){
        return this.color(this.percentage)
      }else if(Array.isArray(this.color)){
        for(let i=0; i<this.color.length; i++){
          if(this.color[i].percentage == this.percentage){
            return this.color[i].color
          }
        }
      }
    }
  },
  methods: {},
};
</script>
<style lang="scss" scoped px2rem="false">
.progress{
  position: relative;
  line-height: 1;
  &.progress--line{
    width: 350px;
    margin-bottom: 15px;
  }
  .progress-bar{
    padding-right: 50px;
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    margin-right: -55px;
    box-sizing: border-box;
    .progress-bar__outer{
      height: 6px;
      border-radius: 100px;
      background-color: #ebeef5;
      overflow: hidden;
      position: relative;
      vertical-align: middle;
      .progress-bar__inner{
        width: 50%;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        background-color: #409eff;
        text-align: right;
        border-radius: 100px;
        line-height: 1;
        white-space: nowrap;
        transition: width .6s ease;
        &::after{
          display: inline-block;
          content: "";
          height: 100%;
          vertical-align: middle;
        }
        .progress-bar__innerText{
          display: inline-block;
          vertical-align: middle;
          color: #fff;
          font-size: 12px;
          margin: 0 5px;
        }
      }
    }
  }
  &.is-success{
    .progress-bar__inner{
      background-color: #67c23a !important;
    }
  }
  &.is-warn{
    .progress-bar__inner{
      background-color: #e6a23c !important;
    }
  }
  &.is-error{
    .progress-bar__inner{
      background-color: #f56c6c !important;
    }
  }
  .progress__text{
    font-size: 14.4px;
    color: #606266;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    line-height: 1;
  }
}
</style>
