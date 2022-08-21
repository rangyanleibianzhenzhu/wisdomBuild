/**
 *
 * 
 * @date 2019/7/2
 */
const path = require('path')
const glob = require('glob')
const Client = require('ssh2').Client

class SSHClient {
  constructor ( remote, localRoot = '/', remoteRoot = '/') {
    if (!remote) {
      throwError('[ssh-client] 参数remote（远程服务器信息）不能为空', this)
    }
    this.server = remote
    this.remoteRoot = remoteRoot
    this.localRoot = localRoot
    // this.needSudo = needSudo
    this.conn = new Client()
  }
  connect () {
    return new Promise( (reselve, reject) => {
      this.conn.on('ready', () => {
        // console.log('Client :: ready')
        reselve(this)
        /*if (this.needSudo) {
          this.sudo().then(() => {
            reselve(this)
          })
        } else {
          reselve(this)
        }*/
        // conn.exec('sudo su -', { pty: true }, execCallback);
        // conn.exec('rm -r -f /app/lin_test', { pty: true }, execCallback)
      }).connect({
        keepaliveCountMax: 20,
        host: this.server.host,
        port: this.server.port,
        username: this.server.username,
        password: this.server.password
        // readyTimeout: 20000
      })
    })
  }
  sudo () {
    return this.exec('sudo su -', { pty: true })
  }

  exec (command, options) {
    return new Promise( (reselve, reject) => {
      const res = this.conn.exec(command, Object.assign({ /*pty: true*/ }, options), (err, stream) => {
        execCallback(err, stream, this, command,reselve, reject)
      })
      // console.log(`[${command}] exec return ${res}`)
    })
  }

  rmdir (dir) {
    if (dir === '' || dir === '/') {
      throwError('[ssh-client] 不可删除远程服务器根路径！', this)
    }
    return this.exec(`rm -fr ${dir}`)
  }
  mkdir (dir) {
    return this.exec(`mkdir -p ${dir}`)
  }

  putFiles (files, basePath = '', ignoreRoot) {
    const client = this
    const fileList = []
    let from, to
    files.forEach(file => {
      if (!ignoreRoot) {
        from = path.join(this.localRoot, basePath, file)
        to = path.posix.join(this.remoteRoot, basePath, file)
      } else {
        from = path.join(basePath, file)
        to = path.posix.join(basePath, file)
      }
      fileList.push({from, to})
    })

    return new Promise( (reselve, reject) => {
      // console.log('#### files length = ', files.length)
      let successNums = 0

      this.conn.sftp((err, sftp) => {
        if (err) {
          console.error(err)
          throwError(`[ssh-client] [${from}]文件传输失败！【${err.message}】`, client)
        }
        let readStream, witeStream, offset = 0, position = 0, length = 128, buffer = new Buffer(128)
        fileList.forEach(({from, to}) => {
          console.log('### form = ', from)
          console.log('### to = ', to)
          sftp.fastPut(from, to, getCallback(to))
        })
        function getCallback (file) {
          return function (err) {
            if (err) {
              if (err.message === 'Permission denied') {
                console.error(`[ssh-client] [权限不足！] 请检查用户 ${client.server.username} 是否有目录 ${client.remoteRoot} 及子目录的读写权限，如果没有请用root用户执行命令：chmod 777 ${client.remoteRoot} -R`)
              }
              console.error('[ssh-client] [ERROR] \n', err)
              throwError(`[ssh-client] [${file}]文件传输失败！【${err.message}】`, client)
            }
            successNums++
            console.log(`[ssh-client] [${successNums}]putFile [${file}] finish`)
            if(successNums >= files.length) {
              // console.log('文件批量上传结束')
              sftp.end()
              reselve(client)
            }
          }
        }
      })
      })
  }

