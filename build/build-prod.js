/**
 * @file 构建生产环境的包
 * 
 */
'use strict'
process.env.APP_ENV = 'prod'
process.env.NODE_ENV = 'production'

const path = require('path')
const fs = require('fs-extra')
const program = require('commander')
const chalk = require('chalk')
const compressing = require('compressing')

const util = require('./utils/build-util.js')
const timeUtil = require('./utils/time-util.js')
const FTPClient = require('./utils/ftp-client.js')
const gitUtil = require('./utils/git-util.js')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
// 项目启动根路径和项目请求根路径
const {staticDir, indexPath} = util.getServerPaths()
// 打包输出根路径
const outputRoot = config.outputRoot
// 被压缩的目录
const zipDir = config.prod.zipDir ? config.prod.zipDir : staticDir
// 压缩包名称
const zipFileName = `${config.prod.packageName}.zip`

program
  .version('0.0.1')
  .option('-s, --start', 'Start Local Service')
  .option('-z, --zip', '打zip包')
  .option('-f, --ftp', '上传到ftp')
  .option('-a, --analyze', 'Analyze Your Bundle')
  .option('-g, --git', 'Check code has been submitted to GIT')
  .parse(process.argv)

// 是否需要启动本地服务
const isNeedStart = program.start
// 是否需要对打包的代码进行分析
const isNeedAnalyze = program.analyze
// 是否需要将项目打成zip包
const isNeedZip = program.zip || program.ftp
// 是否需要将上线包上传到FTP
const isNeedFtp = program.ftp
// 是否需要校验本地代码同步到 git 远程库
const isCheckGit = program.git

// 检查本地代码是否提交到远端
if (isCheckGit && !gitUtil.gitCheck()) {
  return
}

// 如果对打包代码进行分析，增加分析插件
if (isNeedAnalyze) {
  // process.env.npm_config_report = true
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

async function doRemove (targetPath) {
  try {
    await fs.remove(targetPath)
    console.log(`remove path [${targetPath}] success!`)
  } catch (err) {
    console.error(`remove path [${targetPath}] failed!`, err)
  }
}

async function createFile (fileName, contentText) {
  const filePath = path.join(outputRoot, fileName)
  try {
    fs.writeFileSync(filePath, contentText, { 'flag': 'w' })
    console.log(`create file [${filePath}] success!\n${chalk.gray(contentText)}`)
  } catch (err) {
    console.error(`create file [${filePath}] failed!`, err)
  }
}

async function doZip () {
  try {
    // 压缩后文件路径
    var zipPath = path.join(zipDir, '../', zipFileName)
    await compressing.zip.compressDir(zipDir, zipPath)
    console.log(`zip [${zipDir}] to [${zipPath}] success!`)
  } catch (err) {
    console.error(`zip [${zipDir}] to [${zipPath}] failed!`, err)
  }
}

async function doUploadFTP () {
  const today = new Date()
  const localPath = path.join(zipDir, '../')
  const remotePath = `/OnlineTest_v${today.getDay()}_${timeUtil.formatTime(today, 'yyyyMMdd')}/nginx-static`
  const ftpClient = new FTPClient(config.prod.ftp)
  await ftpClient.connect()
  await ftpClient.mkdir(remotePath)
  await ftpClient.put(path.join(localPath, zipFileName), path.posix.join(remotePath, zipFileName))
  await ftpClient.end()
}

async function doPackage () {
  await doRemove(path.join(zipDir, '../'))
  await util.doWebpack(webpackConfig).then(() => {
    console.log(chalk.rgb(255, 255, 255).bgGreen.bold('生产环境构建成功！'))
    console.log('文件输出到：', chalk.blue.bold(`${outputRoot}`))
  })

  if (isCheckGit) {
    // 创建打包信息文件
    createFile('package_info.txt', gitUtil.getGitInfo())
  }

  await util.showInExplorer(path.join(zipDir, '../'))
  if(isNeedStart) {
    // 启动本地服务
    util.startServer({
      port: config.port,
      staticDirs: [staticDir],
      indexPath,
      proxyTable: config.proxyTable
    })
  }
  if (isNeedZip) {
    await doZip()
    if(!isNeedStart) {
      await doRemove(zipDir)
    }
  }
  if (isNeedFtp) {
    await doUploadFTP()
  }
}

// 进行打包
doPackage()
