/**
 * @ 构建用到的工具
 * 
 */
'use strict'
const path = require('path')
const fs = require('fs')
const os = require('os')
const webpack = require('webpack')
const ora = require('ora')
const chalk = require('chalk')
const portfinder = require('portfinder')
const exec = require('child_process').exec

const config = require('../../config')

// 获取静态资源路径
exports.assetsPath = function (filePath) {
  const assetsDir = config.assetsDirectory
  return assetsDir
    ? path.posix.join(assetsDir, filePath)
    : filePath
}

// 是否开发环境
exports.isDev = function () {
  return 'dev' === process.env.APP_ENV || 'development' === process.env.NODE_ENV
}
// 是否测试环境
exports.isTest = function () {
  return 'test' === process.env.APP_ENV
}
// 是否生产环境
exports.isProd = function () {
  return 'prod' === process.env.APP_ENV
}
// 获得当前应用的环境
exports.getAppEnv = function () {
  return process.env.APP_ENV
}

// 获得当前项目根目录
exports.getRootPath = function () {
  return path.join(__dirname, '../../')
}

// 检查环境变量
exports.checkProcessEnv = function () {
  // APP_ENV 类型数组
  const appEnvs = config.appEnvs
  if (!process.env.NODE_ENV && !process.env.APP_ENV) {
    console.log(chalk.bgYellow('请定义环境变量：NODE_ENV 和 APP_ENV 【NODE_ENV 的值为 development 或者 production, APP_ENV 的值为 ' + appEnvs.join(' 或者 ') + ' 】'))
  } else if (!process.env.APP_ENV) {
    console.log(chalk.bgYellow('请定义环境变量：APP_ENV 【APP_ENV 的值为 ' + appEnvs.join(' 或者 ') + ' 】'))
  } else if (!process.env.NODE_ENV) {
    console.log(chalk.bgYellow('请定义环境变量：NODE_ENV【NODE_ENV 的值为 development 或者 production】'))
  }

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production'
    console.log(chalk.bgYellow('NODE_ENV 环境变量将默认设置为: ' + process.env.NODE_ENV))
  } else if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'production'){
    process.env.NODE_ENV = 'production'
    console.log(chalk.bgYellow('环境变量 NODE_ENV 的值设置错误，应为 development 或者 production，NODE_ENV 环境变量将默认设置为: ' + process.env.NODE_ENV))
  }
  if (!process.env.APP_ENV) {
    process.env.APP_ENV = 'prod'
    console.log(chalk.bgYellow('APP_ENV 环境变量将默认设置为: ' + process.env.APP_ENV))
  } else if (appEnvs.indexOf(process.env.APP_ENV) === -1){
    process.env.APP_ENV = 'prod'
    console.log(chalk.bgYellow('环境变量 APP_ENV 的值设置错误，应为 ' + appEnvs.join(' 或者 ') + ' ，APP_ENV 环境变量将默认设置为: ' + process.env.APP_ENV))
  }
}

// 多页应用，在pageDir中寻找各个页面入口
exports.getEntries = function (pageDir, entryPath, folders) {
  let entry = {}
  let pageDirPath = path.join(exports.getRootPath(), pageDir)
  folders = folders ||  []

  fs.readdirSync(pageDirPath)
  // 发现文件夹，就认为是页面模块
    .filter(function (f) {
      return fs.statSync(path.join(pageDirPath, f)).isDirectory()
    })
    .forEach(function (f) {
      let tempEntryFilePath = path.join(exports.getRootPath(), [pageDir, f, entryPath].join('/'))
      // 如果有entry.js文件说明是页面，否则是目录
      let isPage = fs.existsSync(tempEntryFilePath)
      if (isPage) { // 如果是页面，添加入口js
        if (entryPath === 'entry.js') { // 如果是多页应用，对路由配置进行校验
          checkRouter(tempEntryFilePath)
        }
        let entryName = [...folders, path.basename(f)].join('_')
        entry[entryName] = [pageDir, f, entryPath].join('/')
      }
      // 则继续遍历
      let subEntry = exports.getEntries(pageDir + '/' + f, entryPath, [...folders, f])
      Object.assign(entry, subEntry)
    })
  return entry
}

