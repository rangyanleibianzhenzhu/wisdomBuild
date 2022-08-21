/**
 * 条件注释 loader（根据 config.js 全局配置文件中配置项进行条件注释）
 */
/* 1. 单行 JS 条件注释 */
/* [auto single-line command {useElement=false}] */
// 在单行代码前增加上面的注释
// {} 中的内容用于指定匹配条件，useElement表示位置文件配置项名称，false则为该配置项的值
// 如果配置项符合注释中的条件，则该注释替换为“//”，此行代码被注释掉

/* 2. 多行 JS 条件注释 */
/* [auto multi-line command START {routerMode=hash}] */
// 这里是多行代码
/* [auto multi-line command END {routerMode=hash}] */
// 多行代码前后分别增加上面的注释
// {} 中的内容用于指定匹配条件
// 如果配置项符合注释中的条件，则该注释分别替换为“/*”和“*/”，之间的多行代码被注释掉
// 注意：多行代码中不能有多行注释

/* 3. HTML 条件注释
<!-- [auto html command START {isMulti=false}] -->
// html代码
<!-- [auto html command END {isMulti=false}] -->
*/
'use strict'

const config = require('../../config.js');

// 单行 JS 条件注释格式正则
const singleCommandReg = /\/\*\s*\[auto single-line command {(\w+)(=|\!=)(\w+)}\]\s*\*\//g;
// 多行 JS 条件注释开始格式正则
const multiCommandStartReg = /\/\*\s*\[auto multi-line command START {(\w+)(=|!=)(\w+)}\]\s*\*\//g;
// 多行 JS 条件注释结束格式正则
const multiCommandEndReg = /\/\*\s*\[auto multi-line command END {(\w+)(=|!=)(\w+)}\]\s*\*\//g;
// HTML 条件注释开始格式正则
const htmlCommandStartReg = /\<\!\-\-\s*\[auto html command START {(\w+)(=|!=)(\w+)}\]\s*\-\-\>/g;
// HTML 条件注释结束格式正则
const htmlCommandEndReg = /\<\!\-\-\s*\[auto html command END {(\w+)(=|!=)(\w+)}\]\s*\-\-\>/g;

/**
 * 配置文件配置项是否匹配规则
 * @param key 配置项
 * @param val 注释中指定的值
 * @returns {boolean} 是否匹配
 */
function isMatch (key, option, val) {
  let isMatch = false; // 是否符合条件
  let confVal = config[key]; // 配置文件的属性值
  if (typeof confVal === 'boolean') {
    confVal = String(confVal);
  } else if (typeof confVal === 'number') {
    val = Number(val);
  }

  if (option === '!=') {
    isMatch = confVal !== val;
  } else {
    isMatch = confVal === val;
  }
  return isMatch;
}

module.exports = function (source) {

  // 单行 JS 条件注释，字符串替换
  source = source.replace(singleCommandReg, function (str, key, option, val) {
    const match = isMatch(key, option, val);
    return match ? '//' : '';
  });

  // 多行 JS 条件注释开始位置，字符串替换
  source = source.replace(multiCommandStartReg, function (str, key, option, val) {
    const match = isMatch(key, option, val);
    return match ? '/*' : '';
  });

  // 多行 JS 条件注释结束位置，字符串替换
  source = source.replace(multiCommandEndReg, function (str, key, option, val) {
    const match = isMatch(key, option, val);
    return match ? '*/' : '';
  });

  // HTML 条件注释开始位置，字符串替换
  source = source.replace(htmlCommandStartReg, function (str, key, option, val) {
    const match = isMatch(key, option, val);
    return match ? '<!--' : '';
  });

  // HTML 条件注释结束位置，字符串替换
  source = source.replace(htmlCommandEndReg, function (str, key, option, val) {
    const match = isMatch(key, option, val);
    return match ? '-->' : '';
  });

  return source;
}
