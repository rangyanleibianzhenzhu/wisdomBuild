// https://github.com/michael-ciniawsky/postcss-load-config
const config = require('./config')
// px2rem-dpr 的配置
const px2remOption = {
  defaultEffect: true, // px2rem 是否默认生效
  exclude: /(node_modules)|(element-theme)/, // 不包含规则，默认为 /node_modules/
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

const plugins = [
  require('postcss-import')(),
  require('postcss-url')(),
  // to edit target browsers: use "browserslist" field in package.json
  require('autoprefixer')(),
  config.isMobile ? require('./build/plugin/postcss-px2rem-plugin')(px2remOption) : false
]

module.exports = {
  plugins
}
