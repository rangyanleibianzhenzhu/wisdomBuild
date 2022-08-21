<template>
  <div class="pdf-viewer-container">
    <iframe ref="iframe" :src="src"
            class="pdf-viewer-iframe"
            frameborder="0" :scrolling="scroll?'yes':'no'"
            width="100%" :height="iframeHeight"></iframe>
    <div v-if="showLoading" class="loading">
      <Spinner spinner="spiral" size="l"></Spinner>
    </div>
  </div>
</template>
<script>
import Spinner from '@/components/base/spinner/Spinner'
import viewerStyle from '!raw-loader!sass-loader!./style/viewerStyle.scss'

/* eslint-disable no-undef */
const indexPath = APP_INDEX_PATH // 项目根路径（由webpack的插件DefinePlugin注入）
const pdfjsBaseUrl = indexPath + 'static/pdfjs' // PDF.js 文件根路径

export default {
  name: 'PdfViewer',
  components: {
    Spinner
  },
  props: {
    // pdf文件地址
    url: {
      type: String,
      required: true
    },
    // 是否滚动
    // scroll为false时只显示pdf内容；
    // scroll为true时，阅读器高度固定，显示滚动条及工具栏（查找、缩放、全屏等）
    scroll: Boolean,
    // iframe 高度
    height: {
      type: [Number, String],
      default: 'auto'
    },
    // 初始页码（scroll 为 true 时有效）
    page: Number, // 页码从 1 开始
    // 缩放（scroll 为 true 时有效）
    zoom: String, // 格式： [zoom],[left offset],[top offset], page-width, page-height, page-fit, auto
    // 页面模式 （scroll 为 true 时有效）
    pageMode: {
      type: String,
      default: 'none' // 可选值 none, thumbs, bookmarks, attachments
    }
  },
  data () {
    let iframeHeight = typeof this.height === 'number' ? this.height + 'px' : (this.height === 'auto' ? '0px' : this.height)

    return {
      src: '', // iframe 展示 pdf 的网页地址
      iframeHeight: iframeHeight, // iframe 的高度,
      showLoading: false // 是否显示加载中动画
    }
  },
  computed: {

  },
  watch: {
    url (val) {
      this.src = this.getIframeSrc()
      setTimeout(() => {
        this.init()
      }, 20)
    }
  },
  created () {
    this.src = this.getIframeSrc()
  },
  mounted () {
    this.init()
  },
  activated () {
    this.src = this.getIframeSrc()
    setTimeout(() => {
      this.init()
    }, 20)
  },
  methods: {
    // 获取 iframe 展示 pdf 的网页地址
    getIframeSrc () {
      let hash = ''
      if (this.scroll) {
        if (this.page) {
          hash += '&page=' + this.page
        }
        if (this.zoom) {
          hash += '&zoom=' + this.zoom
        }
        if (this.pageMode) {
          hash += '&pagemode=' + this.pageMode
        }
        hash = hash.replace('&', '#')
      } else {
        hash = '#pagemode=' + this.pageMode
      }
      return `${pdfjsBaseUrl}/viewer.html?file=${this.url}${hash}`
    },
    // 初始化
    init () {
      // 加载自定义样式
      this.loadCustomerStyle()

      if (!this.scroll) { // 如果不可滚动
        // 将 iframe 的高度设为内容的高度
        this.initNotScrollHeight()
      } else if (this.height === 'auto') { // 如果可滚动，并且高度为 auto
        // 将 iframe 的高度设为父元素的高度
        this.initScrollHeight()
      }
    },
    // 初始化不可滚动的 iframe 高度
    initNotScrollHeight () {
      this.showLoading = true
      let iframeWindow = this.$refs.iframe.contentWindow
      iframeWindow.addEventListener('load', () => {
        iframeWindow.PDFViewerApplication.initializedPromise.then(() => {
          iframeWindow.PDFViewerApplication.eventBus._on('$viewerHeight', (event) => {
            this.iframeHeight = (event.height + 9 * 2) + 'px'
            this.showLoading = false
          })
        })
      })
    },
    // 初始化 height 为 auto 时可滚动的 iframe 高度
    initScrollHeight () {
      setTimeout(() => {
        this.iframeHeight = (this.$refs.iframe.parentNode.parentNode.getBoundingClientRect().height) + 'px'
      }, 300)
    },
    // 加载自定义的样式
    loadCustomerStyle () {
      let iframeWindow = this.$refs.iframe.contentWindow
      iframeWindow.addEventListener('load', () => {
        iframeWindow.PDFViewerApplication.initializedPromise.then(() => {
          setTimeout(() => {
            iframeWindow.PDFViewerApplication.eventBus.dispatch('$customerStyle', {
              id: 'customerPdfViewerStyle',
              cssText: viewerStyle,
              htmlClass: this.scroll ? 'scroll-viewer' : 'not-scroll-viewer'
            })
          }, 0)
        })
      })
    },
    // 加载脚本
    loadScript (scriptUrl, scriptId) {
      let head = this.$refs.iframe.contentDocument.head
      let script = this.$refs.iframe.contentDocument.getElementById(scriptId)
      if (script) {
        head.removeChild(script)
      }
      script = document.createElement('script')
      script.id = scriptId
      script.src = scriptUrl
      head.append(script)
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
.pdf-viewer-container {
  .loading {
    height: 200px;
    text-align: center;
    line-height: 200px;
  }
}
</style>
