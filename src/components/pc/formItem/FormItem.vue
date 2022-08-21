<template>
  <div ref="formItem" class="form-item" :class="formItemClass" :style="formItemStyle">
    <label ref="formItemLabel" class="form-item-label" :class="'label-size-' + labelSize">
      <slot name="label"><i v-if="required" class="required">*</i><span>{{label}}{{labelColon ? '：' : ''}}</span></slot>
    </label>
    <div ref="formItemValue" class="form-item-value"><slot name="default"></slot></div>
    <div ref="formItemError" class="error">
      <div class="error-wrap" v-if="error && error.length > 0">
        <div class="icon-wrapper"><BaseIcon name="warn"></BaseIcon></div>
        <div class="tip-wrapper"><div class="tip" v-html="errorMsg"></div></div>
      </div>
    </div>
  </div>
</template>
<script>
// 错误信息中 {{label}} 格式参数的正则
const labelParamReg = /{{label}}/g

export default {
  name: 'FormItem',
  props: {
    // 总分栏数
    columns: {
      type: Number,
      default: 12
    },
    /** 表单项大小
     * 1) 当 columns 为 12 时，size值范围：1 到 12；当 columns 为24时，size值范围：1 到 24；
     * 2) 当 columns 为 12 时，size为 12，表示该表单项占一整行；当 columns 为 24 时，size为 24，表示该表单项占一整行
     * 3) 当 columns 为 12 时，如果想要一行布局 3 项， 则 size 应设置为 4 ( 12 / 3 = 4 )
     */
    size: {
      type: Number,
      default: 4
    },
    // 表单项标签是否显示必填样式
    required: {
      type: Boolean,
      default: false
    },
    // 表单项标签名称
    label: String,
    // 表单项标签长度（默认值：5，表示5个字符的宽度）
    labelSize: {
      type: Number,
      default: 5
    },
    // 标签名称后是否加冒号
    labelColon: {
      type: Boolean,
      default: true
    },
    /* 错误信息 */
    error: Array
  },
  mounted () {
    if (window.__ieVersion && window.__ieVersion <= 9) {
      // IE9 浏览器时设置元素样式
      this.setIE9Style()
      window.addEventListener('resize', this.setIE9Style)
    }
  },
  beforeDestroy () {
    if (window.__ieVersion && window.__ieVersion <= 9) {
      window.removeEventListener('resize', this.setIE9Style)
    }
  },
  computed: {
    // 错误信息html字符串（多个错误信息用<br>换行）
    errorMsg () {
      let msg = ''
      if (this.error && this.error instanceof Array) {
        this.error.forEach((errMsg, index) => {
          if (errMsg) {
            // 将错误信息中 {{label}} 参数替换为当前表单项的 label 属性值
            let resultMsg = errMsg.replace(labelParamReg, this.label || '')
            msg += index === 0 ? resultMsg : '<br>' + resultMsg
          }
        })
      }
      return msg
    },
    // 计算 formItem 的样式
    formItemStyle () {
      let style = {}
      style.width = (100 / this.columns * this.size) + '%'
      return style
    },
    formItemClass () {
      let classList = []
      // classList.push(`col-${this.columns}-${this.size}`)
      if (this.error && this.error.length > 0) {
        classList.push('error')
      }
      return classList
    }
  },
  methods: {
    // IE9 浏览器时设置元素样式
    setIE9Style () {
      const itemWidth = this.$refs.formItem.getBoundingClientRect().width
      const labelWidth = this.$refs.formItemLabel.getBoundingClientRect().width
      const errorWidth = this.$refs.formItemError.getBoundingClientRect().width
      const valueWidth = itemWidth - labelWidth - errorWidth - 4 // 4 = marginleft + 1
      this.$refs.formItemValue.style.width = valueWidth + 'px'

      let valueComponent = this.$refs.formItemValue.firstChild
      if (valueComponent) {
        let valueHeight = this.$refs.formItemValue.getBoundingClientRect().height
        let valueComponentHeight = valueComponent.getBoundingClientRect().height
        valueComponent.style.marginBottom = ((valueHeight - valueComponentHeight) / 2) + 'px'
        valueComponent.style.display = 'block'
      }
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
$error-icon-width: 18px;
.form-item {
  .error {
    position: relative;
    flex: none;
    margin-left: 3px;
    width: $error-icon-width;
    height: $form-item-height;
    &:hover {
      .error-wrap .tip-wrapper {
        display: block;
      }
    }
    .error-wrap {
      display: block;
      width: 100%;
      height: 100%;
      .icon-wrapper {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        color: $color-danger;
        /* background-image: url("../../../assets/img/error-icon.png") no-repeat center center; */
      }
      .tip-wrapper {
        display: none;
        position: absolute;
        width: 200px;
        padding-top: 1px;
        top: $form-item-height;
        left: -173px;
        z-index: 9;
        animation: showTip 0.5s;
        .tip {
          position: relative;
          padding: .5em;
          color: $color-danger;
          border: 1px solid #E2D0D0;
          border-radius: 3px;
          background-color: #ffeaea;
          // box-shadow: 0 1px 4px rgba(0,0,0,.5);
          box-shadow: 0 1px 6px 0 rgba(0,0,0,.1);
          line-height: 1.5;
          &:before{
            content: "";
            position: absolute;
            top: -.36em;
            right: 1em;
            padding: .35em;
            background: inherit;
            border: inherit;
            border-right: 0;
            border-bottom: 0;
            transform: rotate(45deg);
          }
        }
      }
    }
  }
}

[ie-version="9"] {
  .form-item {
    float: left;
    zoom: 1;
    &:before, &:after {
      content: " ";
      display: table;
      clear: both;
    }
    .form-item-label {
      float: left;
    }
    .form-item-value {
      float: left;
    }
    .error {
      float: left;
      .icon-wrapper {
        padding-top: ($form-item-height - 16) / 2;
      }
    }
  }
}

@keyframes showTip {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

</style>
