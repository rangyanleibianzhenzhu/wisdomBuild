/**
 * FTP 工具
 * 
 * @date 2019/11/14
 * @see https://github.com/mscdex/node-ftp
 */
const FTP = require('ftp')

class FTPClient {
  /**
   * 构造函数
   * @param option FTP服务器配置，如：{host: 129.0.0.1, port: 21, user:super, password: 123456}
   */
  constructor(option) {
    this.option = option
    this.client = new FTP()
  }

  /**
   * 与FTP服务器建立连接
   * @returns {Promise}
   */
  connect () {
    return new Promise ((resolve, reject) => {
      this.client.on('ready', err => {
        if (err) {
          console.error('FTP 连接失败')
          reject(err)
        } else {
          console.log('FTP 连接成功')
          resolve()
        }
      })
      this.client.connect(this.option)
    })
  }

  /**
   * 关闭与FTP服务器的连接
   */
  end () {
    return this.client.end()
  }

  /**
   * 创建目录
   * @param path  目录路径，例：/root/apps
   * @param recursive 是否级联创建目录, 默认值：true
   * @returns {Promise}
   */
  mkdir (path, recursive = true) {
    return new Promise ((resolve, reject) => {
      this.client.mkdir(path, recursive, err => {
        if (err) {
          console.error('FTP 目录创建失败！', path)
        } else {
          console.log('FTP 目录创建成功！', path)
        }
        resolve()
      })
    })
  }

  /**
   * 上传文件
   * @param input 本地文件路径，例：D:\workspace\demo-project\dist\demo.zip
   * @param destPath 目标路径，即要创建的FTP服务器上文件路径，例：/root/apps/demo.zip
   * @param useCompression 是否压缩，默认：false
   * @returns {Promise}
   */
  put (input, destPath, useCompression = false) {
    return new Promise ((resolve, reject) => {
      this.client.put(input, destPath, useCompression, err => {
        if (err) {
          console.error('FTP 文件上传失败！', `from [${input}] to [${destPath}]`)
        } else {
          console.log('FTP 文件上传成功！', `from [${input}] to [${destPath}]`)
        }
        resolve()
      })
    })
  }
}

module.exports = FTPClient
