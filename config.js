/**
 * @file 项目配置文件
 */
'use strict'

const path = require('path');
const os = require('os');
const chalk = require('chalk');

const packageName = 'wisdomBuild'; // 项目包名称
const localIP = getLocalIP(); // 本地IP地址

const configMap = {
  // 默认配置
  default: {
    // 系统名称，用于设置页面 head 中 title
    appName: '智慧党建系统',
    // 是否为多页应用
    isMulti: false,
    // 路由模式（值为 hash 或 history, 参考：https://router.vuejs.org/）
    /* 【注意】：
       1. IE9及以下浏览器不兼容 history 模式
       2. 多页应用在 history 模式时，不能使用子路由
       3. 多页应用在 history 模式时，router.js 中的 path 要与页面所在的目录一致
          例如：pages 目录下的页面路径为 /m/banners，/m/banners/router.js 中 path 也应为 /m/banners
       4. 多页应用在 hash 模式时，建议 router.js 中定义 path 为 "/" 的路由，从而可以在不通过 hash 指定路由的情况下就能展示页面内容
    */
    routerMode: 'hash',
    // 支持的设备：'mobile'、'pc' 或者 'all'
    device: 'all',
    // 是否支持移动端（如果支持，页面会增加移动端的flexible.js，postcss会增加px转rem的插件; 如果不支持，base公用组件自动去掉移动端相关样式）
    isMobile: true,
    // 是否支持桌面设备
    // isPC: device === 'pc' || device === 'all',
    // PC端是否显示功能切换tab页签(只对单页应用有效，即 isMulti 为 false 时有效)
    showTabs: true,
    // 是否使用Element组件库（https://element.eleme.cn/#/zh-CN/）
    useElement: true,
    /* PC端是否在创建应用前获取用户信息
       true：则创建应用前获取用户信息（对于单页应用，如果获取用户信息时发现用户未登录则自动跳转到登录页）
       false: 则在创建 Layout 组件时获取用户信息
    */
    getUserInfoBeforeCreate: false,
    // 接口请求根路径
    apiBaseUrl: '',
    // 接口响应配置
    apiResponseConfig: {
      codeProperty: 'code', // 接口自定义状态码的字段名
      messageProperty: 'message', // 接口返回提示信息的字段名
      dataProperty: 'data', // 响应数据的字段名，如果为空则认为整个响应信息就是响应数据
      successCodeValue: 200, // 请求成功时自定义状态码的值
      authFailedCodeValue: 401 // 用户身份认证失败时的自定义状态码的值
    },
    // 打包输出根路径(如果publicPath不为"/"或者"./"，打包输出路径应以publicPath结尾，例：outputRoot = 'D:\\apps\demo', publicPath = '/demo/')
    outputRoot: path.resolve(__dirname, 'dist'),
    // 项目包名称
    packageName: packageName,
    // 资源存放目录（即js、css、图片等资源存放的目录）
    assetsDirectory: 'static',
    // 公共路径，所有资源的基础路径
    publicPath: '/',
    // 是否需要生成 source map
    sourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',
    // 本地IP地址
    localIP,
    proxyTable: {
      '/api': 'http://localhost:7070',
      '/resources': 'http://localhost:7070'
    } // 代理配置
    /* proxyTable: {
      '/api': {
        target: 'http://192.168.0.1:8080',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    } */
    // 预渲染页面列表(暂不支持)
    // prerenderList: ['index', 'button', 'checkbox', 'collapse', 'popup', 'radio', 'scroll', 'switch', 'toast']
  },
  // 开发环境的配置
  dev: {
    apiBaseUrl: '',
    // 打包输出根路径
    outputRoot: path.resolve(__dirname, 'dist/dev'),
    // 资源存放目录（即js、css、图片等资源存放的目录）
    assetsDirectory: 'assets',
    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',
    // 启动本地服务时端口号
    port: 8080,
    // 是否自动打开浏览器
    autoOpenBrowser: true,
    // 是否将生成的文件写入磁盘
    writeToDisk: false
  },
  // 测试环境的配置
  test: {
    // 接口请求根路径
    apiBaseUrl: '',
    // 打包输出根路径
    outputRoot: path.resolve(__dirname, `dist/test/${packageName}`),
    // 启动本地服务时端口号
    port: 8282,
    // 部署相关配置
    publish: {
      zipDir: path.resolve(__dirname, `dist/test/${packageName}`), // 待打包目录
      publishServer: 'http://10.170.91.160:6666', // 远程部署服务地址
      remoteRoot: '/app/nginx-static/wisdomBuild', // 应用在测试服务器中根目录
      webUrl: 'http://10.170.91.160:9191' // 测试环境访问地址
    }
  },
  // 生产环境的配置
  prod: {
    // 接口请求根路径
    apiBaseUrl: '',
    // 是否需要生成source map
    sourceMap: false,
    // 打包输出根路径
    outputRoot: path.resolve(__dirname, 'dist/prod', packageName, 'abc'),
    // 公共路径，所有资源的基础路径
    publicPath: '/abc/',
    // 要压缩的目录(非必需，默认为自动计算的项目启动根路径)
    // zipDir: path.resolve(__dirname, 'dist/prod/', packageName, 'abc'),
    // 启动本地服务时端口号
    port: 9090
  },
};


