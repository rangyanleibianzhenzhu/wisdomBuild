<template>
  <span class="help-icon-wrapper" title="帮助" @click="openReadme">
    <BaseIcon name="help" class="help-icon"></BaseIcon>
  </span>
</template>
<script>
import AppReadme from './AppReadme.vue'
import { popup } from '@/components/pc/popup/index.js'
export default {
  name: 'AppHelp',
  props: {
    readme: {
      type: String,
      default: 'index'
    }
  },
  methods: {
    openReadme () {
      popup({
        title: '帮助文档',
        width: 860,
        height: 600,
        scroll: true,
        content: AppReadme,
        contentProps: {
          filename: this.readme
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped px2rem="false">
.help-icon-wrapper {
  padding: 10px;
  cursor: pointer;
  .help-icon {
    vertical-align: middle;
    @include primary-font-color();
  }
}
</style>
