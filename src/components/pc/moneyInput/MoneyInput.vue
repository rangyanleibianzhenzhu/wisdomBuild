<template>
  <div class="money-input-wrap" :class="{'show-icon': icon}">
    <template v-if="readonly">
      <span>{{ currentValue | money(currentDecimal) }}</span>
    </template>
    <template v-else>
      <div class="money-input">
        <input ref="rawInput" class="money-raw-input"
                  :value="currentValue"
                  @change="handleChange($event)"
                  maxlength="15"
                  :disabled="disabled"
                  :data-canRound="canRound"
                  :data-canNegative="canNegative">
        <div class="money-show" :class="disabled ? 'disabled-input' : ''">{{currentValue | money(currentDecimal)}}</div>
      </div>
      <div v-if="suffixText || icon" class="money-suffix-wrap">
        <span v-if="suffixText" class="money-suffix-text">{{suffixText}}</span>
        <BaseIcon v-else class="money-icon" :name="iconName"></BaseIcon>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'MoneyInput',
  props: {
    // 当前值
    value: Number,
    // 小数部分位数
    decimal: {
      type: Number,
      default: 2
    },
    // 是否四舍五入
    canRound: {
      type: Boolean,
      default: false
    },
    // 是否允许负数
    canNegative: {
      type: Boolean,
      default: true
    },
    // 后缀文字
    suffixText: {
      type: String
    },
    // 是否显示图标
    icon: {
      type: [Boolean, String],
      default: 'rmb'
    },
    // 是否可用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentValue: this.value,
      currentDecimal: this.decimal
    }
  },
  computed: {
    iconName () {
      if (typeof this.icon === 'string') {
        return this.icon
      }
      return 'rmb'
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    }
  },
  methods: {
    handleChange (event) {
      let val = event.target.value
      let numVal = Number(val)
      if (val === '' || isNaN(numVal)) {
        this.currentValue = null
        this.$emit('input', null)
        this.$emit('change', null)
        this.$refs.rawInput.value = ''
      } else {
        if (!this.canNegative && numVal < 0) { // 不允许为负数
          numVal = Math.abs(numVal)
        }
        if (!this.canRound) { // 不允许四舍五入
          let numArray = numVal.toString().split('.')
          let intStr = numArray[0] // 整数部分字符串
          let decimalStr = numArray.length >= 2 ? numArray[1] : 1 // 小数部分字符串
          if (decimalStr.length > this.decimal) {
            let newValueStr = intStr + '.' + decimalStr.substr(0, this.decimal)
            numVal = Number(newValueStr)
          }
        } else {
          numVal = this.fixDecimal(numVal, this.decimal) // 修正小数点位数
        }
        this.currentValue = numVal
        this.$emit('input', numVal)
        this.$emit('change', numVal)
      }
    },
    // 修正小数点位数
    fixDecimal (num, decimal) {
      let number = parseFloat(num)
      if (num !== undefined && num !== null && num !== '' && !isNaN(number)) {
        return parseFloat(number.toFixed(decimal))
      }
      return num
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
$icon-width: 24px;
.money-input-wrap {
  display: table;
  width: 100%;
  height: $form-item-height;
  .money-input {
    display: table-cell;
    position: relative;
    width: 100%;
    .money-raw-input {
      position: absolute;
      top: 0;
      width: 100%;
      border: 1px solid $border-color-base;
      vertical-align: middle;
      border-radius: 4px;
      font-size: 14px;
      color: $input-font-color;
      opacity: 0;
      z-index: 1;
      &:disabled {
        background-color: $input-disabled-bg-color;
        cursor: not-allowed;
      }
      &:focus {
        @include primary-border-color();
        opacity: 1;
        &+input.money-show {
          opacity: 0;
        }
      }
    }
    .money-show {
      position: absolute;
      top: 0;
      width: 100%;
      height: $form-item-height;
      line-height: $form-item-height - 2px;
      vertical-align: middle;
      padding: 0 5px;
      overflow: hidden;
      color: $color-text-regular;
      background-color: #FFF;
      border: 1px solid $border-color-base;
      border-radius: 4px;
      &.disabled-input {
        background-color: $input-disabled-bg-color;
        cursor: not-allowed;
      }
    }
  }
  .money-suffix-wrap {
    display: table-cell;
    min-width: 24px;
    padding: 0 5px;
    height: $form-item-height;
    vertical-align: middle;
    text-align: center;
    color: $color-text-placeholder;
    background-color: $bg-color-base;
    border: solid 1px $border-color-base;
    border-left: 0;
    border-radius: 0 4px 4px 0;
    .money-suffix-text {
      word-break: keep-all;
      white-space:nowrap;
    }
  }
  &.show-icon {
    .money-raw-input, .money-show {
      padding-right: 0;
      border-radius: 4px 0 0 4px;
    }
  }
}
</style>
