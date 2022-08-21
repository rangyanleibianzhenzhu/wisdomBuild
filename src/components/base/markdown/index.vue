<template>
  <div class="markdown">
    <vue-markdown :source="content" :linkify="false"><slot></slot></vue-markdown>
  </div>
</template>
<script>
import VueMarkdown from 'vue-markdown'
import './style/markdown.scss'
import './style/prism.scss'
export default {
  name: 'Markdown',
  components: {
    VueMarkdown
  },
  props: {
    content: String
  }
}
</script>
<style lang="scss">
.markdown{
  ul, ol{
    padding-left: 2em;
  }
}
</style>
