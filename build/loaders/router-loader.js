/**
 * @file router loader
 *
 * @desc 收集项目中使用的所有路由规则，向router.js中注入规则全集
 * 
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const chalk = require('chalk');
const loaderUtils = require('loader-utils');
const util = require('../utils/build-util.js');
const config = require('../../config.js');

// 所有路由全路径数组的位置标识
const PATHS_INSERT_POSITION = 'const allRoutePaths = [';
// 所有路由映射的位置标识（主键为路由全路径）
const ROUTES_INSERT_POSITION = 'const allRoutes = {';
// 截取 “export default” 后面内容的正则
const ROUTES_LIST_REG = /export default\s?({\s?[\s|\S]*\s?})/;
// 删除 “component=XXX” 的正则
const REMOVE_COMPONENT_REG = /,?[\s\n\r]*component\s?:\s?\w*,?\b/g;

/**
 * 向字符串指定位置插入内容
 *
 * @param {string} origin 原始字符串
 * @param {string} str 新增内容
 * @param {number} pos 插入位置
 * @return {string} 结果字符串
 */
function insertAt(origin, str, pos) {
    return [
        origin.slice(0, pos),
        str,
        origin.slice(pos)
    ].join('');
}

/* 解析嵌套的路由为1个数组，并设置一些额外的属性 */
function wrapRoutes (routes, entryName, basePath = '/', publicPath = '/') {
  let newRoutes = [];
  let rootRouter = null; // 根路由
  const pagePath = path.posix.join(publicPath, entryName.replace('_', '/'), '/');
  const routerFilePath = path.join(__dirname, '../../src/pages', pagePath, 'router.js'); // 路由文件名称

  routes.forEach(item => {
    if (pagePath !== '/index/' && item.path === '/' && basePath === '/') {
      rootRouter = item;
      return;
    }

    let curPath = (item.path && /^\//.test(item.path)) ? item.path : path.posix.join(basePath, item.path);
    if (!(item.path === '/' && item.redirect)) {
      // 页面路径
      item['__pagePath'] = pagePath;
      // 路由全路径
      item['__fullRouterPath'] = curPath;
      newRoutes.push(item);
    }

    if (item.children) {
      newRoutes = newRoutes.concat(wrapRoutes(item.children, entryName, curPath, publicPath));
    }
  });

  // 进行路由配置校验
  if (basePath === '/') {
    if (config.routerMode === 'history') { // 如果是 history 路由
      // history 路由模式校验是否存在与页面路径一致的路由
      let pageRouterPath = pagePath === '/index/' ? '/' : pagePath.replace(/\/$/, '');
      const hasPageRouter = newRoutes.some((item) => item.__fullRouterPath === pageRouterPath);
      if (!hasPageRouter) {
        console.log(chalk.red(`[ERROR] 多页应用路由配置错误！\n${routerFilePath} 文件中缺少 "${pageRouterPath}" 路由配置。 `));
      } else {
        // 除了 '/' 和 页面路径一致的路由之外的其他路由，history 模式下一般只配置与页面路径一致的路由，如果还有其他路由必须以页面路径开头，并且需要修改 nginx 配置
        const otherRouters = newRoutes.filter((item) => item.__fullRouterPath !== '/' && item.__fullRouterPath !== pageRouterPath);
        if (otherRouters.length) {
          const childrenPathReg = new RegExp(`^${pageRouterPath}\/.+`); // 以页面路径开头的子路径正则
          const errorRouters = otherRouters.filter((item) => !childrenPathReg.test(item.__fullRouterPath));
          const errorRouterPaths = errorRouters.map((item) => item.__fullRouterPath);
          if (errorRouters.length > 0) {
            console.log(chalk.red(`[ERROR] 多页应用路由配置错误！\n${routerFilePath} 文件中存在不以页面路径开头的路由："${errorRouterPaths.join('"、 "')}"，请改为以 "${pageRouterPath}" 开头。 `));
          } else {
            const otherRouterPaths = otherRouters.map((item) => item.__fullRouterPath);
            console.log(chalk.yellowBright(`[WARN] ${routerFilePath} 文件中存在与页面路径不一致的路由： "${otherRouterPaths.join('"、 "')}" ，需要部署时增加 nginx 配置，如：
  location ${pageRouterPath} {
        try_files $uri $uri ${pageRouterPath}/index.html;
  }`));
          }
        }
      }

    } else if (config.routerMode === 'hash') { // 如果是 hash 路由
      if (pagePath === '/index/') {
        const hasIndexRouter = newRoutes.some((item) => item.__fullRouterPath === '/');
        if (!hasIndexRouter) {
          console.log(chalk.red(`[ERROR] 多页应用路由配置错误！\n${routerFilePath} 文件未定义 "/" 路由。`));
        }
      } else {
        // hash 路由模式校验是否为根路径做重定向
        if (!rootRouter || !rootRouter.redirect) {
          if (pagePath !== '/index/') {
            console.log(chalk.red(`[ERROR] 多页应用路由配置错误！\n${routerFilePath} 文件中缺少 "/" 路由重定向配置，示例：
{
  path: '/',
  redirect: '${pagePath}'
}`));
          }
        } else {
          const redirectPath = rootRouter.redirect;
          const hasRedirectRouter = newRoutes.some((item) => item.__fullRouterPath === redirectPath);
          if (!hasRedirectRouter) {
            console.log(chalk.red(`[ERROR] 多页应用路由配置错误！\n${routerFilePath} 文件已将 "/" 路由重定向到 "${redirectPath}", 但 "${redirectPath}" 路由未定义。`));
          }
        }
      }

    }
  }
  return newRoutes;
}

module.exports = function (source) {
  const options = loaderUtils.getOptions(this);
  const publicPath = options.publicPath;
  const entryRouters = util.getEntries('./src/pages', 'router.js');
  // console.log('entryRouters =', entryRouters)
  let routes = []; // 所有路由数组
  let routesMap= {}; // 所有路由映射，主键为__fullRouterPath（路由全路径）
  let routePaths = []; // 所有路由全路径数组

  // 遍历所有路由
  let curRouterPath, // 当前router.js文件路径
    curContent, // router.js 文件内容
    curResult, // 截取“export default”后面的内容
    curScript, // 处理后可执行的脚本（为了保证该脚本可执行，删除了“component：XXXX，”）
    curRoutes, // 当前文件的路由数组
    curWrappedRoutes; // 封装后的路由信息数组
  Object.keys(entryRouters).forEach(entryName => {
    curRouterPath = path.resolve(__dirname, '../../', entryRouters[entryName]);
    // console.log('curRouterPath =', curRouterPath)
    curContent = fs.readFileSync(curRouterPath, 'utf8');
    curResult = ROUTES_LIST_REG.exec(curContent);
    if (curResult && curResult[1]) {
      curScript = curResult[1].replace(REMOVE_COMPONENT_REG, '');
      curRoutes = vm.runInThisContext(curScript);
      curWrappedRoutes = wrapRoutes(curRoutes, entryName, '/', publicPath);
      curWrappedRoutes.forEach(item => {
        if (routesMap[item.__fullRouterPath]) {
          console.error(chalk.red(`[ERROR] 多页应用路由配置错误！存在重复路由 ${item.__fullRouterPath}`));
        }
        routesMap[item.__fullRouterPath] = item;
      })
      routes = routes.concat(curWrappedRoutes);
    }
    // 加入文件监听列表
    this.addDependency(curRouterPath);
  });

  routePaths = Object.keys(routesMap);

  // 插入所有路径
  let resultSource = source;
  let routePathsStr = JSON.stringify(routePaths);
  routePathsStr = routePathsStr.substring(1, routePathsStr.length - 1);
  let pathsPos = resultSource.indexOf(PATHS_INSERT_POSITION) + PATHS_INSERT_POSITION.length;
  if (pathsPos > PATHS_INSERT_POSITION.length) {
    resultSource = insertAt(resultSource, routePathsStr, pathsPos);
  }

  // 插入所有路由
  let routesStr = JSON.stringify(routesMap);
  routesStr = routesStr.substring(1, routesStr.length - 1);
  let routesPos = resultSource.indexOf(ROUTES_INSERT_POSITION) + ROUTES_INSERT_POSITION.length;
  if (routesPos > ROUTES_INSERT_POSITION.length) {
    resultSource = insertAt(resultSource, routesStr, routesPos);
  }

  // console.log(resultSource)
  return resultSource;
};