// ---------------------------------------------------------------
let config = configMap.default;
let env = process.env.APP_ENV || 'prod';
let appEnvs = Object.keys(configMap).filter(item => item !== 'default' && !(config[item] instanceof Function));
if (configMap[env]) {
  config = Object.assign({
      env, // 当前环境 process.env.APP_ENV
      isDev: env === 'dev', // 是否开发环境
      isTest: env === 'test', // 是否测试环境
      isProd: env === 'prod', // 是否生产环境
      appEnvs, // 所有环境数组
      ...configMap // 各环境的配置
    },
    configMap.default,
    configMap[env]);

  let device = config.device;
  // 是否支持移动端（如果支持，页面会增加移动端的flexible.js，postcss会增加px转rem的插件; 如果不支持，base公用组件自动去掉移动端相关样式）
  config.isMobile = device === 'mobile' || device === 'all';
  // 是否支持PC设备
  config.isPC = device === 'pc' || device === 'all';

  if (config.device === 'mobile' && config.useElement) {
    console.log(chalk.yellowBright('[项目配置错误] 移动端应用不能使用 Element Plus 组件库， useElement 配置不能为 true，已自动设置为 false。'));
    config.useElement = false;
  }
  if (config.isMulti && config.showTabs) {
    console.log(chalk.yellowBright('[项目配置错误] 多页应用不支持功能切换tab页签， showTabs 配置不能为 true，已自动设置为 false。'));
    config.showTabs = false;
  }
  if (config.isMulti && config.getUserInfoBeforeCreate) {
    console.log(chalk.yellowBright('[项目配置错误] 多页应用 getUserInfoBeforeCreate 配置不能为 true，已自动设置为 false。'));
    config.getUserInfoBeforeCreate = false;
  }
  if (config.publicPath && config.publicPath !== '/' && config.publicPath !== './') {
    const indexPath = getIndexPath(config.outputRoot, config.publicPath);
    if (!indexPath) {
      console.log(chalk.yellowBright(`[项目配置错误] 如果 publicPath 不为"/"或者"./"，打包输出路径 outputRoot 应以 publicPath 结尾，示例：
{
  outputRoot: 'D:\\\\apps\\demo',
  publicPath: '/demo/'
}`));
    }
  }
}

// 获取项目根路径
function getIndexPath (outputRoot, publicPath) {
  // 项目根路径
  let indexPath = '';
  if (publicPath !== '/' && publicPath!== './') {
    let LocalPublicPath = path.join(publicPath);
    // 如果最后一个字符为斜杠去掉斜杠
    LocalPublicPath = LocalPublicPath.replace(/[\/\\]$/, '');
    let position = outputRoot.lastIndexOf(LocalPublicPath);
    if (position > -1) {
      indexPath = publicPath;
    }
  }
  return indexPath;
}

// 获取本地IP
function getLocalIP () {
  let interfaces = os.networkInterfaces();
  for(let devName in interfaces){
    let iface = interfaces[devName];
    for(let i=0;i<iface.length;i++){
      let alias = iface[i];
      if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
        return alias.address;
      }
    }
  }
  return 'localhost';
}
// console.log(env, '全局配置信息：', config)
module.exports = config;