  putFile (localFile, remoteFile, ignoreRoot) {
    // console.log('>>>>>>>>>>> putFile', localFile)
    remoteFile = remoteFile || localFile
    let from, to
    if (!ignoreRoot) {
      from = path.join(this.localRoot, localFile)
      to = path.posix.join(this.remoteRoot, remoteFile)
    } else {
      from = localFile
      to = remoteFile
    }

    // console.log('>>>>>>>>>>> localFile', from)
    // console.log('>>>>>>>>>>> remoteFile', to)
    return new Promise( (reselve, reject) => {
      this.conn.sftp((err, sftp) => {
        if (err) {
          console.error(err)
          throwError(`[ssh-client] [${from}]文件传输失败！【${err.message}】`, this)
        }
        sftp.fastPut(from, to, err => {
          if (err) {
            if (err.message === 'Permission denied') {
              console.error(`[ssh-client] [权限不足！] 请检查用户 ${this.server.username} 是否有目录 ${this.remoteRoot} 及子目录的读写权限，如果没有请用root用户执行命令：chmod 777 ${this.remoteRoot} -R`)
            }
            console.error('[ssh-client] [ERROR] \n', err)
            throwError(`[ssh-client] [${from}]文件传输失败！【${err.message}】`, this)
          }
          console.log(`[ssh-client] putFile [${localFile}] finish`)
          sftp.end()
          reselve(this)
        })
      })
    })
  }

  putDir (dirName = '') {
    const client = this
    const remotePath = path.posix.join(this.remoteRoot, dirName)
    const localPath = path.join(this.localRoot, dirName)
    console.log('############# localPath = ', localPath)
    console.log('############# remotePath = ', remotePath)
    // 创建所有子目录
    async function mkdirs (dirs, basePath, client) {
      let to, dir
      for (let i = 0; i < dirs.length; i++) {
        // if( i > 7 ) break
        dir = dirs[i]
        to = path.posix.join(client.remoteRoot, basePath, dir)
        // console.log(`[ssh-client] mkdir [${to}]`)
        await client.mkdir(to)
      }
    }
    async function mkdirsAndputFiles ({dirs, files}, basePath, client) {
      // console.log('>>>>>>>>>>>> dirs', dirs)
      // console.log('>>>>>>>>>>>> files', files)
      await mkdirs(dirs, basePath, client)
      await client.putFiles(files, basePath)
    }
    return new Promise((resolve, reject) => {
      this.rmdir(remotePath)
      .then(client => client.mkdir(remotePath))
      .then(client => scanLocalDirectory(localPath))
      .then((scanResult) => {
        // const {dirs, files} = scanResult
        // console.log('>>>>>>>>>', dirs)
        // console.log('>>>>>>>>>', files)
        mkdirsAndputFiles(scanResult, dirName, client)
          .then(() => {resolve(client)})
      })
    })
  }

  end () {
    this.conn.end()
    // console.log('####### END')
    // setTimeout(() => {this.conn.end()}, 3000)
  }
}

// 执行脚本后的回调函数
function execCallback(err, stream, client, command, reselve, reject) {
  let stderr = '';
  let stdout = '';
  if (err) {
    console.error(`[${command}] callback ERROR`, err)
    throwError(`[ssh-client] 执行远程命令失败！【${err.message}】`, client)
  }
  stream.stderr.on('data', function(data){
    stderr += data.toString()
  })
  stream.on('data', function (data) {
    stdout += data.toString()
    console.log(`[ssh-client] [${command}]stream STDOUT:`, stdout)
  })
  stream.on('close', function(){
    if(stderr){
      console.log(`[${command}] STDERR: `, stderr)
      new throwError(`[ssh-client] 执行远程命令失败！${stderr}`, client)
    }
    console.log(`[ssh-client] exec [${command}] finish`)
    reselve && reselve(client)
  })
  // console.log(`[${command}] CALLBACK`)
  stream.close()
}

// 异常处理函数
function throwError (msg, client) {
  // console.log('####### ERROR')
  client.conn.end()
  throw new Error(msg)
}

// 扫描本地文件夹函数
function scanLocalDirectory(localPath){
  return new Promise( (reselve, reject) => {
    const options = {
      cwd: localPath
    }
    glob('**/', options, function (er, dirs) {
      options.nodir = true;
      glob('**', options, function (er, files) {
        reselve({dirs, files});
      })
    })
  })
}

module.exports = SSHClient


/*const sshClient = new SSHClient(
  {
    host: '10.100.147.39',
    port: 22,
    username: 'newsettle',
    password: 'newsettle@123'
  },
  path.join(__dirname, '../dist/prod'),
  '/app/ns4-node/vue-demo',
  true
).connect()
  // .then(client => client.exec('rm -r -f /app/lin_test'))
  // .then(client => client.exec('mkdir -p /app/lin_test'))
  // .then(client => client.exec('mkdir -p /app/lin_test/static'))
  // .then(client => client.putFile('index.html'))
  // .then(client => client.putFiles([ 'qqqindex.html' ]))
  .then(client => client.putDir())
  .then(client => client.end())
  .catch(e => {
    console.log( e)
  })*/


