<template>
  <div class="checkbox-group">
    <BaseCheckbox v-for="item in groupOptions" :key="item.value"
                  :value="item.checked"
                  @change="handleChange(item)"
                  :disabled="item.disabled || disabled">{{item.label}}</BaseCheckbox>
  </div>
</template>
<script>
import BaseCheckbox from '@/components/base/checkbox/index.vue'

export default {
  name: 'BaseCheckboxGroup',
  components: {
    BaseCheckbox
  },
  props: {
    // 值
    value: {
      type: Array,
      default: () => []
    },
    /**
     * 选项数组
     * 数组中对象示例：{ value: ‘01’， label: '男'， disabled：false}
     *  value： 值
     *  label： 显示的文字
     *  disabled: 是否可用
     **/
    options: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentValue: this.value ? [...this.value] : []
    }
  },
  computed: {
    groupOptions () {
      return this.options.map((item) => {
        return {
          ...item,
          checked: this.currentValue.indexOf(item.value) !== -1
        }
      })
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    }
  },
  methods: {
    handleChange (item) {
      let index = this.currentValue.indexOf(item.value)
      if (index === -1) {
        this.currentValue.push(item.value)
      } else {
        this.currentValue.splice(index, 1)
      }
      this.$emit('input', this.currentValue)
      this.$emit('change', this.currentValue)
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
.checkbox-group{
  line-height: $form-item-height;
}
</style>
