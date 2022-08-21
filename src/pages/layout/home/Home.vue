<template>
  <div class="home">
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
  name: 'HomePC',
  components: {
    // Markdown
    MarkdownViewer
  },
  data () {
    return {
      content: ''
    }
  },
  created () {
    this.getContent()
  },
  mounted () {},
  methods: {
    getContent () {
      axios({
        method: 'get',
        url: `${indexPath}static/readme/index.md`
      }).then(
        res => {
          this.content = res.data
        }, e => {
          this.$toast({ type: 'error', message: '获取README.md文件失败！' })
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
.home {
  padding: 30px 50px;
}
</style>
