<!-- 富文本预览组件 -->
<template>
  <div class="rich-text-preview">
    <iframe ref="iframe" class="rich-text-preview-iframe"
            frameborder="0" :scrolling="scroll?'yes':'no'"
            width="100%" :height="iframeHeight"></iframe>
  </div>
</template>

<script>
import defaultContentStyle from '!raw-loader!sass-loader!./style/defaultContentStyle.scss'
/* eslint-disable no-undef */
const indexPath = APP_INDEX_PATH // 项目根路径（由webpack的插件DefinePlugin注入）
const tinymceBaseUrl = indexPath + 'static/tinymce' // tinymce 富文本编辑器相关文件根路径
const prismBaseUrl = indexPath + 'static/prism' // 代码语法着色相关文件根路径

export default {
  name: 'RichTextViewer',
  props: {
    value: String, // 富文本内容
    scroll: Boolean, // 是否滚动
    contentStyle: String, // 包裹器样式
    // iframe 高度
    height: {
      type: [Number, String],
      default: 'auto'
    }
  },
  data () {
    return {
      iframeHeight: typeof this.height === 'number' ? this.height + 'px' : this.height
    }
  },
  watch: {
    value (val) {
      this.refresh()
    }
  },
  mounted () {
    this.init()
  },
  activated () {
    this.init()
  },
  methods: {
    // 初始化
    init () {
      let head = this.$refs.iframe.contentDocument.head
      head.innerHTML = `<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">` +
        `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1,user-scalable=no">` +
        `<link rel="stylesheet" type="text/css" href="${tinymceBaseUrl}/skins/ui/oxide/content.min.css">` +
        `<link rel="stylesheet" type="text/css" href="${tinymceBaseUrl}/skins/content/default/content.min.css">` +
        `<link rel="stylesheet" type="text/css" href="${prismBaseUrl}/prism.min.css">` + // 代码着色样式
        `<style type="text/css">${defaultContentStyle}</style>` // 默认样式
      // 加载代码块处理脚本
      this.loadPrismScript()

      let body = this.$refs.iframe.contentDocument.body
      body.className = 'mce-content-body rich-text-review-body'
      body.innerHTML = this.getBodyHtml()
      if (!this.scroll) { // 如果不可滚动
        // 将 iframe 的高度设为内容的高度
        this.iframeHeight = body.getBoundingClientRect().height + 'px'
      } else if (this.iframeHeight === 'auto') { // 如果可滚动，并且高度为 auto
        // 将 iframe 的高度设为父元素的高度
        this.iframeHeight = this.$refs.iframe.parentNode.parentNode.getBoundingClientRect().height + 'px'
      }
    },
    // 刷新
    refresh () {
      // 加载代码块处理脚本
      this.loadPrismScript()
      let body = this.$refs.iframe.contentDocument.body
      body.innerHTML = this.getBodyHtml()
      if (!this.scroll) {
        this.refreshHeight()
      }
    },
    // 加载代码块处理脚本
    loadPrismScript () {
      let head = this.$refs.iframe.contentDocument.head
      let prismScript = this.$refs.iframe.contentDocument.getElementById('prismScript')
      if (prismScript) {
        head.removeChild(prismScript)
      }
      prismScript = document.createElement('script')
      prismScript.id = 'prismScript'
      prismScript.src = `${prismBaseUrl}/prism.min.js`
      head.appendChild(prismScript)
    },
    // 获取 body 的内容
    getBodyHtml () {
      return `<div id="richTextContent" class="rich-text-content" style="${this.contentStyle || ''}">${this.value}</div>`
    },
    // 刷新 iframe 的高度
    refreshHeight () {
      let contentElement = this.$refs.iframe.contentDocument.getElementById('richTextContent')
      this.iframeHeight = contentElement.getBoundingClientRect().height + 'px'
    }
  }
}
</script>

<style scoped>

</style>
