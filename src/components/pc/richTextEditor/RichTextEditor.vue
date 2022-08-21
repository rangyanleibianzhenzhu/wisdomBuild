<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea ref="textarea" :id="tinymceId" class="tinymce-textarea" :value="value" />
  </div>
</template>

<script>
import { generateUUID, loadScript, throttle } from '@/assets/js/utils.js'
import editorConfig from './js/config.js'
import defaultContentStyle from '!raw-loader!sass-loader!./style/defaultContentStyle.scss'
import emoticonsQQ from './js/emoticons_qq.js'

/* eslint-disable no-undef */
const indexPath = APP_INDEX_PATH // 项目根路径（由webpack的插件DefinePlugin注入）
const tinymceBaseUrl = indexPath + 'static/tinymce' // tinymce 富文本编辑器相关文件根路径
const prismBaseUrl = indexPath + 'static/prism' // 代码语法着色相关文件根路径

export default {
  name: 'RichTextEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: function () {
        return 'tinymce-' + generateUUID() + new Date().getTime()
      }
    },
    // 配置
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 内容html字符串最大长度
    maxHtmlLength: Number,
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tinymceId: this.id, // 编辑器ID
      hasInit: false, // 是否已初始化
      hasChange: false, // 是否已修改
      fullscreen: false, // 是否全屏
      lastToastMessage: null // 上次提示信息
    }
  },
  computed: {
    // 计算容器宽度
    containerWidth () {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value (val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => {
          this.$eventBus.$onReady('TINYMCE_INIT_READY_' + this.id, () => {
            window.tinymce.get(this.tinymceId).setContent(val || '')
          })
        })
      }
    },
    readonly (val) {
      let mode = val ? 'readonly' : 'design'
      this.$eventBus.$onReady('TINYMCE_INIT_READY_' + this.id, () => {
        window.tinymce.get(this.tinymceId).mode.set(mode)
      })
    }
  },
  mounted () {
    this.init()
  },
  activated () {
    this.$eventBus.$onReady('TINYMCE_INIT_READY_' + this.id, () => {
      this.initTinymce()
    })
  },
  deactivated () {
    this.destroyTinymce()
  },
  destroyed () {
    this.destroyTinymce()
    this.$eventBus.$clearReadyEvent('TINYMCE_INIT_READY_' + this.id)
  },
  methods: {
    init () {
      loadScript(tinymceBaseUrl + '/tinymce.min.js', 'tinymce').then(() => {
        this.initTinymce()
      })
    },
    initTinymce () {
      const defaultOptions = {
        selector: `#${this.tinymceId}`,
        body_class: 'rich-text-edit-body',
        content_style: defaultContentStyle, // 内容样式
        base_url: tinymceBaseUrl, // 编辑器文件加载根路径
        suffix: '.min', // 加载文件的后缀
        language: 'zh_CN', // 语言
        readonly: this.readonly, // 是否只读
        branding: false, // 是否显示右下角 “POWERED BY TINY” 的标注
        height: 460, // 编辑器高度
        object_resizing: false, // 是否可以调整图片、表格、媒体等控件的大小
        plugins: editorConfig.plugins, // 插件
        toolbar_mode: 'sliding', // 工具栏模式：floating、sliding、scrolling、wrap（默认值：floating）
        toolbar: editorConfig.toolbar, // 工具栏
        menubar: false, // 菜单栏，默认不显示（有值时示例：'file edit insert view format table'）
        content_css: [
          'default', // 内容样式（只保留 default 样式，其他类型的 css 文件已删除）
          `${prismBaseUrl}/prism.min.css` // 代码块样式
        ],
        end_container_on_empty_block: true, // 如果在空的内部块元素中按enter键，则此选项允许您拆分当前容器块元素???
        // powerpaste 为收费插件，免费使用时，只能是 clean 模式
        powerpaste_word_import: 'clean', // word内容粘贴到编辑器的模式：clean、merge、prompt （默认值：prompt）
        advlist_bullet_styles: 'circle,disc,square', // 项目符号列表支持的项目符号，多个用“,”隔开，可选值：default、circle、disc、square
        advlist_number_styles: 'lower-alpha,lower-greek,lower-roman,upper-alpha,upper-roman', // 编号列表支持的编号类型，多个用“,”隔开
        // imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'], // 指定跨域地址
        default_link_target: '_blank', // 链接默认打开方式
        link_title: false, // 编辑链接时，是否有标题字段
        nonbreaking_force_tab: true, // 是否允许用户按下键盘tab键时强制TinyMCE插入三个"&nbsp"
        fontsize_formats: '8px 10px 12px 14px 16px 18px 24px 36px 48px', // 字体选择配置
        // 代码支持的语言
        codesample_languages: [
          { text: 'HTML/XML', value: 'markup' },
          { text: 'JavaScript', value: 'javascript' },
          { text: 'CSS', value: 'css' },
          { text: 'PHP', value: 'php' },
          { text: 'Ruby', value: 'ruby' },
          { text: 'Python', value: 'python' },
          { text: 'Java', value: 'java' },
          { text: 'C', value: 'c' },
          { text: 'C#', value: 'csharp' },
          { text: 'C++', value: 'cpp' }
        ],

        // 表情配置
        emoticons_database: 'emojiimages', // 使用图片表情库
        emoticons_images_url: `${tinymceBaseUrl}/plugins/emoticons/icons/twemoji/`, // 表情图片基本路径
        emoticons_append: emoticonsQQ, // 扩展QQ表情
        // emoticons_database: 'qq', // 只使用QQ表情
        // emoticons_images_url: APP_INDEX_PATH + 'static/tinymce/plugins/emoticons/icons/qqemoji/', // QQ表情图片基本路径

        init_instance_callback: (editor) => {
          this.$eventBus.$emitReady('TINYMCE_INIT_READY_' + this.id)
          this.hasInit = true
          editor.on('Change KeyUp SetContent', () => {
            this.hasChange = true
          })
          editor.on('NodeChange Change KeyUp SetContent', () => {
            if (this.hasChange) {
              let content = editor.getContent()
              this.$emit('input', content)
              this.$emit('change', content)
            }
          })
          // html字符数校验，仅进行提示
          editor.on('NodeChange Change KeyUp SetContent', (event) => {
            if (event.key === 'Backspace' || event.key === 'Delete' || !this.maxHtmlLength) {
              return
            }
            let htmlLength = editor.getContent().length
            if (htmlLength > this.maxHtmlLength) {
              let message = `HTML包含${htmlLength}个字符，超出了${this.maxHtmlLength}的最大字符限制`
              if (message !== this.lastToastMessage) {
                this.throttleToast(message)
              }
            }
          })
        },
        setup: (editor) => {
          editor.on('FullscreenStateChanged', (e) => {
            this.fullscreen = e.state
          })
        },
        // 自动转换URL
        // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
        // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
        convert_urls: false,
        // images_upload_base_path: API_BASE_URL,
        // images_upload_url: 'api/richTextEditor/upload/image'
        // 图片上传处理方法
        images_upload_handler: (blobInfo, success, failure, progress) => {
          if (blobInfo.blob().size > editorConfig.imageUpload.maxSize * 1024 * 1024) {
            failure(`上传的图片大小不能超过${editorConfig.imageUpload.maxSize}M`)
            return
          }
          const formData = new FormData()
          formData.append(editorConfig.imageUpload.fieldName, blobInfo.blob(), blobInfo.filename())
          this.$apiPost({
            url: editorConfig.imageUpload.uploadApiUrl,
            data: formData,
            toastError: false,
            onUploadProgress: (e) => {
              progress(e.loaded / e.total * 100)
            }
          }).then((resData) => {
            success(editorConfig.imageUpload.urlBasePath + resData.location)
          }, (e) => {
            failure(e.message)
          })
        },
        // 文件选取类型：链接、媒体
        file_picker_types: 'file media',
        // 文件选取回调方法
        file_picker_callback: (callback, value, meta) => {
          if (meta.filetype === 'file') { // 处理链接选取
            this.uploadFile(callback, value, meta)
          }
          if (meta.filetype === 'media') { // 处理媒体选取
            this.uploadMedia(callback, value, meta)
          }
        }
      }
      let options = Object.assign({}, defaultOptions, this.options)
      // console.log('init options', options)
      window.tinymce.init(options)
    },
    // 上传文件
    uploadFile (callback, value, meta) {
      let input = document.createElement('input') // 创建一个隐藏的input
      input.setAttribute('type', 'file')
      let that = this
      input.onchange = function () {
        let file = this.files[0] // 选取第一个文件
        if (file.size > editorConfig.fileUpload.maxSize * 1024 * 1024) {
          that.$toast(`上传的文件大小不能超过${editorConfig.fileUpload.maxSize}M`)
          return
        }
        const formData = new FormData()
        formData.append(editorConfig.fileUpload.fieldName, file)
        that.$apiPost({
          url: editorConfig.fileUpload.uploadApiUrl,
          data: formData
        }).then((resData) => {
          let src = editorConfig.fileUpload.urlBasePath + resData.location
          callback(src, { text: file.name })
        })
      }
      input.click()
    },
    // 上传媒体文件
    uploadMedia (callback, value, meta) {
      let input = document.createElement('input') // 创建一个隐藏的input
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'video/*')
      let that = this
      input.onchange = function () {
        let file = this.files[0] // 选取第一个文件
        if (file.size > editorConfig.mediaUpload.maxSize * 1024 * 1024) {
          that.$toast(`上传的媒体文件大小不能超过${editorConfig.mediaUpload.maxSize}M`)
          return
        }
        const formData = new FormData()
        formData.append(editorConfig.mediaUpload.fieldName, file)
        that.$apiPost({
          url: editorConfig.mediaUpload.uploadApiUrl,
          data: formData
        }).then((resData) => {
          let src = editorConfig.mediaUpload.urlBasePath + resData.location
          callback(src, { source2: editorConfig.mediaUpload.source2, poster: editorConfig.mediaUpload.poster })
        })
      }
      input.click()
    },
    // 销毁编辑器
    destroyTinymce () {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }
      if (tinymce) {
        tinymce.destroy()
      }
    },
    // 设置富文本内容
    setContent (value) {
      let tinymce = window.tinymce.get(this.tinymceId)
      tinymce.setContent(value)
      // tinymce.execCommand('mceWordCount')
    },
    // 获取富文本内容
    getContent () {
      return window.tinymce.get(this.tinymceId).getContent()
    },
    // 防抖动的toast提示
    throttleToast: throttle(function (message) {
      this.lastToastMessage = message
      this.$toast(message)
    }, 3000, { trailing: true })
  }
}
</script>

<style lang="scss" scoped px2rem="false">
.tinymce-container {
  position: relative;
  line-height: normal;
  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }
}
</style>
<style lang="scss">
/* 编辑器弹出窗口样式 */
.tox {
  .tox-dialog-wrap {
    .tox-dialog-wrap__backdrop {
      background-color: rgba(0,0,0,.5);
    }
    .tox-button {
      &, &:focus:not(:disabled), &:hover:not(:disabled) {
        @include primary-background-color();
        @include primary-border-color();
      }
      &.tox-button--secondary {
        background-color: #e3e3e3;
        border-color: #e3e3e3;
        &:focus:not(:disabled), &:hover:not(:disabled) {
          background-color: #e3e3e3;
          border-color: #e3e3e3;
        }
      }
      &.tox-button--naked {
        background-color: transparent;
        border-color: transparent;
        &:focus:not(:disabled), &:hover:not(:disabled) {
          background-color: #e3e3e3;
          border-color: #e3e3e3;
        }
      }
    }
  }
}
</style>
