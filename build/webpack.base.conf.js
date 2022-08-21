/**
 * @file webpack基本配置文件
 * 
 */
'use strict'
const path = require('path')
const fs = require('fs')
const Config = require('webpack-chain')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const util = require('./utils/build-util.js')
const config = require('../config')
const cssConf = require('./css.conf')

// 应用入口文件名称
const appFileName = config.isMulti ? 'app-multi.js' : 'app-single.js'
// 默认页面配置信息(目前只有页面标题的配置项)
const defaultPageInfo = {
  title: config.appName
}

// 检查环境变量
util.checkProcessEnv()

const webpackConfig = new Config()
webpackConfig
  .mode(process.env.NODE_ENV)
  .target('web')
  .context(path.resolve(__dirname, '../'))

// 入口文件配置
webpackConfig
  .entry('app')
    .add(`./src/${appFileName}`)
    .end()

webpackConfig.output
    .path(config.outputRoot)
    .filename('[name].js')
    .publicPath(config.publicPath)

webpackConfig.resolve
  .set('symlinks', false) // 将符号链接(symlink)解析到它们的符号链接位置
  .extensions
    .merge(['.js', '.jsx', '.vue', '.json']) // 自动解析确定的扩展
    .end()
  .alias
    .set('@', path.join(__dirname, '..', 'src'))
    .set('vue$', util.isDev() ? 'vue/dist/vue.esm.js' : 'vue/dist/vue.runtime.esm.js')

// resolveLoader-----------------
webpackConfig.resolveLoader.modules
  .add('node_modules')
  .add(path.join(__dirname, './loaders'))

// 防止 webpack 解析那些任何与给定正则表达式相匹配的文件。
// 忽略的文件中不应该含有 import, require, define 的调用，或任何其他导入机制。
// 忽略大型的 library 可以提高构建性能。
webpackConfig.module
  .noParse(/^(vue|vue-router|vuex|vuex-router-sync)$/)

webpackConfig.module
  .rule('app-pre')
    .test(new RegExp(`${appFileName}$`))
    // 自动加载src/assets/icon下的svg图标
    .use('svg-loader')
      .loader('svg-loader')
      .end()
    .enforce('pre')

// 根据配置文件配置项条件判断注释代码，参考 build/loaders/condition-comment-loader.js
webpackConfig.module
  .rule('condition-comment')
    .test(/(\.vue$)|(\.jsx?$)/)
    .use('condition-comment-loader')
      .loader('condition-comment-loader')
      .end()
    .enforce('pre')

if (config.useElement) {
  // 如果使用了 Element 组件库，所有样式使用本系统定义的变量，自动引入 element-variables.scss
  webpackConfig.module
    .rule('element-style-pre')
      .test(/element-ui.+\.scss$/)
      .use('element-style-var-loader')
        .loader('element-style-var-loader')
        .end()
      .enforce('pre')
}

// js 配置
webpackConfig.module
  .rule('js')
    .test(/\.m?jsx?$/)
    .exclude
      .add(filepath => {
        // 不处理 node_modules 中非vue文件
        if (/node_modules/.test(filepath)) {
          return true
        }
        // 处理项目中 vue 文件和 js 文件
        if (/(\.vue$)|(\.jsx?$)/.test(filepath)) {
          return false
        } else {
          return true
        }
      })
      .end()
    .use('babel-loader')
      .loader('babel-loader')

// vue-loader --------------------
// let vueLoaderCacheConfig = utils.getCacheConfig()
webpackConfig.module
  .rule('vue')
    .test(/\.vue$/)
    .use('vue-loader')
      .loader('vue-loader')
      .options({
        compilerOptions: {
          preserveWhitespace: false
        }
      })
      .end()
    .use('theme-loader')
      .loader('theme-loader')
      .options({ injectInVueFile: true })

webpackConfig
  .plugin('vue-loader')
  .use(require('vue-loader/lib/plugin'))

// 静态资源配置 --------------------
webpackConfig.module
  .rule('images')
    .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
    .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 5000,
        name: util.assetsPath('img/[name].[hash:7].[ext]')
      })

