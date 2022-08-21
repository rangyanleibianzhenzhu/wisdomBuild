# MarkdownEditor Markdown编辑器组件
> * 不兼容IE10及以下浏览器
> * 使用了 TOAST UI Editor 编辑器，版本号：3.1.0
> * 由于 TOAST UI Editor 的依赖较多，为减少编译时间采用了异步加载静态文件的方式引用

> * 官网地址： https://ui.toast.com/tui-editor
> * github地址： https://github.com/nhn/tui.editor
> * github地址2: https://github.com/nhn/tui.editor/tree/master/apps/editor

#### 属性
##### 1. value markdown内容
* 值为 String 类型
##### 2. id 编辑器ID
* 值为 String 类型
* 非必填
##### 3. options 配置对象
* 值为对象类型
* 非必填
* 参考 [TOAST UI Editor](https://nhn.github.io/tui.editor/3.1.0/ToastUIEditorCore) 的配置
##### 4. maxMarkdownLength 最大允许Markdown字符数（不强制，只提示）
* 值为 Number 类型
* 值为空或者为0时不进行提示
##### 5. disabled 是否不可编辑
* 值为 Boolean 类型
* 默认值： false
* 值为 true 时，编辑器不显示，但占据高度

**注意事项**：

在 value 值需要异步获取的情况下，如果编辑器在 value 获取到值前编辑器被修改了，则不会渲染更新后的 value 值
* 解决方案1：异步获取后调用组件实例的 setContent() 方法设置编辑器内容
* 解决方案2：异步获取前 disabled 设为 true，此时编辑器不显示，异步获取成功后再将 disabled 设为 false，此时编辑器可编辑

#### 事件
##### 1. change 值改变事件
* 参数：value Markdown内容（值为字符串类型）

### 简单示例
```vue
<template>
  <MarkdownEditor ref="editor" v-model="value" :disabled="editorDisabled" :maxMarkdownLength="1000"></MarkdownEditor>
</template>
<script>
import MarkdownEditor from '@/components/pc/markdownEditor'

export default {
  components: {
    MarkdownEditor,
  },
  data () {
    return {
      value: '', // markdown文本内容
      editorDisabled: true // 是否获取markdown文本内容
    }
  },
  created () {
    this.$apiGet({
      url: '/api/markdownEditor/get'
    }).then((data) => {
      this.value = data.content
      this.editorDisabled = false
    })
  }
}
</script>
```

### 弹窗中编辑示例
```vue
<template>
  <BaseButton @click="handlePopupEdit">弹窗中编辑</BaseButton>
</template>
<script>
import MarkdownEditor from '@/components/pc/markdownEditor'

export default {
  data () {
    return {
      value: '# 示例'
    }
  },
  methods: {
    // 在弹窗中编辑文本
    handlePopupEdit () {
      this.$popup({
        title: 'Markdown编辑',
        content: MarkdownEditor,
        contentProps: {
          value: this.value,
          options: {
            height: '500px'
          }
        },
        contentEvents: {
          change: (content) => {
            this.value = content
          }
        },
        contentWrapperStyle: {
          padding: '10px'
        },
        width: 1000,
        height: 570
      })
    }
  }
}
</script>
```
## MarkdownViewer 预览组件
#### 属性
##### 1. value文本内容
* 值为字符串类型
##### 2. id 组件ID
* 值为字符串类型
* 值默认自动生成
##### 3. options 编辑器配置
* 值为对象类型
* 非必填
* 参考 [TOAST UI Editor](https://nhn.github.io/tui.editor/3.1.0/ToastUIEditorViewer) 的配置

### 预览示例
```vue
<template>
  <MarkdownViewer :value="value"></MarkdownViewer>
</template>
<script>
import { MarkdownViewer } from '@/components/pc/markdownEditor'

export default {
  components: {
    MarkdownViewer
  },
  data () {
    return {
      value: '# 示例'
    }
  }
}
</script>
```

### 弹窗预览示例
```vue
<template>
  <BaseButton @click="handlePreview">预览</BaseButton>
</template>
<script>
import { MarkdownViewer } from '@/components/pc/markdownEditor'

export default {
  data () {
    return {
      value: '# 示例'
    }
  },
  methods: {
    // 预览
    handlePreview () {
      this.$popup({
        title: '预览',
        content: MarkdownViewer,
        contentProps: {
          value: this.value
        },
        contentWrapperStyle: {
          padding: '10px'
        },
        width: 800,
        height: 1000
      })
    }
  }
}
</script>
```

