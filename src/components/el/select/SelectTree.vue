<template>
  <span v-if="readonly">{{ curLabel }}</span>
  <BaseSelect v-else ref="select" popper-class="common-select-tree-dropdown"
              :value="curValue"
              :clearable="clearable"
              :disabled="disabled"
              @clear="handleSelectClear">
    <BaseOption :value="curValue" :label="curLabel">
      <BaseTree ref="tree"
                show-checkbox
                check-on-click-node
                check-strictly
                :data="data"
                v-on="$listeners"
                highlight-current
                node-key="id"
                :props="{
                  label: labelKey,
                  children: childrenKey
                }"
                :default-checked-keys="defaultCheckedKeys"
                :default-expanded-keys="defaultCheckedKeys"
                @check="handleChange">
      </BaseTree>
    </BaseOption>
  </BaseSelect>
</template>
<script>
import { BaseSelect, BaseOption, BaseTree } from './index.js'

export default {
  name: 'selectTree',
  components: {
    BaseSelect,
    BaseOption,
    BaseTree
  },
  props: {
    // 树的展示数据
    data: {
      type: Array,
      default: () => []
    },
    // 当前值
    value: [Number, String],
    // 当前值对应的标签
    label: String,
    // 标签的属性名
    labelKey: {
      type: String,
      default: 'label'
    },
    // 子树的属性名
    childrenKey: {
      type: String,
      default: 'children'
    },
    // 是否可以清空选项
    clearable: {
      type: Boolean,
      default: false
    },
    // 是否不可用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否只读（如果为true, 只显示标签文字）
    readonly: Boolean
  },
  data () {
    return {
      // 当前值
      curValue: this.value,
      // 当前标签
      curLabel: this.label
    }
  },
  computed: {
    // 默认选中的主键数组
    defaultCheckedKeys () {
      if (this.value !== undefined && this.value !== null) {
        return [this.value]
      } else {
        return []
      }
    }
  },
  created () {
    if (this.curValue !== undefined && this.curValue !== null && !this.curLabel) {
      this.curLabel = this.searchLabel(this.curValue, this.data) || ''
    }
  },
  methods: {
    // 根据值查找标签
    searchLabel (val, dataList) {
      if (dataList && dataList instanceof Array) {
        for (let i = 0; i < dataList.length; i++) {
          let item = dataList[i]
          if (item && item.id === val) {
            return item[this.labelKey]
          }
          if (item[this.childrenKey]) {
            let label = this.searchLabel(val, item[this.childrenKey])
            if (label) {
              return label
            }
          }
        }
      }
    },
    // 隐藏弹出框
    hiddenPopper () {
      this.$refs.select.blur()
    },
    handleChange (data, nodes) {
      if (!data.children) {
        this.$refs.tree.setCheckedKeys([data.id])
        let value = data.id
        let label = data[this.labelKey]
        if (value !== this.curValue) {
          this.$emit('input', value)
          this.$emit('change', value, label, data)
          this.curValue = value
          this.curLabel = label
        }
        setTimeout(() => {
          this.hiddenPopper()
        }, 300)
      } else {
        let checkedKeys = (this.curValue === null || this.curValue === undefined) ? [] : [this.curValue]
        this.$refs.tree.setCheckedKeys(checkedKeys)
      }
    },
    // 清空
    handleSelectClear () {
      this.curValue = null
      this.curLabel = ''
      this.$refs.tree.setCheckedKeys([])
      this.$emit('input', null)
      this.$emit('change', null, '')
    }
  }
}
</script>
<style lang="scss" px2rem="false">
.common-select-tree-dropdown {
  .el-select-dropdown__item {
    height: auto;
    background-color: #FFF;
  }
  .el-checkbox {
    display: none;
  }
  .is-leaf+.el-checkbox {
    display: block;
  }
}

/* 兼容 IE9 */
[ie-version="9"] .common-select-tree-dropdown {
  .el-tree-node__content {
    zoom: 1;
    height: 34px;
    &:before, &:after {
      content: " ";
      display: table;
      clear: both;
    }
    .el-tree-node__expand-icon {
      float: left;
      margin-top: 6px;
    }
    .el-checkbox {
      float: left;
    }
    .el-tree-node__label {
      float: left;
    }
  }
}
</style>
