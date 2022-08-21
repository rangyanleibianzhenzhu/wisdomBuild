<template>
  <div class="checkbox-item" @click="doSelect()">
    <input type="checkbox" :id="checkboxName" :name="checkboxName" v-model="currentValue" :disabled="disabled"/>
    <span class="item-bar">
        <span class="input-icon">
          <BaseIcon name="tick" class="tick-icon"></BaseIcon>
        </span>
        <span class="input-span"><slot></slot></span>
    </span>
  </div>
</template>
<script>
export default {
  name: 'BaseCheckbox',
  props: {
    // 当前是否选中
    value: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentValue: this.value,
      checkboxName: 'checkbox-' + Math.random().toString(36).substring(3, 6)
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    }
  },
  methods: {
    doSelect () {
      if (this.disabled) return
      this.currentValue = !this.currentValue
      this.$emit('input', this.currentValue)
      this.$emit('change', this.currentValue)
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
$checkbox-height: $base-font-size;

.checkbox-item{
  display: inline-block;
  position: relative;
  margin-right: 20px;
  input {
    position: absolute;
    top: 50%;
    left: -100000px;
    width: 1em;
    height: 1em;
    transform: translate(0, -50%);
    font-size: inherit;
    &:checked + .item-bar {
      .input-icon {
        @include primary-background-color();
        @include primary-border-color();
        svg{
          opacity: 1;
        }
      }
    }
    &:disabled + .item-bar {
      cursor: not-allowed;
      .input-span {
        color: #999;
      }
      .input-icon{
        background-color: $bg-color-base;
      }
    }
    &:disabled:checked + .item-bar {
      .input-icon{
        background-color: $bg-color-base;
        border-color: $input-border-color;
        color: $color-text-placeholder;
      }
    }
  }
  .item-bar{
    display: inline-block;
    white-space: nowrap;
    line-height: $checkbox-height;
    cursor: pointer;
    .input-icon{
      color: #FFF;
      padding: 1px 0;
      display: inline-block;
      width: $checkbox-height;
      height: $checkbox-height;
      line-height: $checkbox-height;
      vertical-align: top;
      text-align: center;
      border: solid 1px $input-border-color;
      border-radius: 3px;
      font-size: $checkbox-height - 4px;
      svg{
        opacity: 0;
        line-height: 1;
        vertical-align: top;
      }
    }
    .input-span {
      margin-left: 10px;
      line-height: $checkbox-height;
      vertical-align: top;
      color: $color-text-regular;
    }
  }
}
</style>
// 下面注释勿删，用于根据配置文件 isMobile 配置项判断是否支持移动端，如果不支持，注释掉该样式
/* [auto html command START {isMobile=false}] */
<style lang="scss" scoped>
@media (max-width: $max-mobile-width) {
  $checkbox-height: $base-font-size * 2;
  .checkbox-item{
    font-size: $checkbox-height;/*yes*/
    .item-bar{
      .input-icon{
        width: $checkbox-height;
        height: $checkbox-height;
        line-height: $checkbox-height;
        font-size: $checkbox-height - 8px;/*yes*/
      }
    }
  }
}
</style>
/* [auto html command END {isMobile=false}] */
