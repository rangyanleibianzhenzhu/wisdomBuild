<template>
  <div class="markdown-preview-container">
    <div ref="content" :id="id"></div>
  </div>
</template>

<script>
import { generateUUID, loadScript, loadCss, loadStyle } from '@/assets/js/utils.js'
import defaultContentStyle from '!raw-loader!sass-loader!./style/defaultContentStyle.scss'

/* eslint-disable no-undef */
const indexPath = APP_INDEX_PATH // 项目根路径（由webpack的插件DefinePlugin注入）
const editorBaseUrl = indexPath + 'static/toast-ui' // 编辑器相关文件根路径
const prismBaseUrl = indexPath + 'static/prism' // 代码语法着色相关文件根路径

export default {
  name: 'MarkdownViewer',
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: function () {
        return 'markdown-preview-' + generateUUID() + new Date().getTime()
      }
    },
    // 配置
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      editor: null // 编辑器对象
    }
  },
  watch: {
    value (val) {
      if (this.editor) {
        this.$nextTick(() => {
          this.setContent(val)
        })
      }
    }
  },
  beforeCreate () {
    // 编辑器基本样式
    loadCss(`${editorBaseUrl}/toastui-editor.min.css`, 'toastui-editor-css')
    /* 代码语法着色相关样式 start */
    loadCss(`${prismBaseUrl}/prism.min.css`, 'toastui-editor-prism-css')
    /* 代码语法着色相关样式 end */
    // 加载默认编辑器样式
    loadStyle(defaultContentStyle, 'customer-markdown-editor-style')
  },
  mounted () {
    this.init()
  },
  destroyed () {
    this.destroyEditor()
  },
  methods: {
    init () {
      // https://nhn.github.io/tui.editor/3.1.0/dist/cdn/toastui-editor-all.js
      // https://nhn.github.io/tui.editor/3.1.0/dist/cdn/toastui-editor-all.min.js
      loadScript(editorBaseUrl + '/toastui-editor-all.min.js', 'toastui-editor').then(() => { // toastui-editor-all.min.js，表格合并单元格和对齐会报错，需要使用 toastui-editor-all.js
        return Promise.all([
          // 中文相关脚本
          // loadScript(editorBaseUrl + '/i18n/zh-cn.min.js', 'toastui-editor-zh-cn'),
          // 加载代码语法着色相关脚本
          function () {
            return loadScript(prismBaseUrl + '/prism.min.js', 'toastui-editor-prism', { 'data-manual': '' }).then(() => {
              return loadScript(prismBaseUrl + '/prism-clojure.min.js', 'toastui-editor-prism-clojure')
            })
          }()
        ])
      }).then(() => {
        this.initEditor()
      })
    },
    initEditor () {
      const defaultOptions = {
        el: document.getElementById(this.id),
        initialValue: this.value,
        viewer: true,
        events: {
          load: () => {
            this.initHighLight() // 初始化代码语法着色
          },
          change: () => {
            this.initHighLight() // 初始化代码语法着色
          }
        }
      }
      let options = Object.assign({}, defaultOptions, this.options)

      const { Editor } = window.toastui
      this.editor = Editor.factory(options)
    },
    // 初始化代码语法着色
    initHighLight () {
      let preElements = this.$refs.content.getElementsByTagName('pre')
      for (let i = 0; i < preElements.length; i++) {
        window.Prism.highlightElement(preElements[i])
      }
    },
    destroyEditor () {
      if (!this.editor) return
      this.editor.destroy()
    },
    setContent (value) {
      this.editor && this.editor.setMarkdown(value || '')
      this.initHighLight()
    },
    getContent () {
      return this.editor && this.editor.getMarkdown()
    },
    setHtml (value) {
      this.editor && this.editor.setHtml(value)
    },
    getHtml () {
      return this.editor ? this.editor.getHtml() : ''
    }
  }
}
</script>

<style lang="scss" scoped px2rem="false">
$editor-font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;

.markdown-editor-container {
  ::v-deep .toastui-editor-defaultUI .ProseMirror {
    box-sizing: content-box;
    font-family: $editor-font-family;
  }
  ::v-deep .toastui-editor-contents {
    font-family: $editor-font-family;
    pre {
      background: #272822;
      color: #f8f8f2;
    }
  }
  ::v-deep .toastui-editor {
    line-height: 1.6;
  }
}
</style>
