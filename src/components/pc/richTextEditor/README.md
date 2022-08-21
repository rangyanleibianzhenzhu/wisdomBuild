# RichTextEditor 富文本编辑器组件【不支持IE10】
> * 不兼容IE10及以下浏览器
> * 使用了 tinymce 编辑器，版本号：5.8.2
> * 样式和主题只保留了默认的
> * 由于 tinymce 的依赖较多，为减少编译时间采用了异步加载静态文件的方式引用

> * 官网地址： https://www.tiny.cloud/
> * github地址： https://github.com/tinymce/tinymce
> * 中文参考文档： http://tinymce.ax-z.cn/
> * 代码块处理相关文件下载：https://prismjs.com/download.html
> * 外网资源地址： https://www.jsdelivr.com/package/npm/tinymce-all-in-one

#### 属性
##### 1. id 编辑器ID
* 值为 String 类型
* 非必填
##### 2. value 富文本内容
* 值为 String 类型
##### 3. options 配置对象
* 值为对象类型
* 参考 tinymce 的配置
##### 4. maxHtmlLength 最大允许HTML字符数（不强制，只提示）
* 值为 Number 类型
* 值为空或者为0时不进行提示
##### 5. readonly 是否只读
* 值为 Boolean 类型

**注意事项**：

在 value 值需要异步获取的情况下，如果编辑器在 value 获取到值前编辑器被修改了，则不会渲染更新后的 value 值
  * 解决方案1：异步获取后调用组件实例的 setContent() 方法设置编辑器内容
  * 解决方案2：异步获取前 readonly 设为 true，此时编辑器不可编辑，异步获取成功后再将 readonly 设为 false，此时编辑器可编辑

#### 事件
##### 1. change 值改变事件
* 参数：value 富文本内容（值为字符串类型）

### 简单示例
```vue
<template>
  <RichTextEditor ref="richTextEditor" v-model="value"></RichTextEditor>
</template>
<script>
import RichTextEditor from '@/components/pc/richTextEditor'

export default {
  components: {
    RichTextEditor
  },
  data () {
    return {
      value: '<p>示例</p>'
    }
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
import RichTextEditor from '@/components/pc/richTextEditor'

export default {
  data () {
    return {
      value: '<p>示例</p>'
    }
  },
  methods: {
    // 在弹窗中编辑富文本
    handlePopupEdit() {
      this.$popup({
        title: '富文本编辑',
        content: RichTextEditor,
        contentProps: {
          value: this.value,
          options: {
            height: 500
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
        width: 800,
        height: 570
      })
    },
  }
}
</script>
```
## RichTextViewer 预览组件
#### 属性
##### 1. value 富文本内容
* 值为字符串类型
##### 2. scroll 是否滚动
* 值为布尔类型
* 默认值为：false
##### 3. contentStyle 富文本内容包裹器样式
* 值为字符串类型
* 示例："padding: 20px;color:#666"
##### 4. height 展示富文本内容的iframe的高度（scroll为true时有效）
* 值为Number或String类型
* 默认：'auto'

### 预览示例
```vue
<template>
  <RichTextViewer :value="value"></RichTextViewer>
</template>
<script>
import { RichTextViewer } from '@/components/pc/richTextEditor'

export default {
  components: {
    RichTextViewer
  },
  data () {
    return {
      value: '<p>示例</p>'
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
import { RichTextViewer } from '@/components/pc/richTextEditor'

export default {
  data () {
    return {
      value: '<p>示例</p>'
    }
  },
  methods: {
    // 预览
    handlePreview () {
      this.$popup({
        title: '预览',
        content: RichTextViewer,
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