// 检查是否存在路由配置，并进行错误提示
function checkRouter(tempEntryFilePath) {
  // router.js 文件路径
  let routerFilePath = path.join(tempEntryFilePath, '../router.js');
  let hasRouter = fs.existsSync(routerFilePath);
  if (!hasRouter) {
    console.log(chalk.red(`[ERROR] 多页应用路由配置错误！\n缺少路由配置文件：${routerFilePath}`));
  }
}

/**
 * 在指定路径中寻找有README.md的基础组件
 * @returns {Array}
 */
exports.getReadmeList = function (scanPath) {
  let readmeList = []
  if (!scanPath) {
    return readmeList
  }
  let baseDir = path.join(exports.getRootPath(), scanPath)

  fs.readdirSync(baseDir)
     // 发现文件夹，就认为是基础组件
    .filter(function (c) {
      return fs.statSync(path.join(baseDir, c)).isDirectory()
    })
    .forEach(function (c) {
      let tempReadmeFilePath = path.join(baseDir, c, 'README.md')
      let hasReadme = fs.existsSync(tempReadmeFilePath)
      if (hasReadme) {
        readmeList.push({
          name: c,
          path: tempReadmeFilePath
        })
      }
    })
  return readmeList
}

/**
 * 进行webpack打包
 * @param webpackConfig webpack配置对象
 * @param skip {Boolean} 是否跳过打包过程，调试时才使用
 * @returns {Promise}
 */
exports.doWebpack = function (webpackConfig, skip) {
  return new Promise( (reselve, reject) => {
    if (skip) {
      reselve()
      return
    }
    let startTime = new Date().getTime();
    const spinner = ora('webpack构建中...').start()
    const compiler = webpack(webpackConfig, (err, stats) => {
      if (err) {
        console.log(chalk.red('webpack构建失败！'), err)
        reject(err)
        return
      }
      if (stats.hasErrors()) {
        console.log(chalk.red('webpack构建失败！'), stats.compilation.errors)
        reject(stats.compilation.errors)
        return
      }
      spinner.stop()
      let endTime = new Date().getTime();
      console.log(chalk.cyan(`webpack构建完毕！共耗时：${Math.round((endTime - startTime) / 1000)}s`))
      reselve(compiler)
    })
  })
}
// 资源管理器中打开某个文件夹
exports.showInExplorer = function (dir) {
  if (os.type().toLowerCase().indexOf('windows') === -1){
    console.warn('非windows系统无法自动打开文件夹', dir)
    return
  }
  if (!dir) {
    console.error('showInExplorer方法需要传入参数：dir')
    return
  }
  try {
    const stat = fs.statSync(dir)
    if (stat.isDirectory()) {
      exec(`explorer.exe /select,"${dir}"`)
    } else {
      console.error( `showInExplorer方法参数错误，"${dir}"不是文件夹路径`)
    }
  } catch (e) {
    console.error( `showInExplorer方法参数错误，文件夹路径"${dir}"不存在`)
  }
}

/**
 * 获取端口号，如果端口号被占用，自动切换新端口号
 */
exports.findPort = function (defaultPort) {
  portfinder.basePort = defaultPort || 3000
  return new Promise((reselve, reject) => {
    portfinder.getPort((err, port) => {
      if (err) {
        console.error('端口号获取异常！', err)
        reject(err)
      } else {
        reselve(port)
      }
    })
  })
}

/**
 * 获取服务启动需要的项目启动路径和项目根路径
 * @returns {staticRoot, indexPath} staticRoot:项目启动路径, indexPath项目根路径
 * 例：
 * 项目输出路径（outputRoot）为/app/webapps/myProject，公共路径（publicPath）为/myProject
 * 那么计算出的启动路径（staticRoot）为/app/webapps, 项目根路径（indexPath）为/myProject
 */
