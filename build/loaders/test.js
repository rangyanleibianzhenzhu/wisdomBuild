/**
 *
 * 
 * @date 2019/6/20
 */
/*const loader = require('./router-loader')
loader(`
// 所有页面路由，由build/loaders/router-loader收集插入
const allRoutes = {}
// 所有页面使用的路由path，由build/loaders/router-loader收集插入
const allRoutePaths = []

`)*/
const path = require('path')
let outputRoot = path.resolve(__dirname, '../dist/dev')
let publicPath = '/d1ev'

let staticRoot = outputRoot
if (publicPath !== '/' && publicPath!== './') {
  let LocalPublicPath = path.join(publicPath)
  let position = outputRoot.lastIndexOf(LocalPublicPath)
  if (position > -1) {
    staticRoot = outputRoot.substring(0, position)
  }
}
console.log(staticRoot)
