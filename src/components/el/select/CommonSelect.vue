<template>
  <div class="common-el-select" :data-value="currentValue">
    <span v-if="readonly" class="item-readonly-value">{{ readOnlyText }}</span>
    <div v-else-if="flat" class="flat-select">
      <span class="flat-select-option" :class="{selected:item.selected}" v-for="item in selectOptions" :key="item.value"
            @click="handleFlatItemSelect(item)">
        {{item.label}}
      </span>
    </div>
    <BaseSelect v-else ref="select" v-bind="$attrs" v-model="currentValue" :disabled="disabled"
                :multiple="multiple" :class="{'show-select-all': isShowSelectAll, 'show-multi-status-icon': showMultiStatusIcon}"
                @change="handleChange($event)"
                @input="handleInput">
      <template v-slot:prefix v-if="isShowSelectAll && showMultiStatusIcon">
        <div class="prefix">
          <BaseIcon v-if="isSelectAll" class="prefix-icon" name="select-all"></BaseIcon>
          <BaseIcon v-else-if="isSelectNone" class="prefix-icon" name="select-none"></BaseIcon>
          <BaseIcon v-else class="prefix-icon" name="select-half"></BaseIcon>
        </div>
      </template>
      <template v-slot:default>
        <div class="dropdown-content" :class="isShowSelectAll ? 'dropdown-show-select-all' : ''">
          <BaseOption v-for="item in selectOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled">
          </BaseOption>
          <div v-if="isShowSelectAll" class="button-option">
            <BaseButton type="primary" size="xs" @click="handleSelectAll">全选</BaseButton>
            <BaseButton size="xs" @click="handleClear">清空</BaseButton>
          </div>
        </div>
      </template>
    </BaseSelect>
  </div>
</template>
<script>
import { BaseSelect, BaseOption } from './index.js'

