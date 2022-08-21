/**
 * 向js中注入自定义svg注册的代码
 */
// 默认追加在js末尾，使用注释 /* [svg register mark] */ 可指定svg注册代码的位置

'use strict'

const fs = require('fs')
const path = require('path')
const iconConfigPath = require.resolve('../svg-icon.conf.js')
// 代码位置标识
const SVG_REGISTER_MARK = '/* [svg register mark] */'

module.exports = function (source) {
  // 删除require缓存
  delete require.cache[iconConfigPath]

  const iconConfig = require(iconConfigPath)
  const svgDir = iconConfig.svgDir
  const prefix = iconConfig.prefix

  // 验证`svg`文件夹
  try {
    if (!fs.statSync(svgDir).isDirectory()) {
      throw new Error(`Invalid directory of svg: ${svgDir}`)
    }
  } catch (err) {
    this.emitError(err)
    return source
  }

  // 监听`svg`文件夹变化
  this.addContextDependency(svgDir)

  // 监听`svg-icon.conf.js`文件变化
  this.addDependency(iconConfigPath)

  let registerJS = ''
  // 从svg文件夹中取
  fs.readdirSync(svgDir).forEach(file => {
    let svg = fs.readFileSync(path.resolve(svgDir, file), 'utf8')
    let sizeMatch = svg.match(/ viewBox="0 0 (\d+) (\d+)"/)
    let dMatch = svg.match(/ d="([^"]+)"/g)
    // let dMatch = svg.match(/(?<= d=")([^"]+)(?=")/)
    let svgName = prefix + path.basename(file, path.extname(file))

    if (!sizeMatch || !dMatch) {
      return
    }
    let ds = dMatch.map(item => {
      return item.substring(4, (item.length - 1))
    })
    // 注册使用到的svg
    registerJS += ` BaseIcon.register(
            {
                '${svgName}': {
                    width: ${parseInt(sizeMatch[1], 10)},
                    height: ${parseInt(sizeMatch[2], 10)},
                    d: ${JSON.stringify(ds)}
                }
            }); `
  })



  if (source.indexOf(SVG_REGISTER_MARK > -1)) {
    source = source.replace(SVG_REGISTER_MARK, registerJS)
  } else {
    source += registerJS
  }

  return source
}