// svg 不用内联方式
// see https://github.com/facebook/create-react-app/pull/1180
webpackConfig.module
  .rule('svg')
    .test(/\.(svg)(\?.*)?$/)
    .use('file-loader')
      .loader('file-loader')
      .options({
        name: util.assetsPath('img/[name].[hash:7].[ext]')
      })

const genUrlLoaderOptions = dir => {
  return {
    limit: 4096,
    // use explicit fallback to avoid regression in url-loader>=1.1.0
    fallback: {
      loader: 'file-loader',
      options: {
        name: util.assetsPath(`${dir}/[name].[hash:8].[ext]`)
      }
    }
  }
}
webpackConfig.module
  .rule('media')
    .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
    .use('url-loader')
      .loader('url-loader')
      .options(genUrlLoaderOptions('media'))

webpackConfig.module
  .rule('fonts')
    .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
    .use('url-loader')
      .loader('url-loader')
      .options(genUrlLoaderOptions('fonts'))

webpackConfig.module
  .rule('text')
    .test(/\.(txt)(\?.*)?$/)
    .use('raw-loader')
      .loader('raw-loader')

// css相关配置
cssConf(webpackConfig)

// devtool-----------------------
if (config.sourceMap && config.devtool) {
  webpackConfig.devtool(config.devtool)
}

//  插件-------------------------
// 配置的全局常量(编译时会直接做文本替换，给定的值必须包含字符串本身的引号，例：'"production"')
// 项目根路径
let indexPath = path.posix.join(config.publicPath, '/')
webpackConfig
  .plugin('define')
    .use(require('webpack/lib/DefinePlugin'), [{
      // NODE_ENV 环境变量，开发环境为: 'development', 为了保证测试环境打的包与生产环境一致，测试环境和生产环境都为'production'
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      // 当前应用的环境（开发环境为: 'dev'，测试环境为: 'test', 生产环境为: 'prod'）
      'process.env.APP_ENV': JSON.stringify(process.env.APP_ENV),
      // 后台接口请求地址
      'API_BASE_URL': JSON.stringify(config.apiBaseUrl),
      // 后台接口响应配置
      'API_RESPONSE_CONFIG': JSON.stringify(config.apiResponseConfig),
      // 首页路径
      'APP_INDEX_PATH': JSON.stringify(indexPath),
      // 路由模式
      'APP_ROUTER_MODE': JSON.stringify(config.routerMode),
      // 路由根路径
      'APP_ROUTER_ROOT': JSON.stringify(config.routerMode === 'history' ? indexPath : ''),
      // 是否多页应用
      'APP_IS_MULTI': JSON.stringify(config.isMulti),
      // PC端是否显示功能切换tab页签
      'APP_SHOW_TABS': JSON.stringify((!config.isMulti) && config.showTabs),
      // 是否使用Element组件库
      'APP_USE_ELEMENT': JSON.stringify(config.useElement),
    }])

// 打包前清除输出目录
if (!util.isDev() || config.writeToDisk) {
  webpackConfig
    .plugin('clean')
    .use(require('clean-webpack-plugin'))
}

// 导出html
webpackConfig
  .plugin('html')
    .use(require('html-webpack-plugin'), [{
      pageInfo: defaultPageInfo,
      filename: 'index.html',
      template: './src/index.html',
      inject: true
    }])

// 复制静态资源
webpackConfig
  .plugin('copy-static')
  .use(CopyWebpackPlugin, [[
    { from: path.join(__dirname, '../', 'public'), to: config.outputRoot }
  ]])

// 如果是移动端项目
if (config.isMobile) {
  // html 注入行内脚本：移动端自适应处理脚本
  webpackConfig
    .plugin('flexible')
    .use(require('./plugin/inline-script-html-webpack-plugin'), [{
      filePath: path.join(__dirname, 'plugin/flexible.js')
    }])
}

// 如果是 PC 端项目
if (config.isPC) {
  // html 注入行内脚本：IE 浏览器自动加载 polyfill
  webpackConfig
    .plugin('auto-polyfill')
    .use(require('./plugin/inline-script-html-webpack-plugin'), [{
      filePath: path.join(__dirname, 'plugin/auto-polyfill.js'),
      replaceString: '<script id="auto-polyfill"></script>'
    }])

  // html 注入行内脚本：浏览器支持检测
  webpackConfig
    .plugin('support-check')
    .use(require('./plugin/inline-script-html-webpack-plugin'), [{
      filePath: path.join(__dirname, 'plugin/support-check.js')
    }])
}