export default {
  name: 'CommonSelect',
  components: {
    BaseSelect,
    BaseOption
  },
  props: {
    // 当前选择值
    value: [String, Number, Array],
    // 选项数组（如果 type 有值，忽略此属性）
    options: Array,
    // 是否可用
    disabled: Boolean,
    // 是否只读（如果为true, 只显示标签文字）
    readonly: Boolean,
    // 是否增加“全部”选项
    needAll: Boolean,
    // “全部”选项的值
    allValue: {
      type: [String, Number],
      default: ''
    },
    // “全部”选项的名称
    allLabel: {
      type: String,
      default: '全部'
    },
    // 是否将第一项作为默认值
    firstAsDefault: Boolean,
    // 公共选项类型（设置此项时不需要设置 options）
    type: {
      type: String
      /* validator (value) {
        if (!value) {
          return true
        }
        // 这个值必须匹配下列字符串中的一个
        let typeList = [
          'yesNo', // 是否
          'currency', // 币种
          'level' // 级别
        ]
        let valid = typeList.indexOf(value) !== -1
        !valid && console.warn(`CommonSelect 组件的 type 参数，必须是 ${typeList.join('、')} 其中一种`)
        return valid
      } */
    },
    // 选项转换器方法
    //  参数：原始选项数据，例：{ value: '1', label: '选项1' }
    //  返回：新选项数据，例：{ value: 1, label: '选项1' }
    optionConverter: Function,
    // 是否多选
    multiple: Boolean,
    // 是否显示全选按钮（multiple为true时有效）
    showSelectAll: Boolean,
    // 是否显示左侧选择状态的图标（multiple为true时有效）
    showMultiStatusIcon: Boolean,
    // 是否平铺展示
    flat: Boolean
  },
  data () {
    return {
      currentValue: this.value,
      currentOptions: this.options || []
    }
  },
  computed: {
    // 只读状态时要显示的文本
    readOnlyText () {
      let text = this.currentValue
      if (this.selectOptions && this.selectOptions.length > 0) {
        if (this.multiple) { // 如果是多选
          let labels = []
          for (let i = 0; i < this.selectOptions.length; i++) {
            if (this.currentValue.includes(this.selectOptions[i].value)) {
              labels.push(this.selectOptions[i].label)
            }
          }
          text = labels.join(', ')
        } else { // 单选
          for (let i = 0; i < this.selectOptions.length; i++) {
            if (this.currentValue === this.selectOptions[i].value) {
              text = this.selectOptions[i].label
              break
            }
          }
        }
      }
      return text
    },
    // 下拉选项
    selectOptions () {
      let options = []
      if (this.needAll) {
        // 增加“全部”选项
        options.push({ value: this.allValue, label: this.allLabel })
      }
      if (this.currentOptions && this.currentOptions.length > 0) {
        this.currentOptions.forEach(option => {
          options.push({ ...option })
        })
      }

      if (this.optionConverter) { // 如果有选项转换器方法
        options = options.map(this.optionConverter)
      }

      if (this.flat) { // 如果是平铺模式
        options.forEach((item) => {
          let isSelected = false
          if (this.currentValue instanceof Array) {
            isSelected = this.currentValue.indexOf(item.value) > -1
          } else {
            isSelected = this.currentValue === item.value
          }
          item.selected = isSelected
        })
      }
      return options
    },
    // 是否显示全选按钮
    isShowSelectAll () {
      return this.multiple && this.showSelectAll
    },
    // 是否全选
    isSelectAll () {
      if (this.isShowSelectAll &&
        (this.currentOptions && this.currentOptions.length > 0) &&
        (this.currentValue && this.currentValue.length > 0) &&
        this.currentOptions.length === this.currentValue.length) {
        return true
      }
      return false
    },
    // 是否未选择
    isSelectNone () {
      if (this.isShowSelectAll && this.currentValue && this.currentValue.length === 0) {
        return true
      }
      return false
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    },
    options () {
      this.currentOptions = this.options || []
    }
  },
  created () {
    if (this.type) {
      this.initCommonType(this.type)
    } else {
      this.setDefaultValue()
    }
  },
  beforeDestroy () {
    if (this.type) {
      this.$eventBus.$off(`SELECT_OPTIONS_${this.type.toUpperCase()}_READY`, this.optionsChangeHandler)
    }
  },
  methods: {
    // 获取选择的选项（单选返回单个选项对象，多选返回数组）
    getSelectedOptions (val) {
      if (this.multiple) {
        let options = []
        if (val && val.length > 0) {
          for (let i = 0; i < this.selectOptions.length; i++) {
            if (val.indexOf(this.selectOptions[i].value) > -1) {
              options.push(this.selectOptions[i])
              if (options.length >= val.length) { break }
            }
          }
        }
        return options
      } else {
        let option = null
        for (let i = 0; i < this.selectOptions.length; i++) {
          if (this.selectOptions[i].value === val) {
            option = this.selectOptions[i]
            break
          }
        }
        return option
      }
    },
    // 处理 change 事件
    handleChange (val) {
      this.$emit('change', val, this.getSelectedOptions(val))
    },
    // 处理 input 事件
    handleInput (val) {
      this.currentValue = val
      this.$emit('input', val)
    },
    // 全选(多选时)
    handleSelectAll () {
      if (this.multiple) {
        let val = this.currentOptions.map((item) => {
          return item.value
        })
        this.currentValue = val
        this.$emit('input', val)
        this.$emit('change', val)
      }
    },
    // 清空（多选时）
    handleClear () {
      if (this.multiple) {
        let val = []
        this.currentValue = val
        this.$emit('input', val)
        this.$emit('change', val)
      }
    },
    // 初始化公共 Select 选项
    initCommonType (type) {
      const optionName = type + 'Options'
      const loadStatus = this.$store.getters.loadStatusMap[optionName]
      if (loadStatus === 'not-start') {
        this.$store.dispatch('queryOptions', { type, vm: this }).then(data => {
          this.currentOptions = data
          this.setDefaultValue()
        })
      } else if (loadStatus === 'loaded') {
        this.currentOptions = this.$store.getters[optionName]
        this.setDefaultValue()
      } else if (loadStatus === 'loading') {
        this.$eventBus.$onReady(`SELECT_OPTIONS_${type.toUpperCase()}_READY`, (options) => {
          this.currentOptions = options
          this.setDefaultValue()
        })
      } else {
        console.error(`store/modules/select.js 未定义 ${type} 下拉类型对应的state： ${type + 'Options'}`)
      }
      this.$eventBus.$on(`SELECT_OPTIONS_${type.toUpperCase()}_CHANGE`, this.optionsChangeHandler)
    },
    // 选项改变时处理事件
    optionsChangeHandler (options) {
      this.currentOptions = options
      this.setDefaultValue()
    },
    // 设置默认值
    setDefaultValue () {
      const options = this.currentOptions
      // 将第一项设置为默认值
      if (this.firstAsDefault && options && options.length > 0 && (this.currentValue === undefined || this.currentValue === null || this.currentValue === '')) {
        this.handleInput(options[0].value)
      }
    },
    // 处理平铺选项选中事件
    handleFlatItemSelect (option) {
      if (this.multiple) { // 如果是多选
        let type = 'add' // 操作类型：add, move
        if (this.currentValue instanceof Array) {
          let index = this.currentValue.indexOf(option.value)
          if (index === -1) {
            this.currentValue.push(option.value)
          } else {
            type = 'remove'
            this.currentValue.splice(index, 1)
          }
        } else {
          this.currentValue = [option.value]
        }
        let selectedOptions = this.getSelectedOptions(this.currentValue)
        this.$emit('input', this.currentValue)
        this.$emit('change', this.currentValue, selectedOptions, option, type)
      } else { // 单选
        this.currentValue = option.value
        this.$emit('input', option.value)
        this.$emit('change', option.value, option)
      }
    }
  }
}
</script>
<style lang="scss" px2rem="false" scoped>
.common-el-select {
  .el-select {
    &.show-select-all.show-multi-status-icon {
      ::v-deep.el-select__tags {
        padding-left: 25px;
        max-width: 100% !important;
      }
      .prefix {
        width: 25px;
        height: 100%;
        line-height: 32px;
        text-align: center;
        .prefix-icon {
          font-size: 15px;
          vertical-align: middle;
        }
      }
    }
  }

  .flat-select {
    line-height: $form-item-height;
    .flat-select-option {
      white-space:nowrap;
      margin-right: 20px;
      cursor: pointer;
      transition: color 0.15s ease-in;
      &:last-of-type {
        margin-right: 0;
      }
      &.selected {
        color: $color-primary;
      }
    }
  }
}
.el-select-dropdown {
  .dropdown-content {
    &.dropdown-show-select-all {
      min-width: 160px;
      padding-bottom: 35px;
      .button-option {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 16px;
        background-color: #FFF;
        border-top: solid 1px $border-color-base;
        border-radius: 0 0 4px 4px;
        button {
          margin: 0 4px;
        }
      }
    }
  }
}
</style>
