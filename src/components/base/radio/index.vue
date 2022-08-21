
<!-- 单选组件 -->
<template>
  <div class="radio-list" :class="disabled ? 'disabled': ''">
    <div v-if="title" class="radio-title">{{title}}</div>
    <div class="radio-item" v-for="option in options" :key="option.value">
      <label>
        <input type="radio" :name="groupName" v-model="currentValue" :disabled="disabled || option.disabled" :value="option.value"/>
        <span class="input-box">
          <span class="input-box-circle"></span>
        </span>
        <span class="input-span">{{option.label}}</span>
      </label>
    </div>
  </div>
</template>
<script>
import { generateUUID } from '@/assets/js/utils.js'
export default {
  name: 'BaseRadio',
  props: {
    // 单选组标题
    title: String,
    /**
     * 单选项目数组
     * 数组中对象示例：{ value: ‘01’， label: '男'， disabled：false}
     *  value： 值
     *  label： 显示的文字
     *  disabled: 是否可用
     **/
    options: {
      type: Array,
      required: true
    },
    // 当前选中值
    value: [String, Number],
    // 是否可用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentValue: this.value,
      groupName: generateUUID()
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    },
    currentValue (val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
$outer-border-color: $border-color-base;
$disable-bg-color: $input-disabled-bg-color;
$disable-inner-dot-color: $color-text-placeholder;
.radio-list{
  .radio-title{
    display: inline-block;
    vertical-align: middle;
    margin: 0 15px;
    color: #333;
  }
  .radio-item{
    position: relative;
    display: inline-block;
    padding: 0 30px 0 0;
    // vertical-align: middle;
    white-space: nowrap;
    &:last-of-type {
      padding-right: 0;
    }
    label {
      display: inline-block;
      align-items: center;
      position: relative;
      cursor: pointer;
      input {
        position: absolute;
        top: 50%;
        left: 0;
        width: 1em;
        height: 1em;
        transform: translate(0, -50%);
        font-size: inherit;
        opacity: 0;
        z-index: 1;
        &:checked + .input-box {
          @include primary-border-color();
          @include primary-background-color();
          &> .input-box-circle {
            width: 4px;
            height: 4px;
            opacity: 1;
          }
        }
        &:disabled {
          & + .input-box {
            border-color: $outer-border-color !important;
            background-color: $disable-bg-color !important;
            cursor: not-allowed;
            .input-box-circle {
              background-color: $disable-inner-dot-color;
            }
            & + .input-span {
              color: #999;
              cursor: not-allowed;
            }
          }
        }
      }
      .input-box {
        box-sizing: border-box;
        position: relative;
        display: inline-block;
        border: solid 1px $outer-border-color;
        border-radius: 50%;
        padding: 0;
        width: 1em;
        height: 1em;
        vertical-align: middle;
        overflow: hidden;
        user-select: none;
        margin-right: 10px;
        margin-top: -3px;
        flex: none;
        &:hover {
          @include primary-border-color();
        }
      }
      .input-box-circle {
        position: absolute;
        display: block;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0;
        height: 0;
        background-color: #FFF;
        border-radius: 50%;
        opacity: 0;
        transition: width 0.15s ease-in, height 0.15s ease-in, margin 0.15s ease-in;
      }
      .input-span{
        display: inline-block;
        // vertical-align: middle;
        color: #666;
      }
    }
  }
  &.disabled {
    cursor: not-allowed;
    label {
      cursor: not-allowed;
    }
  }
}
</style>
// 下面注释勿删，用于根据配置文件 isMobile 配置项判断是否支持移动端，如果不支持，注释掉该样式
/* [auto html command START {isMobile=false}] */
<style lang="scss" scoped>
@media (max-width: $max-mobile-width) {
  .radio-list {
    .radio-title {
      display: block;
      margin: 0;
      padding: 0 40px;
      // background-color: #f5f5f5;
      @include primary-background-color(.03);
    }
    .radio-item {
      display: block;
      padding: 0 40px;
      label {
        display: flex;
        .input-box {
          flex: none;
        }
      }
    }
  }
}
</style>
/* [auto html command END {isMobile=false}] */
