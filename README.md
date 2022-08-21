# static-init-vue

> vue示例项目

此项目是基于 Webpack4 和 Vue2 的示例项目，项目中内置常用组件，使用此框架可快速搭建Web应用项目，既可开发移动端 Web 应用，也可开发 PC 端 Web 应用。

## 一、框架功能
* 项目配置化，可根据项目需要进行配置。如：项目是单页应用还是多页应用，项目支持移动端设备还是 PC 端设备，项目路由模式，是否使用 Element 组件库等。
* 框架内置移动端和 PC 端常规布局以及常用组件，可直接用于新应用的开发。
* 框架已集成了 [Element UI 组件库](https://element.eleme.io)，可直接使用组件库中组件，组件主题色与框架主题色同步，已经将部分 Element 组件设为全局组件，如果需要扩展全局组件请在 `src/plugins/elementPlugin.js` 中添加。
* 如果配置为移动端应用，框架会自动处理移动端自适应，将样式中 px 转换为 rem。
* 框架实现了热替换，代码更改后在无需刷新页面的前提下自动替换修改的内容，大大提高开发效率。
* 测试环境版本和生产环境版本的打包完成后可自动在本地启动静态服务，查看打包结果是否正确。
* 测试环境版本打包完成后可自动将新包发布到测试服务器，实现一行命令完成打包部署，并自动打开浏览器访问测试环境。
* 生产环境版本打包前自动进行 Git 检查，如果代码未提交或者有新内容未从远程库拉取，则不允许打包。
* 生产环境版本打包时自动生成打包信息文件 package_info.txt，便于生产环境问题排查。
* 框架集成了 Babel ，可以放心的使用简洁的 ES6 语法，而不必担心兼容问题。
* 框架集成了 Autoprefixer，可以自动补全 css 前缀，无需为了兼容各种浏览器而手写浏览器前缀。
* 框架自带 mock 服务，可以方便地模拟后台接口，只要定义好接口文档就可以前后端并行开发。
* 框架集成了 ESLint，自动进行 JavaScript 代码检查，发现代码中的语法错误，统一代码风格。

## 二、项目目录
├── build <small style="color: #8292a2">// 构建脚本目录</small>
├── mock <small style="color: #8292a2">// 模拟后台接口服务根目录</small>
│&emsp;&emsp;├── app <small style="color: #8292a2">// 服务主代码目录</small>
│&emsp;&emsp;├── json <small style="color: #8292a2">// json 方式模拟接口的文件目录</small>
│&emsp;&emsp;├── mockjs <small style="color: #8292a2">// js 方式模拟接口的文件目录 </small>
│&emsp;&emsp;├── static <small style="color: #8292a2">// 模拟后台静态资源目录 </small>
│&emsp;&emsp;└── index.js <small style="color: #8292a2">// 服务入口文件 </small>
├── public <small style="color: #8292a2">// 静态资源目录（打包时直接复制到打包输出根路径 outputRoot）</small>
├── src <small style="color: #8292a2">// 主代码目录</small>
│&emsp;&emsp;├── assets <small style="color: #8292a2">// 公共资源目录</small>
│&emsp;&emsp;│&emsp;&emsp;├── icon <small style="color: #8292a2">// svg 图标目录（用于 Icon 组件）</small>
│&emsp;&emsp;│&emsp;&emsp;├── img <small style="color: #8292a2">// 共用图片目录</small>
│&emsp;&emsp;│&emsp;&emsp;├── js <small style="color: #8292a2">// 共用 JS 目录</small>
│&emsp;&emsp;│&emsp;&emsp;│&emsp;&emsp;├── **api.js** <small style="color: #8292a2">// 后台接口调用工具</small>
│&emsp;&emsp;│&emsp;&emsp;│&emsp;&emsp;├── filters.js <small style="color: #8292a2">// 全局过滤器</small>
│&emsp;&emsp;│&emsp;&emsp;│&emsp;&emsp;├── validator.js <small style="color: #8292a2">// 表单校验工具</small>
│&emsp;&emsp;│&emsp;&emsp;│&emsp;&emsp;└── menus.js <small style="color: #8292a2">// PC端菜单配置文件</small>
│&emsp;&emsp;│&emsp;&emsp;└── style <small style="color: #8292a2">// 共用样式目录</small>
│&emsp;&emsp;│&emsp;&emsp;&ensp;&thinsp;&emsp;&emsp;├── reset.css  <small style="color: #8292a2">// 重置浏览器标签样式</small>
│&emsp;&emsp;│&emsp;&emsp;&ensp;&thinsp;&emsp;&emsp;├── variables.scss  <small style="color: #8292a2">// 样式变量</small>
│&emsp;&emsp;│&emsp;&emsp;&ensp;&thinsp;&emsp;&emsp;├── main.scss  <small style="color: #8292a2">// 全局基本样式</small>
│&emsp;&emsp;│&emsp;&emsp;&ensp;&thinsp;&emsp;&emsp;├── common-m.scss  <small style="color: #8292a2">// 移动端公用样式</small>
│&emsp;&emsp;│&emsp;&emsp;&ensp;&thinsp;&emsp;&emsp;├── common-pc.scss  <small style="color: #8292a2">// PC 端公用样式</small>
│&emsp;&emsp;│&emsp;&emsp;&ensp;&thinsp;&emsp;&emsp;└── element-variables.scss  <small style="color: #8292a2">// Element 样式变量</small>
│&emsp;&emsp;├── components <small style="color: #8292a2">// 共用组件目录</small>
│&emsp;&emsp;├── layout <small style="color: #8292a2">// 布局组件目录</small>
│&emsp;&emsp;├── pages <small style="color: #8292a2">// 页面目录</small>
│&emsp;&emsp;├── plugins <small style="color: #8292a2">// 插件目录</small>
│&emsp;&emsp;├── store <small style="color: #8292a2">// Vuex 状态管理目录</small>
│&emsp;&emsp;├── **app-single.js** <small style="color: #8292a2">// 单页应用入口文件（如果是多页应用不会使用，可删除）</small>
│&emsp;&emsp;├── **router-single.js** <small style="color: #8292a2">// 单页应用路由文件（如果是多页应用不会使用，可删除）</small>
│&emsp;&emsp;├── **app-multi.js** <small style="color: #8292a2">// 多页应用入口文件（如果是单页应用不会使用，可删除）</small>
│&emsp;&emsp;├── router-multi.js <small style="color: #8292a2">// 多页应用路由文件，一般不需要修改，每个页面路由通过页面目录下的 router.js 文件进行配置（如果是单页应用不会使用，可删除）</small>
│&emsp;&emsp;└── index.html <small style="color: #8292a2">// 默认 html 模板文件</small>
├── .gitignore  <small style="color: #8292a2">// git 忽略配置</small>
├── .postcssrc.js <small style="color: #8292a2">// PostCSS 样式转换插件配置</small>
├── babel.config.js <small style="color: #8292a2">// Babel JS 编译插件配置</small>
├── package.json <small style="color: #8292a2">// 项目描述文件</small>
├── package-lock.json <small style="color: #8292a2">// 项目所依赖模块的版本信息文件</small>
└── **config.js** <small style="color: #8292a2">// 项目配置文件</small>

## 三、项目配置文件
项目配置文件在项目根目录下 `config.js`。

`config.js` 中 configMap 根据使用环境对项目进行配置，包含 4 个子配置项：default、dev、test、prod。 其中 default 为默认配置，所有环境的配置都继承 default 的配置，其他为不同项目环境的扩展配置： dev (开发环境)、test (测试环境)、prod (生产环境)。

#### 主要配置项：
| 配置项 | 类型 | 可选值 | 说明 |
| :-- | :-- | :--: | :-- |
| isMulti | Boolean | - | 是否为多页应用（true：表示项目为多页应用，false：表示项目为单页应用） |
| device | String | 'mobile' / 'pc' / 'all' | 支持的设备<br>&emsp;mobile: 只需要支持移动端设备<br>&emsp;pc：只需要支持 PC 端设备<br>&emsp;all: PC和移动端设备都需要支持|
| routerMode | String | 'hash' / 'history' | Vue Router 的路由模式 |
| showTabs | Boolean | - | PC 端是否显示功能切换tab页签，在打开新菜单时可保留之前页面的操作（只对单页应用有效，即 isMulti 为 false 时有效） |
| useElement| Boolean | - | 是否使用 Element 组件库（只对 PC 端项目有效，即 device 为 pc 或 all 时有效）|
| getUserInfoBeforeCreate | Boolean | - | PC端是否在创建应用前获取用户信息（只对单页应用有效，即 isMulti 为 false 时有效）<br>&emsp;true：则创建应用前获取用户信息（如果获取用户信息时发现用户未登录则自动跳转到登录页）<br>&emsp;false：则在创建 Layout 组件时才获取用户信息（如果获取用户信息时发现用户未登录则弹窗提示） |
| apiBaseUrl | String | - | 接口请求根路径 |
| apiResponseConfig | Object | - | 接口响应配置：<br>{<br>&emsp;codeProperty: 'code', // 接口自定义状态码的字段名<br>&emsp;messageProperty: 'message', // 接口返回提示信息的字段名<br>&emsp;dataProperty: 'data', // 响应数据的字段名，如果为空则认为整个响应信息就是响应数据<br>&emsp;successCodeValue: 200, // 请求成功时自定义状态码的值<br>&emsp;authFailedCodeValue: 401 // 用户身份认证失败时的自定义状态码的值<br>} |
| outputRoot | String | - | 打包输出根路径 |
| publicPath | String | - | 公共路径，即所有资源的基础路径（如果 publicPath 不为"/"或者"./"，打包输出路径应以publicPath结尾）<br>例：outputRoot = 'D:\\static-init-vue3\dist\dev\vue-demo'，publicPath = '/vue-demo/'，本地服务启动时根目录就是 outputRoot 减去 publicPath 的结果：'D:\\static-init-vue3\dist\dev' |
| proxyTable | Object | - | 本地服务代理配置（开发环境的后台接口代理，测试及生产环境打包时如果启动本地服务时后台接口代理） |
| publish | Object | - | 测试环境部署相关配置（只测试环境使用） |

## 四、项目构建

#### 1. 安装依赖
``` bash
# 安装依赖
npm install
```
或
``` bash
# 安装依赖
yarn
```
> **注意：不要使用cnpm安装依赖**
> cnpm 安装的包为快捷方式，不同方式引用同一个模块时会出现 moduleId 不一致的情况，使模块缓存失效，导致开发环境下的 hrm 热更新失败。
>
> 示例：
>   * webpack/hot/devServer.js 引用方式为
>    ```
>     require("./emitter");
>     // moduleId 为 './node_modules/_webpack@4.28.4@webpack/hot/emitter.js'
>    ```
>   * webpack-dev-server/client/utils/reloadApp.js 引用方式为
>    ```
>     require('webpack/hot/emitter');
>     // moduleId 为 './node_modules/webpack/hot/emitter.js'
>    ```

#### 2. 启动开发环境
``` bash
# 启动开发环境
npm run dev
```
在后台接口未开发完成时，可以根据接口文档，通过 mock 服务模拟后台接口：
```bash
# 启动模拟后台接口服务
npm run mock:server
```

> **备注：**
> 如果启动时报内存溢出错误，如下：
> ```
> FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
> ```
> 解决方案：
>
> 在 package.json 项目描述文件的脚本命令中增加 ```--max-old-space-size``` 参数来配置内存空间，参数值的单位为M，配置4G内存空间示例：
> ```
>   {
>     "dev": "node --max-old-space-size=4096 ./build/build-dev.js"
>   }
> ```

#### 3. 构建测试环境版本并发布到测试服务器
``` bash
# 进行测试环境版本打包，并将打包的文件发布到测试服务器
npm run test:build-publish
```
> 打包输出的目录可以在项目配置文件 `config.js` 中进行修改:
> ```
>   test: {
>     outputRoot: path.resolve(__dirname, 'dist/test')
>   }
> ```

#### 4. 构建生产环境版本，并压缩为zip文件
``` bash
# 项目构建到dist/prod/[包名称].zip
prod:build-zip
```
> 打包输出的目录可以在项目配置文件 `config.js` 中进行修改:
> ```
>   prod: {
>     outputRoot: path.resolve(__dirname, 'dist/prod')
>   }
> ```

#### 5. 构建测试环境版本(不常用)
``` bash
# 项目构建到 dist/test 目录
npm run test:build
```

#### 6. 构建生产环境版本(不常用)
``` bash
# 项目构建到 dist/prod 目录
npm run prod:build
```

#### 7. 构建测试环境版本，并在本地启动web服务(不常用)
> 用于在本地查看测试环境版本的打包结果，一般在调试测试环境部署脚本时才使用
``` bash
# 项目构建到 dist/test 目录，并启动本地服务
npm run test:build-start
```

#### 8. 构建生产环境版本，并在本地启动web服务(不常用)
> 用于在本地查看测生产境版本的打包结果，一般在调试生产环境打包脚本时才使用
``` bash
# 项目构建到 dist/prod 目录，并启动本地服务
npm run prod:build-start
```

#### 9. 代码检测
``` bash
# 使用 ESLint 进行代码检测
npm run lint
```

#### 10. 代码检测并修复
``` bash
# 使用 ESLint 进行代码检测，并自动修复检查出来的问题
npm run lint:fix
```
> **【警告】执行后代码会被自动修改，请慎重使用！！！**

#### 11. 打包文件分析
``` bash
# 利用 webpack-bundle-analyzer 进行可视化打包文件分析，为项目优化提供参考
npm run analyze
```

## 五、单页应用
通过将 `config.js` 全局配置文件的 `isMulti` 设置为 false 可以开启单页应用模式，单页应用只有一个 HTML 文件，页面切换时不会加载新的 HTML 页面，而是通过 JavaScript 操作 DOM 渲染新的页面内容。

单页应用相关的主要文件：
* 入口文件：app-single.js
* 路由配置文件： router-single.js
* 根组件：App.vue
* HTML 模板：index.html
> 框架代码中 `src`目录下的 app-multi.js、router-multi.js 以及 `src/pages` 子目录下的 entry.js、router.js、index.html、page.json 是多页应用才使用的文件，单页应用不需要，可以删除。

## 六、多页应用
通过将 `config.js` 全局配置文件的 `isMulti` 设置为 true 可以开启多页应用模式，每个页面有单独的 HTML 文件，页面切换时会重新加载新的 HTML 页面以及引用的 JS 和 CSS 文件。

多页应用的 Vuex 状态管理仅对当前页面有效，跳转页面后会重新初始化。

多页应用相关的主要文件：
* 入口文件：app-multi.js
* 路由处理文件： router-multi.js
* 页面目录下的：entry.js、router.js、index.html、page.json

#### 1. 页面目录
* 框架会将 `src/pages` 下含有 `entry.js` 页面入口文件的子目录作为页面目录，页面目录在打包时会生成对应路径的 HTML 文件。
* 页面目录下还需要有 `router.js` 路由文件，用于设置当前页面的路由。
* 如果页面目录下有 `index.html` 文件，则使用此文件作为页面模板，否则使用 `src/index.html` 作为页面模板。
* 页面目录下的 `page.json` 文件用于配置页面信息，如：页面标题。（此文件非必须）

**示例：**
假设 pages 的目录结构如下：
pages
├── index <small style="color: #8292a2">// 首页页面目录</small>
│&emsp;&emsp;├── entry.js <small style="color: #8292a2">// 页面入口文件</small>
│&emsp;&emsp;├── router.js <small style="color: #8292a2">// 页面路由文件</small>
│&emsp;&emsp;├── index.vue <small style="color: #8292a2">// 页面组件</small>
│&emsp;&emsp;├── index.html <small style="color: #8292a2">// 页面模板文件（非必须）</small>
│&emsp;&emsp;└── page.json <small style="color: #8292a2">// 页面配置文件（非必须）</small>
└─ user <small style="color: #8292a2">// 用户管理目录</small>
&ensp;&thinsp;&emsp;&emsp;├── list <small style="color: #8292a2">// 用户列表页面目录</small>
&ensp;&thinsp;&emsp;&emsp;│&emsp;&emsp;├── entry.js
&ensp;&thinsp;&emsp;&emsp;│&emsp;&emsp;├── router.js
&ensp;&thinsp;&emsp;&emsp;│&emsp;&emsp;└── index.vue
&ensp;&thinsp;&emsp;&emsp;└── detail <small style="color: #8292a2">// 用户详情页面目录</small>
&ensp;&thinsp;&emsp;&emsp;&ensp;&thinsp;&emsp;&emsp;├── entry.js
&ensp;&thinsp;&emsp;&emsp;&ensp;&thinsp;&emsp;&emsp;├── router.js
&ensp;&thinsp;&emsp;&emsp;&ensp;&thinsp;&emsp;&emsp;└── index.vue

构建后页面结构如下：
index.html <small style="color: #8292a2">// 首页页面，访问地址：http://{host}:{port}/</small>
user
├── list
│&emsp;&emsp;└── index.html <small style="color: #8292a2">// 用户列表页面，访问地址：http://{host}:{port}/user/list/</small>
└── detail
&ensp;&thinsp;&emsp;&emsp;└── index.html <small style="color: #8292a2">// 用户详情页面，访问地址：http://{host}:{port}/user/detail/</small>

#### 2. 页面路由
多页应用每个页面的路由通过页面目录下的 `router.js` 进行配置。
对于不同的路由模式 `routerMode` ，配置要求不同：

###### 1) hash 路由
* 要使用 Vue Router 进行路由跳转，如：`<router-link>`、`$touter.push()` 等，必须要配置一个与其他页面不重复的页面路由。
* 为了在不设置 hash 的情况下也能正常访问页面， 需要将 `/` 根路由重定向到页面路由。

**示例：**
* pages/user/detail/router.js

```js
import Index from './index.vue'

export default {
  routes: [
    // 根路由重定向到页面路由
    {
      path: '/',
      redirect: '/userDetail'
    },
    // 与其他页面不重复的页面路由
    {
      path: '/userDetail',
      component: Index
    }
  ]
}
```

###### 2) history 路由
* 一般情况只配置一个页面路由，页面路由必须与页面路径保持一致。
* 如果想要在一个页面配置多个路由，所有路由必须以页面路径开头，并且在部署的时候需要修改 nginx 配置。（不建议这样用）

**示例**
* pages/user/detail/router.js

页面源码目录为 `pages/user/detail`，对应的页面路径为 `/user/detail`，则页面路由的路径也为 `/user/detail`。
```js
import Index from './index.vue'

export default {
  routes: [
    // 与页面路径一致的路由
    {
      path: '/user/detail',
      component: Index
    }
  ]
}
```

#### 3. 自定义布局组件
`src/App.vue` 是默认的应用布局组件，如果想指定自定义的布局组件，需要在 `entry.js` 中调用 createMultiApp() 方法时，将自定义布局组件作为第二个参数传入。

**示例**
* pages/user/detail/entry.js
```js
import { createMultiApp } from '@/app-multi'
import pageRouter from './router'
import Layout from '@/layout/pc/AppLayout.vue' // 自定义布局组件

const { app, router } = createMultiApp(pageRouter, Layout) // 将自定义布局组件作为第二个参数传入

router.isReady().then(() => app.mount('#app'))
```

#### 4. 配置页面标题
页面的标题默认为 `config.js` 项目配置文件中 `appName` 的值。 如果想要给多页应用的每个页面配置不同的标题，则需要在对应页面目录下增加 `page.json` 文件配置页面标题。

**示例：**
> pages/index/page.json
```
{
  "title": "首页-{appName}"
}
```
`{appName}` 为动态参数，会替换为 `config.js` 项目配置文件中 `appName` 指定的系统名称，如果 `appName` 的值为 “OA系统”，则最终的页面标题为“首页-OA系统”。

## 七、history 路由模式项目部署
当项目为 history 路由模式时，在部署测试环境和生产环境时还需要进行特殊配置。

#### 1. 单页应用
如果使用 tomcat 部署，项目下增加 WEB-INF/web.xml 文件，文件内容如下：
```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                      http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
  version="3.1"
  metadata-complete="true">
  <error-page>
    <error-code>404</error-code>
    <location>/</location>
  </error-page>
</web-app>
```
如果使用 nginx 部署，nginx 配置文件需要增加如下配置：
```
location / {
  try_files $uri $uri/ /index.html;
}
```
#### 2. 多页应用
多页应用每个页面一般只配置一个与页面路径一致的路由，框架会根据页面路径自动处理路由跳转，不需要进行配置。

当一个页面存在子路由或者路由中含有动态参数时需要进行配置。（不建议这样配置路由，尽量避免这种情况）

**示例：**

pages/user/detail 目录下的路由配置包含了子路由，配置如下：
```js
{
  routes: [
    {
      path: '/user/detail',
      component: Index,
      redirect: '/user/detail/basic',
      children: [
        {
          path: '/user/detail/basic',
          component: Basic
        },
        {
          path: '/user/detail/card',
          component: Card
        }
      ]
    }
  ]
}
```

nginx 需要增加如下配置：
```
location /user/detail {
  try_files $uri $uri /user/detail/index.html;
}
```
> 多页应用 history 路由模式下不建议使用路由参数，如果有动态参数建议使用 query 参数。

#### 八. 移动端应用自适应
`config.js` 全局配置文件的 `device` 设置为 'mobile' 或者 'all' 时，Web 应用支持移动端。

打包时会自动以行内方式往 HTML 中注入 `build/plugin/flexible.js` 的脚本，脚本自动计算 rem 并在 html 标签设置 font-size。

移动端的自适应方案采用 rem 方式，打包时会自动将样式中的 px 转换为 rem（样式中 px 的值取 750px 宽的设计稿中对应元素的 px 值）。

###### 1) px转rem
* 源码样式
```css
.app {
  width: 750px;
}
```
* 处理后样式：
```css
.app {
  width: 10rem;
}
```
如果不需要转换为rem，需要根据像素比设置px，在源码样式后加注释/* px */
* 源码样式
```css
.app {
  width: 750px; /*px*/
}
```
* 处理后样式：
```
.app {
  width: 750px;
}
[data-dpr="1"] .app {
  width: 375px;
}

[data-dpr="2"] .app {
  width: 750px;
}

[data-dpr="3"] .app {
  width: 1125px;
}

```
如果不需要转换为rem，也不需要根据像素比设置px，在源码样式后加注释/* no */
```css
.app {
  width: 750px; /*no*/
}
```
* 处理后样式：
```css
.app {
  width: 750px;
}
```

###### 2) 字体大小
字体大小设置为750px设计稿的字体大小，为了让屏幕大的手机显示更多的文字，默认情况下字体不转换位rem， 而是根据像素比设置字体的大小。
* 源码样式
```css
.app {
  font-size: 28px;
}
```
* 处理后样式：
```css
.app {
  font-size: 28px;
}

[data-dpr="1"] .app {
  font-size: 14px;
}

[data-dpr="2"] .app {
  font-size: 28px;
}

[data-dpr="3"] .app {
  font-size: 42px;
}
```
如果字体需要转化为rem，在源码样式后加注释/* yes */
* 源码样式
```css
.app {
  font-size: 28px;/*yes*/
}
```
* 处理后样式：
```css
.app {
  font-size: 0.373333rem;
}
```

###### 3) 边框样式
边框样式默认不转换为rem，也不根据像素比设置px
* 源码样式
```css
.page-title {
  border-bottom: solid 1px #E5E5E5;
}
```
* 处理后样式：
```css
.page-title {
  border-bottom: solid 1px #E5E5E5;
}
```
如果需要边框宽度转化为rem，在源码样式后加注释/* yes */
```css
.page-title {
  border-radius: 25px;/* yes */
}
```
* 处理后样式：
```css
.page-title {
  border-radius: 0.333333rem;
}
```
###### 4) 整个样式不转化rem
 style标签需要增加属性 px2rem="false"
 ```html
<style lang="scss" scoped px2rem="false">

</style>
```
样式文件需要引用时增加参数 px2rem=false
```javascript
require('./assets/style/reset.css?px2rem=false')
```

## 九. Mock服务(模拟后台接口服务)
Mock服务相关代码在 `mock` 目录下
###### 1) 启动服务
```bash
# 启动模拟后台接口服务
npm run mock:server
```
###### 2) 使用方式
* json 方式
* js 方式
> 详细使用方法，请参考 `mock/README.md` 和 示例代码

## 十、 调用后台接口
应用使用 Axios 发送 http 请求调用后台接口，并通过 `src/plugins/apiPlugin.js` 添加了调用后台接口的全局方法，这些方法可以在任何组件实例中访问，方法的返回值为 Promise 对象。

如果调用成功，成功回调函数的参数为返回的数据。

如果调用失败，失败回调函数的参数为自定义的 Error 对象；
当错误码为 401 时，表示用户身份认证失败，此时会弹出对话框，点击"重新登录"按钮后跳转到登录页面；
其他错误码则会自动弹出错误提示信息。

框架默认支持的接口响应数据格式为：
```json
{
  "code": 200, // 自定义状态码，200 时表示调用成功，其他值表示调用失败 (其中 401 表示用户身份认证失败，500 表示服务端异常）
  "message": "接口调用成功", // 说明信息
  // 返回的数据(成功回调函数的参数)
  "data": {
    "userName": "管理员",
    "roleCode": "02"
  }
}
```
如果要更改接口响应数据格式，可以通过 `config.js` 全局配置文件中的 `apiResponseConfig` 进行配置。

后台接口调用的方法有以下4种：
* `vm.$apiGet(option)` 以GET方式请求后台接口
  ```js
  vm.$apiGet({
    url: '/api/user/getUser',
    data: { id: '123456' }
  })
  ```

* `vm.$apiPost(option)` 以POST方式请求后台接口
  ```js
  vm.$apiPost({
    url: '/api/user/save',
    data: { id: '123456', name: 'Jone' }
  })
  ```

* `vm.$apiUpload(option)` 请求后台接口进行文件上传
  ```js
  const formData = new FormData()
  formData.append('file', file) // 待上传的文件
  formData.append('type', '01') // 其他参数
  vm.$apiUpload({
    url: '/api/images/upload',
    data: formData
  }).then((resData) => {
    // 上传成功后的操作
  })
  ```

* `vm.$apiDownload(option)` 请求后台接口进行文件下载
  ```js
  vm.$apiDownload({ url: '/api/file/download/1638860971429-17921558' })
  ```

> 说明：vm 为 Vue 实例对象

后台接口调用方法参数 option 对象：
| 参数        | 类型     | 说明 |
| ---        | ---     | --- |
| url        | String  | 请求地址 |
| data       | Object  | 请求数据 |
| timeout    | Number  | 请求超时时间（默认为：10000，即10秒） |
| headers    | Object  | 请求头信息 |
| toastError | Boolean | 请求失败时，是否弹出错误信息（默认为：true） |
> 其他 Axios 请求参数也可以直接配置到 option

失败回调方法参数 Error 对象：
| 属性           | 说明 |
| ---           | --- |
| name          | 对象名称，值为：'BusinessError' 或者 'SystemError' |
| code          | 错误码（BusinessError 是响应数据的自定义状态码） |
| message       | 错误信息 |
| data          | 返回的数据 |
| isAuthFailed  | 是否身份认证失败 |

一般情况下不需要对异常情况进行特殊处理，请求失败后会自动弹出错误信息，示例如下：
```js
vm.$apiGet({
  url: '/user/userInfo',
  data: { id: 123456 }
}).then((data) => {
   // 请求成功的处理
})
````

如果要根据错误码进行不同的操作，可以将请求参数 option 的 toastError 设为 false，在错误回调函数进行处理，示例如下：
```js
vm.$apiGet({
  url: '/user/userInfo',
  data: { id: 123456 },
  toastError: false
}).then(
  (data) => {
    // 请求成功的处理
  },
  (err) => {
    // 请求失败的处理（正常返回响应信息，但响应信息的自定义状态码为失败状态也会调用此回调方法）
    if (!err.isAuthFailed) { // 由于身份认证失败时会统一弹出重新登录提示框，对这种情况不需要单独处理
      if (err.code === '9001') {
        // 对指定状态码进行特殊处理
      } else {
        // 其他异常直接弹出错误信息
        vm.$toast({ type: 'error', message: err.message })
      }
    }
  }
)
```

除了使用以上全局方法外，还可单独引入 api.js 模块来调用后台接口
```js
import api from '@/assets/js/api.js'

api.get({
  url: '/user/getUser'
}, vm).then(data => {
  // 请求成功的处理
})
```
> 注意：Vue 实例对象 vm 需要作为第二个参数传入

## 十一、其他功能

#### 1. 全局属性
为了方便使用，将一些常用工具和方法设置为全局属性，在组件中可以直接通过 this 调用。

示例：`this.$toast('保存成功！')`

| 全局属性          | 说明 |
| ---             | --- |
| $eventBus       | 全局事件总线 |
| $validator      | 表单校验器 |
| $toast          | toast 提示方法 |
| $popup          | 弹出窗口方法 |
| $popupAlert     | 弹出警告窗口方法 |
| $popupConfirm   | 弹出确认窗口方法 |
| $popupImage     | 弹出图片查看器方法 |
| $popupFullBox   | 弹出全屏弹窗方法（仅移动端可用） |
| $popupBottomBox | 弹出底部弹窗方法（仅移动端可用） |
| $notify         | 弹出右下角通知窗口方法（仅PC端可用） |
| $apiGet         | GET 方式请求后台接口方法 |
| $apiPost        | POST 方式请求后台接口方法 |
| $apiUpload      | 请求后台接口进行文件上传方法 |
| $apiDownload    | 请求后台接口进行文件下载方法 |
| $apiBaseUrl     | 后台接口根地址 |

#### 2. PC 端功能页签
对于单页应用将 `config.js` 全局配置文件中的 `showTabs` 设置 true ，则启用 PC 端的功能页签。

功能页签在页头和主功能区域之间，首页页签默认打开，且不可关闭，点击菜单后会自动打开新的页签。

页签间切换时会保持功能对应组件的状态，如果不需要保持对应组件的状态，可以在 `assets/js/menus.js` 菜单配置文件中给对应的菜单增加 `cache: false` 配置。

功能页签切换时会自动记录功能区域滚动条的位置，切换回来后还显示原来的位置，如果想要每次切换后都回到开始的位置，需要在 `router-single.js` 单页应用路由配置文件中给对应路由增加 meta.recordScrollPosition 配置，如下：
```js
  meta: {
     recordScrollPosition: false // 是否记录滚动条位置
  }
```

#### 3. PC 端指定路由对应的菜单
默认情况下会根据页面路由自动匹配当前菜单，并将当前菜单进行高亮显示，当前菜单的路径作为面包屑展示。
如果个别页面无法通过路由匹配，可以在路由的配置项中通过 meta.menuId 指定对应菜单。
另外，还可以在路由的配置项中通过 meta.extendName 指定功能页面的扩展名称，该扩展名称会在面包屑后面追加并且在tab页签中展示。
```js
{
  routes: [
    // 用户管理菜单的路由，在 assets/js/menus.js 菜单配置文件中的 id 为 '0301'
    {
      path: '/user/list',
      component: UserList
    },
    // 用户编辑页面的路由（用户管理菜单打开用户列表页面，点击"编辑"按钮后跳转到的用户编辑页路由）
    {
      path: '/user/edit',
      meta: {
          // 【注意】对应菜单的ID
          menuId: '0301',
          // 【注意】在菜单路径基础上扩展的功能名称，用于在面包屑和tab页签中展示
          extendName: '编辑用户信息'
      },
      component: UserEdit
    }
  ]
}
```

#### 4. 加载中蒙层（PC端）
当用户进行某些耗时较长的操作时，如果需要屏蔽用户操作页面其他功能，可显示加载中蒙层。蒙层中间会显示加载器动画，还可通过事件参数指定提示信息。
###### 1) 显示蒙层
通过全局 $eventBus 的 show-loading 事件可显示页面加载中蒙层
```vue
vm.$eventBus.$emit('show-loading') // 没有提示信息
```
或者
```vue
const loadingMessage = '加载中，请稍后'
vm.$eventBus.$emit('show-loading', loadingMessage) // 有提示信息
```
> 说明：vm指vue实例对象, loadingMessage为蒙层中显示的提示信息

###### 2) 隐藏蒙层
通过全局 $eventBus 的 hide-loading 事件可隐藏页面加载中蒙层
```vue
vm.$eventBus.$emit('hide-loading')
```

#### 5. 条件注释
为了提高项目的灵活性，在 `config.js` 全局配置文件中设置了很多配置项，不同的配置适用的场景不同，代码也会不同，通过条件注释功能可以将指定场景下不需要的代码注释掉。

此功能是通过在 Webpack 中使用自定义的加载器 `build/loaders/condition-comment-loader.js` 实现的。

如果想要根据配置项进行条件注释，需要在代码中增加特定格式的注释，例如：
```
/* [auto single-line command {表达式}] */
```
这是一个 JS 单行条件注释的格式，`{}`中间的内容可以使用配置项填写简单的表达式，如：`useElement=false`、`device!=mobile`，如果表达式结果为 true 则代码注释掉。

###### 1) JS 单行条件注释
```js
/* [auto single-line command {useElement=false}] */ import elementPlugin from './plugins/elementPlugin.js'
```
当 useElement 的值为 false 时，解析成：
```js
// import elementPlugin from './plugins/elementPlugin.js'
```

###### 2) JS 多行条件注释
```js
/* [auto multi-line command START {useElement=false}] */
import elementPlugin from './plugins/elementPlugin.js'
app.use(elementPlugin)
/* [auto multi-line command END {useElement=false}] */
```
当 useElement 的值为 false 时，解析成：
```js
/*
import elementPlugin from './plugins/elementPlugin.js'
app.use(elementPlugin)
*/
```
> **注意：** 多行条件注释间不要有 `/* */` 格式的注释

###### 3) HTML 条件注释
```html
<!-- [auto html command START {isMobile=false}] -->
<style lang="scss">
    @media (max-width: $max-mobile-width) {
        .app {
            width: 750px;
        }
    }
</style>
<!-- [auto html command END {isMobile=false}] -->
```
当 isMobile 的值为 false 时，解析成：
```html
<!--
<style lang="scss">
    @media (max-width: $max-mobile-width) {
        .app {
            width: 750px;
        }
    }
</style>
-->
```
> **注意：** HTML 条件注释间不要有 `<!-- -->` 格式的注释