exports.getServerPaths = function () {
  const outputRoot = config.outputRoot
  const publicPath = config.publicPath
  // 项目启动路径
  let staticDir = outputRoot
  // 项目根路径
  let indexPath = ''
  if (publicPath !== '/' && publicPath!== './') {
    let LocalPublicPath = path.join(publicPath)
    // 如果最后一个字符为斜杠去掉斜杠
    LocalPublicPath = LocalPublicPath.replace(/[\/\\]$/, '')
    let position = outputRoot.lastIndexOf(LocalPublicPath)
    if (position > -1) {
      staticDir = outputRoot.substring(0, position)
      indexPath = publicPath
    }
  }
  return { staticDir, indexPath }
}

/**
 * 获取多页应用history模式时需要重写的路由
 * @returns {Array}
 */
exports.getMutilPageHistoryRewrites = function () {
  const vm = require('vm')
  // 截取 “export default” 后面内容的正则
  const ROUTES_LIST_REG = /export default\s?({\s?[\s|\S]*\s?})/
  // 删除 “component=XXX” 的正则
  const REMOVE_COMPONENT_REG = /,?[\s\n\r]*component\s?:\s?\w*,?\b/g
  // 动态路由截取非动态路径的正则
  const ROUTE_BASE_PATH_REG = /^([^\:]+)(\/:[^\/]+)+/
  const publicPath = config.publicPath
  const entryRouters = exports.getEntries('./src/pages', 'router.js')// 遍历所有路由
  const historyRewrites = []

  let curRouterPath, // 当前router.js文件路径
    curContent, // router.js 文件内容
    curResult, // 截取“export default”后面的内容
    curScript, // 处理后可执行的脚本（为了保证该脚本可执行，删除了“component：XXXX，”）
    curRoutes // 当前文件的路由数组
  Object.keys(entryRouters).forEach(entryName => {
    curRouterPath = path.resolve(exports.getRootPath(), entryRouters[entryName]);
    // console.log('curRouterPath =', curRouterPath)
    curContent = fs.readFileSync(curRouterPath, 'utf8')
    curResult = ROUTES_LIST_REG.exec(curContent)
    if (curResult && curResult[1]) {
      curScript = curResult[1].replace(REMOVE_COMPONENT_REG, '')
      curRoutes = vm.runInThisContext(curScript)
      addRewrites(curRoutes, entryName)
    }
  })

  function addRewrites (curRoutes, entryName, parentPath = '') {
    let curFullPath,
      curPathResult,
      curStaticPath,
      curFromPath,
      curToPath,
      curFrom,
      curTo
    curRoutes.forEach(item => {
      if (!(item.path === '/' && item.redirect)) {
        curFullPath = item.path.indexOf(0) === '/' ? item.path : path.posix.join(parentPath, item.path)
        curFromPath = path.posix.join(publicPath, curFullPath === '/' ? '.' : curFullPath)
        curPathResult = ROUTE_BASE_PATH_REG.exec(curFullPath)
        if (curPathResult) {
          curStaticPath = curPathResult[1]
          curFromPath = path.posix.join(publicPath, curStaticPath)
          curFrom = new RegExp(`^${curFromPath}\/?.*$`)
        } else {
          curFrom = new RegExp(`^${curFromPath}\/?$`)
        }
        curToPath = path.posix.join(publicPath, entryName === 'index' ? '.' : entryName.replace('_', '/'))
        curTo = path.posix.join(curToPath, 'index.html')
        historyRewrites.push({
          from: curFrom,
          to: curTo
        })
        if (item.children) {
          addRewrites(item.children, entryName, curFullPath)
        }
      }
    })
  }
  return historyRewrites
}

/**
 * 启动静态服务
 * @param option 参数对象, 例：{port: 9090, staticDirs: [path.join(__dirname, '../dist')], proxyTable: {'/api': 'http://localhost:7070'}}
 * @param staticDirs
 */
