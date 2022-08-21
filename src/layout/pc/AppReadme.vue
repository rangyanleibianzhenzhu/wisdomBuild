<template>
  <div class="readme">
<!--    <Markdown :content="content"></Markdown>-->
    <MarkdownViewer :value="content"></MarkdownViewer>
  </div>
</template>
<script>
import axios from 'axios'
// import Markdown from '@/components/base/markdown/index.vue'
import { MarkdownViewer } from '@/components/pc/markdownEditor'
/* eslint-disable no-undef */
const indexPath = APP_INDEX_PATH // 项目根路径（由webpack的插件DefinePlugin注入）

export default {
  name: 'AppReadMe',
  components: {
    // Markdown
    MarkdownViewer
  },
  props: {
    // .md 文件名称
    filename: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      content: ''
    }
  },
  created () {
    this.getContent()
  },
  methods: {
    getContent () {
      axios({
        method: 'get',
        url: `${indexPath}static/readme/${this.filename}.md`
      }).then(
        res => {
          this.content = res.data
          this.$eventBus.$emit('init-scroll-readme', true)
        }, e => {
          this.$toast({ type: 'error', message: '获取README.md文件失败！' })
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
.readme {
  padding: 0 35px 50px;
}
</style>
