/**
 * html中插入行内js代码插件
 * 
 * @date 2018/7/10
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const uglifyJS = require('uglify-js');
const fs = require('fs');

class InlineScriptPlugin {
  constructor (options) {
    this.replaceString = options.replaceString; // 脚本替换的页面字符串，当用注释标记添加位置时使用
    this.appendTo = options.appendTo || 'head'; // 脚本追加的位置: head 或者 body
    this.filePath = options.filePath; // 脚本文件路径
    this.beforeTag = options.beforeTag || ''; // Script 标签前追加的字符串
    this.afterTag = options.afterTag || ''; // Script 标签后追加的字符串
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(
      'InlineScriptPlugin',
      compilation => {
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
          'InlineScriptPlugin',
          (data, cb) => {
            let jsPath = this.filePath;
            let jsStr = uglifyJS.minify(fs.readFileSync(jsPath, 'utf-8').toString()).code;
            if (this.replaceString) {
              let newHtml = data.html.replace(this.replaceString, `${this.beforeTag}<script type="text/javascript">${jsStr}</script>${this.afterTag}`);
              data.html = newHtml;
            } else {
              const reg = new RegExp(`\\<\\/${this.appendTo}\\>`);
              let newHtml = data.html.replace(reg, `${this.beforeTag}<script type="text/javascript">${jsStr}</script>${this.afterTag}</head>`);
              data.html = newHtml;
            }
            cb(null, data);
          }
        );
      }
    );
  }
}

module.exports = InlineScriptPlugin