exports.startServer = function (option) {
  if (!option) {
    console.log('启动静态服务缺少必要的参数')
    return
  }
  const port = option.port || 9090
  const staticDirs = option.staticDirs || [exports.getRootPath()]
  const proxyTable = option.proxyTable
  const indexPath = option.indexPath
  const publicPath = config.publicPath

  const express = require('express')
  const http = require('http')
  const app = express()

  // 处理history
  /*if (config.isMulti) {
      rewrites = exports.getMutilPageHistoryRewrites()
    } else {

    }*/
  if (config.routerMode === 'history' && !config.isMulti) {
    let rewrites = [{
      from: new RegExp(`^${path.posix.join(publicPath, '.')}\/?.*$`),
      to: path.posix.join(publicPath, 'index.html')
    }]
    console.log(chalk.blue.bold('【connect-history-api-fallback】 rewrites = \n'), rewrites)
    const history = require('connect-history-api-fallback')
    app.use(history({
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
      // verbose: true, // 显示日志
      // disableDotRule: true,
      rewrites
    }))
  }

  // 添加静态资源
  for (let i = 0; i < staticDirs.length; i++) {
    console.log(`express.static('${staticDirs[i]}')`)
    app.use(express.static(staticDirs[i]))
  }

  // 添加代理
  if (proxyTable) {
    const proxyMiddleWare = require("http-proxy-middleware")
    for (let i in proxyTable) {
      console.log(`app.use('${i}', ${JSON.stringify(proxyTable[i])})`)
      app.use(i, proxyMiddleWare(proxyTable[i]))
    }
  }

  // 启动服务
  let server = http.createServer(app)

  exports.findPort(port).then( newPort => {
    let conf = {
      ip: config.localIP,
      port: newPort
    }
    let url = `http://${conf.ip}:${conf.port}${indexPath}`
    server.listen(conf.port, function (error) {
      if (error) {
        console.error('Unable to listen for connections', error)
        process.exit(1)
      }
      console.info(chalk.green.bold('listening on ' + url))
    })

    const open = require('opn')
    open(url)
  })
}

/**
 * 远程发布工具
 * @param remote 远程服务器信息，例：{host: '192.168.0.1', port: '22', username: 'root', password: '123', appRoot: '/app/tomcat/ROOT'}
 * @param localRoot 本地打包根目录，例：'D://workspace/my-project/dist'
 * @returns {{putDir: putDir, putFile: putFile}}
 */
exports.ssh = function (remote, localRoot) {
  const SSH2Utils = require('ssh2-utils')
  const ssh = new SSH2Utils()
  const server = {
    host: remote.host,
    port: remote.port,
    username: remote.username,
    password: remote.password
  }
  const remoteRoot = remote.appRoot

  /**
   * 将目录发布到远程服务器
   * @param dirName 目录相对项目跟目录的路径
   * @returns {Promise}
   */
  function putDir (dirName) {
    let localPath = path.join(localRoot, dirName)
    let remotePath = path.posix.join(remoteRoot, dirName)
    return new Promise((resolve, reject) => {
      console.log('###', server)
      console.log('###', localPath)
      console.log('###', remotePath)
      // putDirSudo ????
      ssh.putDir(server, localPath, remotePath, (err, server, conn) => {
        conn.end()
        if (err) {
          throw new Error(dirName + '目录发布到服务器失败！！！', err)
        } else {
          console.log(dirName + '目录已发布到服务器！')
          resolve()
        }
      })
    })
  }

  /**
   * 将文件发布到远程服务器
   * @param fileName 文件相对项目跟目录的路径
   * @returns {Promise}
   */
  function putFile (fileName) {
    let localFile = path.join(localRoot, fileName)
    let remoteFile = path.posix.join(remoteRoot, fileName)
    return new Promise((resolve, reject) => {
      ssh.putFile(server, localFile, remoteFile, (err, server, conn) => {
        conn.end()
        if (err) {
          throw new Error(fileName + '发布到服务器失败！！！', err)
        } else {
          console.log(fileName + '已发布到服务器！')
          resolve()
        }
      })
    })
  }
  return {
    putDir,
    putFile
  }
}
