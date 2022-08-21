# 选择器组件
#### 参考
https://element.eleme.io/#/zh-CN/component/select

### 一、公共下拉选择器组件 CommonSelect
##### 1. value
* 当前值
##### 2. options
* 选项数组
* 非必填（type 有值时忽略此选项）
> 数组中对象示例：{ value: '01', label: '黄金糕', disabled: true }
> * value： 值
> * label： 显示的文字
> * disabled: 是否可用
##### 3. type
* 公用下拉框选项类型(需要 store/module/select.js 中定义对应的 state 属性)
* 非必填
* 值为字符串，如：currency
  * yesNo：是否
  * currency：币种
  * level: 级别
> 注意: options 和 type 必须二选一进行设置，否则下拉框无数据

##### 【说明】全局下拉选项数据管理（store/module/select.js）
以选项类型 level 为例：
* 定义state属性

  属性名为 `{type}Options` 格式，本例的属性名为 levelOptions

  如果选项不通过后台接口获取，选项数组值的格式为：[{value: '01' , label: '一般'}]

  如果选项是通过后台接口获取，初始值为空数组即可

* 定义选项获取方法

  如果选项是通过后台接口获取的，需要在 getOptionMethods 中增加选项获取方法，当初始化组件时会自动调用该方法获取选项数据。

  > 注意：如果选项数据已获取过，则不会重复获取。
  ```js
  const getOptionMethods = {
    // 获取级别选项
    level: (vm) => {
      return api.get({
        url: '/api/dict/level'
      }, vm).then(data => {
        let options = []
        if (data && data instanceof Array) {
          options = data.map((item) => {
            return { value: item.code, label: item.name }
          })
        }
        return options
      })
    }
  }
  ```
* 值到名称的映射

  state中增加 `{type}Options` 格式的属性后，getter 中会自动添加 `{type}OptionsMap` 的属性，来获取该类型选项值到名称的映射.

  例：level 类型在 state 中的属性为 levelOptions，getter 中自动添加的属性为 levelOptionsMap, levelOptionsMap 的值为：
  ```
  {
    "01": "一般",
    "02": "重要",
    "03": "紧急",
  }
  ```
  通过值获取名称：
  ```
  vm.$store.getters.levelOptionsMap[val]
  ```
* 初始化选项数组

  如果使用了 CommonSelect 组件，组件会自动初始化 type 指定类型的选项数据，
  但是个别页面只需要使用 `{type}OptionsMap` 将编码转化为名称，没有必要使用 CommonSelect 组件，
  这时就需要手动初始化选项数据：
  ```
  // 如果选项数据已经获取过，不会重复获取
  vm.$store.dispatch('initOptions', { type: 'level', vm: vm })
  ```
  如果选项数据改变了，可在将参数中 force 设置为 true，强制更新选项数据：
  ```
  vm.$store.dispatch('initOptions', { type: 'level', vm: vm, force: true })
  ```

##### 4. needAll
* 是否增加全部选项
* 值为布尔类型，默认为false
* 说明：为了保持与老系统页面交互一致，个别查询条件需要增加为空的全部选项，一般情况可以将clearable设为true，让用户通过按钮清空选项

##### 5. allValue
* “全部”选项的值
* 默认为：""
* 说明：只有needAll为true时有效

##### 6. allLabel
* “全部”选项的名称
* 默认为："全部"
* 说明：只有needAll为true时有效

##### 7. firstAsDefault
* 是否将第一项作为默认值
* 值为布尔类型，默认为false

##### 8. readonly
* 是否只读
* 值为布尔类型，默认为false

##### 9. disabled
* 是否不可用
* 值为布尔类型，默认为false

##### 10. optionConverter
* 选项转换器方法
* 值为Function，非必须
  * 方法参数：原始选项数据，例：{ value: '1', label: '选项1' }
  * 方法返回值：新选项数据，例：{ value: 1, label: '选项1' }

##### 11. multiple
* 是否多选
* 值为布尔类型，默认为false

##### 12. showSelectAll （multiple 为 true 时有效）
* 下拉底部是否显示全选、清空按钮，输入框左侧会有未选、部分选择、全选状态的图标
* 值为布尔类型，默认为false

##### 13. showMultiStatusIcon（multiple 为 true 时有效）
* 是否显示左侧选择状态的图标，选择状态有未选择、部分选择和全选
* 值为布尔类型，默认为false

##### 14. flat
* 选项是否平铺显示
* 值为 Boolean 类型，默认是为 false

##### 15. 其他
参考：https://element.eleme.io/#/zh-CN/component/select#select-attributes

#### options设置选项示例
```
<template>
  <CommonSelect v-model="selectVal1" :options="options"></CommonSelect>
</template>
<script>
import CommonSelect from '@/components/el/select/CommonSelect.vue'
export default {
  name: 'DatePickerDemo',
  components: {
    CommonSelect
  },
  data () {
    return {
      selectVal1: '01',
      options: [
        { value: '01', label: '黄金糕' },
        { value: '02', label: '双皮奶' }
      ]
    }
  }
}
</script>
```

#### type设置选项示例
```
<template>
  <CommonSelect v-model="selectVal1" type="currency"></CommonSelect>
</template>
<script>
import CommonSelect from '@/components/el/select/CommonSelect.vue'
export default {
  name: 'DatePickerDemo',
  components: {
    CommonSelect
  },
  data () {
    return {
      selectVal1: 3
    }
  }
}
</script>
```

### 二、公共树形下拉选择器组件 SelectTree
##### 1. data 树的展示数据
* 数组类型
* 示例：
```js
[
  {
    id: '1',
    label: '一级 1',
    children: [
      {
        id: '11',
        label: '二级 1-1',
        children: [
          {
            id: '111',
            label: '三级 1-1-1'
          }
        ]
      }
    ]
  }
]
```
##### 2. value 当前值
* 数字或者字符串类型
* 说明：对应data的id值

##### 3. label 当前值对应的标签
* 字符串类型
* 说明：可以为空，如果为空则会遍历data树进行查询获取

##### 4. labelKey 标签的属性名
* 字符串类型
* 默认值："label"

##### 5. childrenKey 子树的属性名
* 字符串类型
* 默认值："children"

##### 6. clearable 是否可清空选项
* 布尔类型
* 默认值：false

##### 7. disabled 是否可用
* 布尔类型
* 默认值：false

##### 8. readonly 是否只读
* 布尔类型
* 默认值：false

#### 示例
```
<template>
  <SelectTree v-model="val" :data="treeData"></SelectTree>
</template>
<script>
import SelectTree from '@/components/el/select/SelectTree.vue'
export default {
  name: 'DatePickerDemo',
  components: {
    SelectTree
  },
  data () {
    return {
      val: '111',
      treeData: [
        {
          id: '1',
          label: '一级 1',
          children: [
            {
              id: '11',
              label: '二级 1-1',
              children: [
                {
                  id: '111',
                  label: '三级 1-1-1'
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
</script>
```

### 三、选择器组件 BaseSelect 和 BaseOption
#### 示例
```
<template>
  <BaseSelect v-model="selectVal2">
    <BaseOption v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
    </BaseOption>
  </BaseSelect>
</template>
<script>
import { BaseSelect, BaseOption } from '@/components/el/select'
export default {
  name: 'DatePickerDemo',
  components: {
    BaseSelect,
    BaseOption
  },
  data () {
    return {
      selectVal2: '01',
      options: [
        { value: '01', label: '黄金糕' },
        { value: '02', label: '双皮奶' }
      ]
    }
  }
}
</script>
```
