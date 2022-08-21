# pdf 阅读器【不支持 IE10 及以下的浏览器】
* PDF.js 官网：http://mozilla.github.io/pdf.js/
* Github: https://github.com/mozilla/pdf.js
* viewer 参数说明： https://github.com/mozilla/pdf.js/wiki/Viewer-options
* 版本：2.4.456

#### 属性
##### 1. url
* pdf文件地址
* 值为字符串类型
##### 2. scroll
* 是否有滚动
* 值为布尔类型
* 默认值：false
* 说明：
  * scroll 为 false 时只显示pdf内容
  * scroll 为 true 时，阅读器高度固定，显示滚动条及工具栏（查找、缩放、全屏等）
##### 3. height
* 展示 pdf 内容的 iframe 高度
* 值为字符串或数字类型
* 默认值： “auto”
* 说明：当值为“auto”时
  * 如果 scroll 为 true，则 iframe 高度自动为父元素的高度
  * 如果 scroll 为 false，则 iframe 高度自动为 pdf 内容的高度
##### 4. page （scroll 为 true 时有效）
* 初始页码（从1开始）
* 值为数字类型
* 默认值： 1
##### 5. zoom （scroll 为 true 时有效）
* 值为字符串
* 格式： [zoom],[left offset],[top offset], page-width, page-height, page-fit, auto
##### 6. pageMode （scroll 为 true 时有效）
* 页面模式
* 值为字符串类型
* 可选值： none, thumbs, bookmarks, attachments

### 示例
##### 1. 简单示例
```vue
<template>
  <PdfViewer :url="pdfUrl"></PdfViewer>
</template>
<script>
import PdfViewer from '@/components/pc/pdfViewer'

export default {
  components: {
    PdfViewer
  },
  data () {
    return {
      pdfUrl: `/static/pdfjs/demo.pdf` // pdf文件url地址
    }
  },
}
</script>
```

##### 2. 可滚动带工具栏示例
```vue
<PdfViewer :url="pdfUrl" :scroll="true" :height="400"></PdfViewer>
```

##### 3. 弹出窗口展示示例
```vue
<template>
  <button @click="handlePopupView" >点我</button>
</template>
<script>
import PdfViewer from '@/components/pc/pdfViewer'

export default {
  methods: {
    // 弹窗中显示
    handlePopupView () {
      this.$popup({
        title: '弹窗中显示pdf',
        content: PdfViewer,
        scroll: true,
        contentProps: {
          url: `/static/pdfjs/demo.pdf` // pdf文件url地址
        },
        width: 800,
        height: 1000
      })
    }
  }
}
</script>
```

##### 3. 弹出带工具栏的阅读器示例
```vue
<template>
  <button @click="handleToolsView" >点我</button>
</template>
<script>
import PdfViewer from '@/components/pc/pdfViewer'

export default {
  methods: {
    // 带工具栏
    handleToolsView () {
      this.$popup({
        title: '带工具栏的pdf阅读器',
        content: PdfViewer,
        contentProps: {
          url: `/static/pdfjs/demo.pdf`, // pdf文件url地址
          scroll: true
        },
        width: 800,
        height: 1000
      })
    }
  }
}
</script>
```
