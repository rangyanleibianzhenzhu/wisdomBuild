/**
 * Element 样式处理 Loader
 * 样式自动引入 element-variables.scss，用于使用系统样式变量覆盖 Element 默认样式变量
 * 如：主题颜色、默认字体大小等
 */
// var loaderUtils = require("loader-utils");

module.exports = function (source) {
  // const options = loaderUtils.getOptions(this) || {};
  if (/element-ui.+[\\\/]common[\\\/][var|mixins]\.scss$|/.test(this.resource)) {
    source = '@import "@/assets/style/element-variables.scss";\n' + source
  }
  return source
}