//-----------------多页应用配置
if (config.isMulti) {
  // 处理多页应用 entry
  webpackConfig
    .entryPoints.clear()
  /*webpackConfig
    .entry('polyfill')
      .add('./src/polyfill.js')
      .end()*/
  const entries = util.getEntries('./src/pages', 'entry.js')
  const entryKeys = Object.keys(entries)
  entryKeys.forEach(key => {
    webpackConfig
      .entry(key)
        .add(entries[key])
  })

  webpackConfig.module
    .rule('router-loader')
      .test(/router-multi.js$/)
      .use('router-loader')
        .loader('router-loader')
        .options({publicPath: config.publicPath})
        .end()
      .enforce('pre')

  // 处理多页应用 html
  webpackConfig.plugins.delete('html')
  entryKeys.forEach(key => {
    // 生成html的文件路径
    const curFilename = (key === 'index') ? 'index.html' : key.replace(/_/g, '/') + '/index.html'

    // html模板的文件路径
    let curTemplate = `./src/pages/${key.replace(/_/g, '/')}/index.html`
    if (!fs.existsSync(path.join(__dirname, '../', curTemplate))) {
      // 如果所在模块路径下没有，使用src目录下的公用模板
      curTemplate = './src/index.html'
    }

    const excludeChunks = entryKeys.filter(item => item!==key)

    let pageInfo = JSON.parse(JSON.stringify(defaultPageInfo))
    const curPageInfoPath = path.join(__dirname, `../src/pages/${key.replace(/_/g, '/')}/page.json`)
    if (fs.existsSync(curPageInfoPath)) {
      let curPageInfo = require(curPageInfoPath)
      if (typeof curPageInfo.title === 'string') {
        curPageInfo.title = curPageInfo.title.replace('{appName}', config.appName)
      }
      pageInfo = Object.assign(pageInfo, curPageInfo)
    }

    const options = {
      pageInfo,
      filename: curFilename,
      template: curTemplate,
      inject: true,
      excludeChunks
    }
    webpackConfig.plugin(key + '-html')
      .use(require('html-webpack-plugin'), [options])
  })
}

//-----------------其他项目建议删除的配置
// 复制README.md
const copyReadmeArgs = []
const baseReadmeList = util.getReadmeList('src/components/base')
baseReadmeList.forEach(item => {
  copyReadmeArgs.push({ from: item.path, to: path.join(config.outputRoot, 'static/readme', `${item.name}.md`) })
})

const pcReadmeList = util.getReadmeList('src/components/pc')
pcReadmeList.forEach(item => {
  copyReadmeArgs.push({ from: item.path, to: path.join(config.outputRoot, 'static/readme', `pc_${item.name}.md`) })
})

const elReadmeList = util.getReadmeList('src/components/el')
elReadmeList.forEach(item => {
  copyReadmeArgs.push({ from: item.path, to: path.join(config.outputRoot, 'static/readme', `el_${item.name}.md`) })
})

copyReadmeArgs.push({from: path.join(__dirname, '../README.md'), to: path.join(config.outputRoot, 'static/readme/index.md')})
webpackConfig
  .plugin('copy-readmes')
  .use(CopyWebpackPlugin, [copyReadmeArgs])

webpackConfig.module.rules.get('scss')
  .exclude.add(/markdown.scss$/)

webpackConfig.module
  .rule('markdown-scss')
    .test(/markdown.scss$/)
    .use(util.isDev() ? 'vue-style-loader' : 'extract-css-loader')
      .loader(util.isDev() ? 'vue-style-loader' : require('mini-css-extract-plugin').loader)
      .end()
    .use('css-loader')
      .loader('css-loader')
      .options({
        importLoaders: 1
      })
      .end()
    .use('sass-loader')
      .loader('sass-loader')
      .options({
        implementation: require("sass")
      })
// console.log('>>>>>>>>>>>>>\n', webpackConfig.toString())
module.exports = webpackConfig
