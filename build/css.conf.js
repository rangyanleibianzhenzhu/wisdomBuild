/**
 * 样式相关配置
 * 
 * @date 2019/5/30
 */
const path = require('path')
const util = require('./utils/build-util.js')
const config = require('../config')

module.exports = (webpackConfig) => {
  const isDev = util.isDev()
  // see: https://sass-lang.com/documentation/js-api#outputstyle
  const defaultSassLoaderOptions = { outputStyle: 'expanded' }
  try {
    defaultSassLoaderOptions.implementation = require('sass')
    defaultSassLoaderOptions.fiber = require('fibers')
  } catch (e) {}

  const modules = false,
    extract = !isDev,
    sourceMap = config.sourceMap,
    loaderOptions = {}

  const hasPostCSSConfig = true
  const needInlineMinification = !isDev

  const cssLoaderOptions = Object.assign({
    sourceMap,
    importLoaders: (
      1 + // stylePostLoader injected by vue-loader
      (hasPostCSSConfig ? 1 : 0) +
      (needInlineMinification ? 1 : 0)
    )
  }, loaderOptions.css)

  const cssnanoOptions = {
    preset: ['default', {
      mergeLonghand: false,
      cssDeclarationSorter: false
    }]
  }
  if (sourceMap) {
    cssnanoOptions.map = { inline: false }
  }

  createCSSRule('css', /\.css$/)
  createCSSRule('postcss', /\.p(ost)?css$/)
  createCSSRule('scss', /\.scss$/, 'sass-loader', defaultSassLoaderOptions)
  /* createCSSRule('sass', /\.sass$/, 'sass-loader', Object.assign(defaultSassLoaderOptions, {
    indentedSyntax: true
  }))
  createCSSRule('less', /\.less$/, 'less-loader', {})
  createCSSRule('stylus', /\.styl(us)?$/, 'stylus-loader', {
    preferPathResolver: 'webpack'
  }) */

  // 创建CSS规则
  function createCSSRule (lang, test, loader, options) {
    const baseRule = webpackConfig.module.rule(lang).test(test)

    /*// rules for <style lang="module">
    const vueModulesRule = baseRule.oneOf('vue-modules').resourceQuery(/module/)
    applyLoaders(vueModulesRule, true)*/

    // rules for <style>
    const vueNormalRule = baseRule.oneOf('vue').resourceQuery(/\?vue/)
    applyLoaders(vueNormalRule, false)

    /*// rules for *.module.* files
    const extModulesRule = baseRule.oneOf('normal-modules').test(/\.module\.\w+$/)
    applyLoaders(extModulesRule, true)*/

    // rules for normal CSS imports
    const normalRule = baseRule.oneOf('normal')
    applyLoaders(normalRule, modules)

    function applyLoaders (rule, modules) {
      if (extract) {
        rule
          .use('extract-css-loader')
          .loader(require('mini-css-extract-plugin').loader)
      } else {
        rule
          .use('vue-style-loader')
          .loader('vue-style-loader')
          .options({
            // hmr: isDev,
            sourceMap,
            shadowMode: false
            // shadowMode // ????????????????????
          })
      }

      if (modules) {
        const {
          localIdentName = '[name]_[local]_[hash:base64:5]'
        } = loaderOptions.css || {}
        Object.assign(cssLoaderOptions, {
          modules,
          localIdentName
        })
      }

      rule
        .use('css-loader')
        .loader('css-loader')
        .options(cssLoaderOptions)

      if (needInlineMinification) {
        rule
          .use('cssnano')
          .loader('postcss-loader')
          .options({
            sourceMap,
            plugins: [require('cssnano')(cssnanoOptions)]
          })
      }

      if (hasPostCSSConfig) {
        rule
          .use('postcss-loader')
          .loader('postcss-loader')
          .options(Object.assign({ sourceMap }, loaderOptions.postcss))
      }

      if (loader) {
        rule
          .use(loader)
          .loader(loader)
          .options(Object.assign({ sourceMap }, options))
      }
    }
  }

  if (!isDev) {
    // 生成单独的css
    const cssFileName = util.assetsPath('css/[name].[contenthash:8].css')
    webpackConfig
      .plugin('extract-css')
      .use(require('mini-css-extract-plugin'), [{
        filename: cssFileName,
        chunkFilename: cssFileName
      }])

    // 压缩css
    webpackConfig
      .plugin('optimize-css')
      .use(require('@intervolga/optimize-cssnano-plugin'), [{
        sourceMap: sourceMap,
        cssnanoOptions
      }])
  }

}

