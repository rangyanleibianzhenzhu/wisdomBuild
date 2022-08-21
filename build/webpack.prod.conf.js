/**
 * 生产环境webpack配置文件
 * 
 */
'use strict'
const path = require('path')
const config = require('../config')
const util = require('./utils/build-util.js')
const webpackConfig = require('./webpack.base.conf')

// 导出的js文件名称
const jsFileName = util.assetsPath('js/[name].[contenthash:8].js')
webpackConfig
  .output
    .filename(jsFileName)
    .chunkFilename(jsFileName)

// 代码分割配置--------------------
let vendorsMinChunks = 1 // 分割vendors时module的最小使用次数
let commonMinChunks = 2 // 分割common时module的最小使用次数
if (config.isMulti) { // 如果是多页应用，计算minChuncks
  vendorsMinChunks = 2
  const allNum = Object.keys(webpackConfig.entryPoints.entries()).length
  const tempMinChuncks = Math.round(allNum * 0.3) // 模块被30%的chunk使用就抽取公用
  if (tempMinChuncks > 2){
    commonMinChunks = tempMinChuncks
  }
}
// const regTest = /[\\/]node_modules[\\/]/
const splitConfig = {
  vendors: {
    name: 'vendors',
    minChunks: vendorsMinChunks,
    test: /[\\/]node_modules[\\/]/,
    priority: -10,
    chunks: 'initial'
  },
  common: {
    name: 'common',
    minChunks: commonMinChunks,
    priority: -20,
    chunks: 'all',
    reuseExistingChunk: true
  }
}
// 由于 mini-css-extract-plugin bug，不再抽取异步Chunk的公共模块
// https://github.com/webpack-contrib/mini-css-extract-plugin/issues/257
/* if (config.isAsync) {
  splitConfig.async = {
    name: 'async-common',
    minChunks: 2,
    maxAsyncRequests: 3,
    priority: -30,
    chunks: 'async',
    reuseExistingChunk: true
  }
} */
webpackConfig
  .optimization.splitChunks({ name: false, cacheGroups: splitConfig })

// 分割出运行时文件
// 避免某一模块更新后对应异步文件hash改变，影响到app.XXXX.js
// 导致app.XXXX.js文件名改变，用户的缓存失效
webpackConfig
  .optimization.runtimeChunk({name: 'manifest'})

// webpackConfig.optimization.minimize(false) // 不压缩，框架调试用

/* // 预渲染
const prerenderList = config.prerenderList
if (prerenderList && prerenderList.length > 0) {
  const PrerenderSPAPlugin = require('prerender-spa-plugin')
  const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
  const {staticDir, indexPath} = utils.getServerPaths()
  prerenderList.forEach(page => {
    webpackConfig
      .plugin('copy')
      .use(PrerenderSPAPlugin, [{
        staticDir,
        indexPath,
        routes: [ '/' ],
        postProcess (renderedRoute) {
          renderedRoute.outputPath = path.join(staticDir, page === 'index' ? '' : page, 'index.html')
          console.log('###### renderedRoute.outputPath = ', renderedRoute.outputPath)
          return renderedRoute
        },
        renderer: new Renderer({
          // Optional - The name of the property to add to the window object with the contents of `inject`.
          injectProperty: '__PRERENDER_INJECTED',
          inject: {}
        })
      }])
  })
} */

// console.log('>>>>>>>>>>>>>\n', webpackConfig.toString())
module.exports = webpackConfig.toConfig()
