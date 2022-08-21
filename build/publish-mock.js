/**
 * @file 发布mock服务到测试环境
 */
'use strict'
const path = require('path');
const chalk = require('chalk');
const config = require('../config');
const Publisher = require('./utils/publish-util');

(async function doPublish () {
  const publishServer = config.test.publish.publishServer;
  const remoteRoot = '/app/node-apps/mock';

  const publisher = new Publisher({ publishServer });
  await publisher.publishDir({
    zipDir: path.join(__dirname, '../mock/app'),
    remoteDir: path.posix.join(remoteRoot, 'app')
  });
  await publisher.publishDir({
    zipDir: path.join(__dirname, '../mock/json'),
    remoteDir: path.posix.join(remoteRoot, 'json')
  });
  await publisher.publishDir({
    zipDir: path.join(__dirname, '../mock/mockjs'),
    remoteDir: path.posix.join(remoteRoot, 'mockjs')
  });
  await publisher.publishFile({
    filePath: path.join(__dirname, '../mock/index.js'),
    remotePath: path.posix.join(remoteRoot, 'index.js')
  });
  await publisher.publishFile({
    filePath: path.join(__dirname, '../mock/package.json'),
    remotePath: path.posix.join(remoteRoot, 'package.json')
  });
  console.log(chalk.green('mock服务发布成功！'));
})();
