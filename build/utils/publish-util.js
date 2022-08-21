/**
 * 项目发布工具
 */
const fs = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')
const compressing = require('compressing')
const axios = require('axios')
const FormData =require('form-data')
const ora = require('ora')
const chalk = require('chalk')
const open = require('opn')


class Publisher {

  constructor(options) {
    this.publishServer = options.publishServer // 部署服务根地址
    this.webUrl = options.webUrl // 测试环境访问地址
  }
  /**
   * 远程部署文件夹
   * @param options
   *          zipDir: 待部署目录
   *          remoteDir: 应用部署在测试服务器的根目录
   * @returns {Promise<void>}
   */
  publishDir ({ zipDir, remoteDir }) {
    console.log(`开始部署目录：zipDir = ${zipDir}, remoteDir = ${remoteDir}`)
    const zipFile = path.join(zipDir, '../', zipDir.match(/[a-zA-Z0-9\-_]+$/) + '.zip')
    return doZip(zipDir, zipFile).then(() => {
      let url = this.publishServer
      let formData  = new FormData()
      let file = fs.createReadStream(zipFile)
      formData.append('file', file)
      formData.append('dir', remoteDir)

      let headers = formData.getHeaders();

      const spinner = ora(`[${remoteDir}] 部署文件上传中...`).start()
      return axios({
        url,
        method: 'POST',
        data: formData,
        headers,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }).then(res=>{
        spinner.stop()
        if (res.data.code == 200) {
          console.log(chalk.green(`目录[${remoteDir}]部署成功！`))
        } else {
          console.error(chalk.red(res.data.message))
        }
      }).catch(err=>{
        spinner.stop()
        console.error(chalk.red(err.message))
      }).finally(() => {
        return doRemove(zipFile)
      })
    })
  }

  /**
   * 远程部署文件
   * @param options
   *          filePath: 待部署文件路径
   *          remotePath: 应用部署在测试服务器的根目录
   * @returns {Promise<void>}
   */
  publishFile ({ filePath, remotePath }) {
    console.log(`开始部署单个文件：filePath = ${filePath}, remotePath = ${remotePath}`)
    let url = this.publishServer + '/single'
    let formData  = new FormData()
    let file = fs.createReadStream(filePath)
    formData.append('file', file)
    formData.append('path', remotePath)
    let headers = formData.getHeaders();

    const spinner = ora(`[${remotePath}] 文件上传中...`).start()
    return axios({
      url,
      method: 'POST',
      data: formData,
      headers,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    }).then(res=>{
      spinner.stop()
      if (res.data.code == 200) {
        console.log(chalk.green(`文件[${remotePath}] 部署成功！`))
      } else {
        console.error(chalk.red(res.data.message))
      }
    }).catch(err=>{
      spinner.stop()
      console.error(chalk.red(err.message))
    })
  }

  /**
   * 打开测试环境
   * @returns {Promise<void>}
   */
  open () {
    if (this.webUrl) {
      return open(this.webUrl)
    }
  }
}

async function doZip (source, dest) {
  try {
    await compressing.zip.compressDir(source, dest)
    console.log(`zip [${source}] to [${dest}] success!`)
  } catch (err) {
    console.error(`zip [${source}] to [${dest}] failed!`, err)
    throw err
  }
}

async function doRemove (targetPath) {
  try {
    await fsExtra.remove(targetPath)
    console.log(`remove path [${targetPath}] success!`)
  } catch (err) {
    console.error(`remove path [${targetPath}] failed!`, err)
    throw err
  }
}

module.exports = Publisher
