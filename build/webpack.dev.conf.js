/**
 * @file 开发环境webpack配置文件
 * 
 */
'use strict'
const path = require('path')
const portfinder = require('portfinder')
const ora = require('ora')
const util = require('./utils/build-util.js')
const config = require('../config')
const webpackConfig = require('./webpack.base.conf')

webpackConfig
  .mode('development')

const {staticDir, indexPath} = util.getServerPaths()
webpackConfig
  .devServer
    .hot(false) // 是否支持热替换【热替换有问题，先置为false，保证可以自动刷新页面】
    .disableHostCheck(true)
    // .inline(true)
    .contentBase(staticDir)
    .watchContentBase(true)
    .publicPath(indexPath || '/')
    // .host(config.localIP)
    .port(config.port)
    .compress(false)
    .open(true) // 是否自动打开浏览器
    .overlay({warnings: false, errors: true}) // 页面是否增加遮罩层显示错误信息
    .writeToDisk(config.writeToDisk) // 是否将生成的文件写入磁盘
    // .progress(true) // 是否显示构建进度日志
    // .watchOptions({ poll: true }) // 会引起CPU占用过高问题
    .quiet(true) // 为了使用FriendlyErrorsPlugin

// history路由模式设置historyApiFallback
let rewrites = []
const publicPath = config.publicPath
if (config.routerMode === 'history' && !config.isMulti) {
  /*if (config.isMulti) {
    rewrites = util.getMutilPageHistoryRewrites()
  } else {

  }*/
  rewrites = [{
    from: new RegExp(`^${path.posix.join(publicPath, '.')}\/?.*$`),
    to: path.posix.join(publicPath, 'index.html')
  }]
  console.log('【connect-history-api-fallback】 rewrites = \n', rewrites)
  webpackConfig
    .devServer
      .historyApiFallback({
        htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
        // verbose: true, // 显示日志
        rewrites
      })
}

// 代理配置
if (config.proxyTable) {
  webpackConfig
    .devServer
      .proxy(config.proxyTable)
}

// 热更替插件
webpackConfig
  .plugin('hmr')
    .use(require('webpack/lib/HotModuleReplacementPlugin'))

// https://github.com/webpack/webpack/issues/6642
webpackConfig
  .output
  .globalObject(`(typeof self !== 'undefined' ? self : this)`)

// module.exports = webpackConfig.toConfig()

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = config.port
  // 获取端口号，如果端口号被占用，自动切换新端口号
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // 重新设置端口号
      webpackConfig.devServer.port(port)

      // 增加构建结果日志信息
      webpackConfig
        .plugin('friendly-errors')
        .use(require('friendly-errors-webpack-plugin'))

      // console.log('>>>>>>>>>>>>>\n', webpackConfig.toString())
      resolve(webpackConfig.toConfig())
    }
  })
})


