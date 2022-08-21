<template>
  <div class="markdown-editor-container">
    <div :id="id"></div>
  </div>
</template>

<script>
import { generateUUID, loadScript, loadCss, throttle } from '@/assets/js/utils.js'
import editorConfig from './js/config.js'

/* eslint-disable no-undef */
const indexPath = APP_INDEX_PATH // 项目根路径（由webpack的插件DefinePlugin注入）
const editorBaseUrl = indexPath + 'static/toast-ui' // 编辑器相关文件根路径
const prismBaseUrl = indexPath + 'static/prism' // 代码语法着色相关文件根路径

export default {
  name: 'MarkdownEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: function () {
        return 'markdown-editor-' + generateUUID() + new Date().getTime()
      }
    },
    // 配置
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // markdown字符串最大长度
    maxMarkdownLength: Number,
    // 是否不可编辑
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editor: null, // 编辑器对象
      hasChange: false, // 是否已编辑
      lastToastMessage: null // 上次提示信息
    }
  },
  watch: {
    value (val) {
      if (this.editor && !this.hasChange) {
        this.$nextTick(() => {
          this.setContent(val, true)
        })
      }
    },
    disabled (val) {
      if (this.editor) {
        if (val) {
          this.editor.hide()
        } else {
          this.editor.show()
        }
      }
    }
  },
  beforeCreate () {
    // 编辑器基本样式
    loadCss(`${editorBaseUrl}/toastui-editor.min.css`, 'toastui-editor-css')
    /* 代码语法着色相关样式 start */
    loadCss(`${prismBaseUrl}/prism.min.css`, 'toastui-editor-prism-css')
    loadCss(`${editorBaseUrl}/toastui-editor-plugin-code-syntax-highlight.min.css`, 'toastui-editor-plugin-code-syntax-highlight-css')
    /* 代码语法着色相关样式 end */
    /* 文本颜色相关样式 start */
    loadCss(`${editorBaseUrl}/tui-color-picker.min.css`, 'tui-color-picke-css')
    loadCss(`${editorBaseUrl}/toastui-editor-plugin-color-syntax.min.css`, 'toastui-editor-plugin-color-syntax-css')
    /* 文本颜色相关样式 end */
    // 表格处理先关样式
    // loadCss(`${editorBaseUrl}/toastui-editor-plugin-table-merged-cell.min.css`, 'toastui-editor-plugin-table-merged-cell-css')
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
          loadScript(editorBaseUrl + '/i18n/zh-cn.min.js', 'toastui-editor-zh-cn'),
          // 加载代码语法着色相关脚本
          function () {
            return loadScript(prismBaseUrl + '/prism.min.js', 'toastui-editor-prism').then(() => {
              return loadScript(prismBaseUrl + '/prism-clojure.min.js', 'toastui-editor-prism-clojure')
            }).then(() => {
              return loadScript(editorBaseUrl + '/toastui-editor-plugin-code-syntax-highlight.min.js', 'toastui-editor-plugin-code-syntax-highlight')
            })
          }(),
          // 文本颜色相关脚本
          function () {
            return loadScript(editorBaseUrl + '/tui-color-picker.min.js', 'tui-color-picker').then(() => {
              return loadScript(editorBaseUrl + '/toastui-editor-plugin-color-syntax.min.js', 'toastui-editor-plugin-color-syntax')
            })
          }()
          // 表格处理先关脚本(合并单元格和对齐时有bug暂不使用)
          // https://uicdn.toast.com/editor-plugin-table-merged-cell/latest/toastui-editor-plugin-table-merged-cell.min.js
          // loadScript(editorBaseUrl + '/toastui-editor-plugin-table-merged-cell.min.js', 'toastui-editor-plugin-table-merged-cell')
        ])
      }).then(() => {
        setTimeout(() => {
          this.initEditor()
        }, 20)
      })
    },
    initEditor () {
      const { Editor } = window.toastui
      let options = this.getEditorOptions()
      this.editor = new Editor(options)
      if (this.disabled) {
        this.editor.hide()
      }
      this.editor.on('change', (eventName) => {
        this.hasChange = true
        let val = this.editor.getMarkdown()
        this.$emit('input', val)
        this.$emit('change', val)
        if (this.maxMarkdownLength && val.length > this.maxMarkdownLength) {
          let message = `Markdown包含${val.length}个字符，超出了${this.maxMarkdownLength}的最大字符限制`
          if (message !== this.lastToastMessage) {
            this.throttleToast(message)
          }
        }
      })
    },
    getEditorOptions () {
      const { codeSyntaxHighlight, colorSyntax } = window.toastui.Editor.plugin
      const defaultOptions = {
        el: document.getElementById(this.id),
        height: '460px', // 'auto' 或者 '300px'
        minHeight: '200px',
        initialValue: this.value,
        initialEditType: 'markdown', // markdown | wysiwyg
        previewStyle: 'vertical', // tab | vertical
        previewHighlight: true, // 预览面板正在编辑的内容是否高光显示
        language: 'zh-CN', // 语言
        // useCommandShortcut: true, // ？
        usageStatistics: false, // 是否推送谷歌分析
        hideModeSwitch: false, // 隐藏模式切换
        plugins: [
          [codeSyntaxHighlight, { highlighter: Prism }], // 代码语法着色插件
          colorSyntax // 颜色选择插件
          // tableMergedCell, // 表格处理插件(合并单元格和对齐时有bug)
        ],
        hooks: {
          addImageBlobHook: (file, callback) => {
            console.log('addImageBlobHook', file)
            // return file
            if (file.size > editorConfig.imageUpload.maxSize * 1024 * 1024) {
              this.$toast(`上传的文件大小不能超过${editorConfig.imageUpload.maxSize}M`)
              return
            }

            if (file.size > editorConfig.imageUpload.base64MaxSize * 1024) {
              const formData = new FormData()
              formData.append(editorConfig.imageUpload.fieldName, file)
              this.$apiPost({
                url: editorConfig.imageUpload.uploadApiUrl,
                data: formData
              }).then((resData) => {
                let src = editorConfig.imageUpload.urlBasePath + resData.location
                callback(src)
              })
            } else {
              const reader = new FileReader()
              reader.onload = event => {
                callback(event.target.result)
              }
              reader.readAsDataURL(file)
            }
          }
        }
        // 工具栏列表
        /* toolbarItems: [
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'image', 'link'],
          ['code', 'codeblock']
        ] */
      }
      let options = Object.assign({}, defaultOptions, this.options)
      return options
    },
    destroyEditor () {
      if (!this.editor) return
      this.editor.off('change')
      this.editor.destroy()
    },
    setContent (value, toStart = false) {
      this.editor && this.editor.setMarkdown(value || '')
      if (toStart) {
        this.editor && this.editor.moveCursorToStart()
      }
    },
    getContent () {
      return this.editor && this.editor.getMarkdown()
    },
    setHtml (value) {
      this.editor && this.editor.setHtml(value)
    },
    getHtml () {
      return this.editor ? this.editor.getHtml() : ''
    },
    // 防抖动的toast提示
    throttleToast: throttle(function (message) {
      this.$toast(message)
      this.lastToastMessage = message
    }, 3000, { trailing: true })
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
