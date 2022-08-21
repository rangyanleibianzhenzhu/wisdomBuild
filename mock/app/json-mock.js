/**
 * json方式模拟接口
 * 1. 固定路径
 * 接口路径为 /api/user/getUser
 * 添加文件 /mock/json//api/user/getUser.json 来设置接口返回的数据
 * 2. 路径的最后一级为动态参数（如果除了路径最后一级还有动态参数需要使用js的方式来模拟接口）
 * 接口路径为 /api/role/{roleId}
 * 添加文件 /mock/json//api/role/$.json 来设置接口返回的数据
 * 3. 指定数据用例
 * 如果不同的业务场景下需要返回的数据不同可以增加新的数据用例
 * 数据用例可以在 /mock/app/cases/sysCase.js 文件中添加，也可以增加新的数据用例组
 * 示例:
 * /api/user/getUser 接口用来获取当前用户信息，默认返回 /mock/json//api/user/getUser.json 的数据，此数据是普通用户的信息。
 * 但是有时需要使用管理员的数据来实现交互场景，就需要单独设置管理员的数据用例。
 * 1) 在相同的目录下增加新的数据文件，例如：/mock/json//api/user/getUser_admin.json，“_”后面的后缀是自定义的
 * 2) 在数据用例组中增加数据用例，如下：
 * // 系统 - 管理员登录
 *  'adminLogin': {
 *     '/api/user/getUser': 'admin' // 'admin' 指 getUser_admin.json 文件名 “_” 后面的自定义后缀
 *   }
 * 3) /mock/app/json-mock-case.js 中的 curCases 属性设置为定义的数据用例名 ['adminLogin']
 *    curCases的值为数组可以同时使用多个数据用例
 */
const path = require('path')
const url = require('url')
const fs = require('fs')
const router = require('express').Router()
const jsonMockCase = require('./json-mock-case')
const replaceJsonMap = {}
jsonMockCase.curCases.forEach((caseName) => {
  let cases = jsonMockCase.getCase(caseName)
  if (cases) {
    for (let key in cases) {
      replaceJsonMap[key] = cases[key]
    }
  }
})
console.log('replaceJsonMap=', JSON.stringify(replaceJsonMap))

router.use('*', (req, res) => {
  let pathname = url.parse(req.baseUrl).pathname
  let endIndex = pathname.lastIndexOf('.do')
  if (endIndex > -1) {
    pathname = pathname.substring(0, endIndex)
  }
  let params = url.parse(req.url, true).query
  console.log(pathname, '[params] = ', params)
  console.log(pathname, '[data] = ', req.body)
  let dataPath = path.resolve(__dirname, '../json' + pathname)
  let dataFile = dataPath + '.json'
  let isFileExist = fs.existsSync(dataFile)
  if (!isFileExist) { // 当指定路径的文件名不存在时,判断最后一级路径是否存在动态参数
    // 路由最后一个为动态参数时，文件名可以为$.json
    let dynamicPathname = pathname.substring(0, pathname.lastIndexOf('/')) + '/$'
    let dynamicPath = path.resolve(__dirname, '../json' + dynamicPathname)
    let dynamicFile = dynamicPath + '.json'
    let isDynamicFileExist = fs.existsSync(dynamicFile)
    if (isDynamicFileExist) {
      pathname = dynamicPathname
      dataPath = dynamicPath
      dataFile = dynamicFile
    }
  }
  // 如果存在当前mock数据用例有指定后缀，则获取指定后缀的文件
  if (replaceJsonMap[pathname]) {
    dataFile = dataPath + '_' + replaceJsonMap[pathname] + '.json'
  }
  console.log('读取数据文件：', dataFile)
  let data = fs.readFileSync(dataFile, 'utf-8')
  if (params.callback) {
    data = `${params.callback}(${data})`
  }
  // 模拟服务端接口调用延时
  setTimeout(function () {
    res.send(data)
    res.end()
  }, 500)
})
module.exports = router
