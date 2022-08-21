/**
 * @file babel配置文件
 * 
 */
const config = require('./config.js')

const useElement = config.useElement;

module.exports = function (api) {
  api.cache(true)
  const presets = [
    '@vue/app'
  ]
  const plugins = []

  if (useElement) {
    plugins.push([
      "component",
      {
        libraryName: 'element-ui',
        styleLibrary: {
          // name: '~src/assets/element-theme',
          name: '~node_modules/element-ui/packages/theme-chalk/src',
          base: true,
          // path: '[module]/index.css',
          mixin: true
        },
        ext: '.scss'
      }
    ])
  }
  return {
    presets,
    plugins
  }
}
