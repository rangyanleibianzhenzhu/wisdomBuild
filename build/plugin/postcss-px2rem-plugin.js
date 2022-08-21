/**
 * 将px转换为rem的postcss插件
 * 1、 当 options 的选项 defaultEffect 值未设置或者为true时，表示默认将px转换为rem；
 *     当 options 的选项 defaultEffect 为false时，表示默认不进行转换。
 * 2、 引用样式文件时，通过参数px2rem可以强制转换或者强制不转换，例：
 *     require('./assets/style/reset.css?px2rem=true')
 *     require('./assets/style/reset.css?px2rem=false')
 * 3、 style标签中样式，通过属性px2rem可以强制转换或者强制不转换，例：
 *     <style lang="scss" scoped px2rem>
 *     <style lang="scss" scoped px2rem="true">
 *     <style lang="scss" scoped px2rem="false">
 * 
 * @date 2020/6/9
 */
'use strict';

const postcss = require('postcss');
const Px2rem = require('px2rem-dpr');
const queryString = require('query-string');


module.exports = postcss.plugin(
  'postcss-px2rem',
  /**
   * px转化为rem
   * @param options 插件选项
      {
        defaultEffect: true, // px2rem 是否默认生效
        baseDpr: 2,             // base device pixel ratio (default: 2)
        remUnit: 75,            // rem unit value (default: 75)
        remPrecision: 6,        // rem value precision (default: 6)
        forcePxComment: 'px',   // force px comment (default: `px`)
        keepComment: 'no',       // no transform value comment (default: `no`)
        shouldUseDprRule: function(rule){
          let list = ['font', 'font-size'];
          return list.some(function(item) {
            return item === rule.property;
          })
        },
        shouldIgnoreRule: function(rule) {
          return  /border/.test(rule.property);
        }
      }
   * @returns {Function}
   */
  function (options) {
    // px转化为rem是否默认生效
    let effect = options.defaultEffect !== false
    // 排除规则
    var excludeReg = options.exclude || /node_modules/
    return function (css, result) {
      var resourcePath = result.opts.webpack.resourcePath
      if (excludeReg.test(resourcePath)) {// 符合不包含规则的样式不转换
        return
      }
      var styleOptions = queryString.parse(result.opts.webpack.resourceQuery)
      if ((effect && styleOptions.px2rem !== 'false') || (!effect && styleOptions.px2rem === 'true')) {
        var px2remIns = new Px2rem(options);
        var oldCssText = css.toString();
        var newCssText = px2remIns.generateRem(oldCssText);
        var newCssObj = postcss.parse(newCssText);
        result.root = newCssObj;
      }
    };
  }
);

