/**
 * @file 构建开发环境
 * 
 */
'use strict'
// 除了执行本文件启动开发环境，还可以使用webpack-dev-server命令启动开发环境，命令为：
// cross-env NODE_ENV=development APP_ENV=dev webpack-dev-server --config build/webpack.dev.conf.js
process.env.APP_ENV = 'dev'
process.env.NODE_ENV = 'development'

const webpack = require('webpack')
const chalk = require('chalk')
const WebpackDevServer = require('webpack-dev-server')
const ora = require('ora')
const util = require('./utils/build-util.js')
const config = require('../config')
const devWebpackConfig = require('./webpack.dev.conf')

function addClient (webpackConfig, projectDevServerOptions) {
  const publicUrl= config.publicPath || '/'
  const sockjsUrl = `?${publicUrl}/sockjs-node`
  const devClients = [
    require.resolve(`webpack-dev-server/client`) + sockjsUrl,
    require.resolve(projectDevServerOptions.hotOnly
      ? 'webpack/hot/only-dev-server'
      : 'webpack/hot/dev-server')
  ]
  addDevClientToEntry(webpackConfig, devClients)
}
function addDevClientToEntry (config, devClient) {
  const { entry } = config
  if (typeof entry === 'object' && !Array.isArray(entry)) {
    Object.keys(entry).forEach((key) => {
      entry[key] = devClient.concat(entry[key])
    })
  } else if (typeof entry === 'function') {
    config.entry = entry(devClient)
  } else {
    config.entry = devClient.concat(entry)
  }
}

devWebpackConfig.then(webpackConfig => {
  const projectDevServerOptions = {
    ...webpackConfig.devServer
  }

  const {indexPath} = util.getServerPaths()
  const port = projectDevServerOptions.port
  const url = `http://${config.localIP}:${port}${indexPath}`

  delete webpackConfig.devServer
  addClient(webpackConfig, projectDevServerOptions)

  // console.log('>>>>>>>>>>>>>>>>>>', webpackConfig)
  const spinner = ora('webpack构建中...').start()
  const compiler = webpack(webpackConfig)

  const server = new WebpackDevServer(compiler, Object.assign({
    clientLogLevel: 'silent',
    contentBase: config.outputRoot,
    watchContentBase: true,
    hot: true,
    quiet: true,
    compress: true,
    publicPath: '/',
    overlay: {warnings: false, errors: true},
    https: false,
  }, projectDevServerOptions, { open: false }))
  ;['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      server.close(() => {
        process.exit(0)
      })
    })
  })

  let isFirstCompile = true
  compiler.hooks.done.tap('app dev', stats => {
    if (isFirstCompile) {
      isFirstCompile = false
      spinner.stop()
      console.info(chalk.green.bold('listening on ' + url))
      if (projectDevServerOptions.open) {
        require('opn')(url)
      }
    } else {
      console.info(chalk.blue.bold(`[${stats.endTime}] 应用热更新`))
    }
  })
  server.listen(port, err => {
    if (err) {
      console.error('Unable to listen for connections', err)
      process.exit(1)
    }
  })
})
