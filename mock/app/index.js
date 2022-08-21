/* eslint-disable promise/param-names */
const express = require('express')
const conf = require('./config')
const http = require('http')
const path = require('path')
const bodyParser = require('body-parser')
const portfinder = require('portfinder')
const os = require('os')
const chalk = require('chalk')

const jsMock = require('./js-mock')
const jsonMock = require('./json-mock')

// 需要鉴权的接口(可以是字符串也可以是正则表达式)
const authUrls = [
  '/api/user/getUser'
  // /^\/api\/user/
]
// 是否需要进行鉴权校验
function needAuthCheck (url) {
  for (let i = 0; i < authUrls.length; i++) {
    let item = authUrls[i]
    if (typeof item === 'string') {
      if (item === url) {
        return true
      }
    } else if (item instanceof RegExp) {
      if (item.test(url)) {
        return true
      }
    }
  }
  return false
}

function startApp (app) {
  app.use(bodyParser.json())
  // app.use(bodyParser.urlencoded({ extended: false }))
  // 普通静态资源
  app.use(express.static(path.join(__dirname, '../static')))
  // 上传的静态资源
  app.use('/resources', express.static(path.join(__dirname, '../../dist/upload')))
  // 设置跨域访问
  app.all('*', function (req, res, next) {
    res.set({
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      'X-Powered-By': ' 3.2.1',
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Expose-Headers': '*'
    })

    if (req.method.toUpperCase() === 'OPTIONS') {
      console.log(`[${req.method}]请求url:${req.url}`)
      res.end()
    } else {
      console.log(`[${req.method}]请求url:${req.url}`)
      console.log('请求头信息：', req.headers)
      if (needAuthCheck(req._parsedUrl.pathname)) { // 进行鉴权校验
        if (!(req.headers.cookie && req.headers.cookie.includes('session_id=mock'))) { // 如果session已过期
          // 如果记住密码信息未过期
          if (req.headers.cookie && req.headers.cookie.includes('remember_token=W1s3N10sIiQyYSQxMCRCSm5lM2JK')) {
            // 获取记住密码进行自动登录
            res.cookie('session_id', 'mock', {
              path: '/',
              maxAge: 30 * 60 * 1000, // 有效期30分（单位为毫秒）
              httpOnly: true
            })
            next()
          } else {
            res.json({ code: 401, message: '未登录' })
          }
        } else {
          next()
        }
      } else {
        next()
      }
    }
  })

  const server = http.createServer(app)

  findPort(conf.port).then(port => {
    if (Number(conf.port) !== port) {
      console.log(chalk.yellowBright(`由于 ${conf.port} 端口号已被占用，mock 服务使用 ${port} 端口号`))
    }
    server.listen(port, '0.0.0.0', function (error) {
      if (error) {
        console.error('Unable to listen for connections', error)
        process.exit(10)
      }
      console.info('模拟后台接口 listening on http://' +
        getLocalIP() + ':' + port)
    })
    app.use('/api', jsMock)
    app.use('/api', jsonMock)
  })

  // 获取端口号，如果端口号被占用，自动切换新端口号
  function findPort (defaultPort) {
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
}

// 获取本地IP
function getLocalIP () {
  let interfaces = os.networkInterfaces()
  for (let devName in interfaces) {
    let iface = interfaces[devName]
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
  return 'localhost'
}

module.exports = function () {
  const app = express()
  startApp(app)
  return app
}
