<template>
  <i class="table-status" :class="statusClass"></i>
</template>
<script>
export default {
  name: 'Status',
  props: {
    // 状态字段值
    value: {
      type: [ String, Number, Boolean ],
      default: ''
    },
    // 显示绿色时的状态值
    greenValue: [ String, Number, Boolean ],
    // 显示红色时的状态值
    redValue: [ String, Number, Boolean ],
    // 显示黄色时的状态值
    yellowValue: [ String, Number, Boolean ],
    // 显示主题色时的状态值
    blueValue: [ String, Number, Boolean ],
    // 绿色状态点是否闪烁
    greenActive: Boolean,
    // 红色状态点是否闪烁
    redActive: Boolean,
    // 黄色状态点是否闪烁
    yellowActive: Boolean,
    // 蓝色状态点是否闪烁
    blueActive: Boolean
  },
  data () {
    return {
      currentValue: this.value
    }
  },
  computed: {
    // 计算样式
    statusClass () {
      let classNames = []
      if (this.greenValue !== undefined && this.currentValue === this.greenValue) {
        classNames.push('green-status')
        if (this.greenActive) {
          classNames.push('active')
        }
      }
      if (this.redValue !== undefined && this.currentValue === this.redValue) {
        classNames.push('red-status')
        if (this.redActive) {
          classNames.push('active')
        }
      }
      if (this.yellowValue !== undefined && this.currentValue === this.yellowValue) {
        classNames.push('yellow-status')
        if (this.yellowActive) {
          classNames.push('active')
        }
      }
      if (this.blueValue !== undefined && this.currentValue === this.blueValue) {
        classNames.push('blue-status')
        if (this.blueActive) {
          classNames.push('active')
        }
      }
      return classNames
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
$dot-size: 6px;
.table-status {
  margin-right: 8px;
  margin-top: -3px;
  position: relative;
  display: inline-block;
  width: $dot-size;
  height: $dot-size;
  vertical-align: middle;
  background-color: $color-info;
  border-radius: 50%;
  &.active::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid $color-info;
    content: "";
    animation: antStatusProcessing 1.2s ease-in-out infinite
  }
  &.green-status {
    background-color: $color-success;
    &.active::after {
      border-color: $color-success;
    }
  }
  &.red-status {
    background-color: $color-danger;
    &.active::after {
      border-color: $color-danger;
    }
  }
  &.yellow-status {
    background-color: $color-warning;
    &.active::after {
      border-color: $color-warning;
    }
  }
  &.blue-status {
    background-color: $color-primary;
    &.active::after {
      border-color: $color-primary;
    }
  }
}
@keyframes antStatusProcessing {
  0% {
    transform: scale(.8);
    opacity: .5
  }

  to {
    transform: scale(2.4);
    opacity: 0
  }
}
</style>
