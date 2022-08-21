/**
 * @file theme loader
 *
 * @desc 向每个.vue文件中注入样式相关的变量，不需要手动import
 * 
 */
'use strict'

const loaderUtils = require('loader-utils')

const STYLE_TAG_REG = /(\<style.*?lang="scss".*?\>)([\S\s]*?)(\<\/style\>)/g


// 引入项目变量和vuetify中使用的颜色变量
let importVariablesTemplate = `
@import '@/assets/style/variables.scss';
`

let injectedTemplate = importVariablesTemplate
module.exports = function (source) {
  const options = loaderUtils.getOptions(this)
  if (options && options.injectInVueFile) {
    // 向每一个.vue文件的<style>块中注入
    const outSource = source.replace(STYLE_TAG_REG, `$1${injectedTemplate}$2$3`)
    return outSource
  }
  return source
}
