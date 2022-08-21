/**
 * @file 构建测试环境
 * 
 */
'use strict'
process.env.APP_ENV = 'test';
process.env.NODE_ENV = 'production';

const program = require('commander');
const chalk = require('chalk');
const util = require('./utils/build-util.js');
const config = require('../config');
const Publisher = require('./utils/publish-util');
const webpackConfig = require('./webpack.prod.conf');

// 打包输出根路径
const outputRoot = config.outputRoot;

program
  .version('0.0.1')
  .option('-s, --start', 'Start Local Service')
  .option('-p, --publish', 'Publish APP Files')
  .parse(process.argv);

// 是否需要启动本地服务
const isNeedStart = program.start;
//是否需要发布到服务器
const isNeedPublish = program.publish;
(async function doPackage () {
  await util.doWebpack(webpackConfig);
  console.log(chalk.rgb(255,255,255).bgGreen.bold('测试环境构建成功！'));
  console.log('文件输出到：', chalk.blue.bold(`${outputRoot}`));

  // 自动打开打包目录（只windows系统有效）
  // util.showInExplorer(outputRoot)

  if(isNeedStart) {
    const {staticDir, indexPath} = util.getServerPaths();
    // 启动本地服务
    util.startServer({
      port: config.port,
      staticDirs: [staticDir],
      indexPath,
      proxyTable: config.proxyTable
    });
    console.log(chalk.green('测试包本地服务已启动！'));
  }

  if(isNeedPublish){
    const publish = config.test.publish;
    const publisher = new Publisher({
      publishServer: publish.publishServer,
      webUrl: publish.webUrl
    });
    await publisher.publishDir({
      zipDir: publish.zipDir,
      remoteDir: publish.remoteRoot
    });
    await publisher.open();
    console.log(chalk.green('测试环境部署完成！'));
  }
})()

