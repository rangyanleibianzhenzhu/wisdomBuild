/**
 * 校验器
 * 
 * @date 2020/11/13
 */
// 错误信息中 {{label}} 格式参数的正则
const labelParamReg = /{{label}}/g

/* 根据数据和校验规则进行校验
### 参数：
1. data: 待校验数据，可以是对象类型也可以是数组类型
  示例：
  {
    title: '',
    bill: {
      address: '北京市朝阳区',
      amount: 1246.25
    }
  }
2. validRules: 数据校验规则
  示例：
  {
    title: [
      'required',
      function (val, obj) {
        if (obj.type === 1 && val && !val.startsWith('BILL')) {
          return '支付类单据的标题必须以“BILL”开头'
        }
      }
    ],
    'bill.address': [
      { rule: 'required', isBreak: true },
      { rule: 'length', option: { min: 2, max: 10 } }
    ],
    'bill.amount': [
      { rule: 'required', isBreak: true, message: '{{label}}必填' },
      { rule: 'amount', option: { decimal: 2 } }
    ]
  }
  说明：
  1. 数据校验规则的主键是要校验字段的属性名，如果该字段是多级的，主键是多级字段名用“.”符号连接的字符串，例如：'bill.address'
  2. 数据检验规则的值是该字段所有校验规则的数组，数组内的元素可以是校验规则对象，可以是校验规则名称字符串，也可以是校验方法
  3. 校验规则对象：
     {rule: 'length', option: { max: 10 }, isBreak: true, message: '{{label}}不能超过10个字'}
     1) rule: 规则名称
     2) option: 校验规则选项（有些规则有选项，有些规则没有选项，不同规则选项也不一样）
     3) isBreak: 如果当前校验规则不通过，是否终止此字段后续规则的校验，默认为：false
     4) message: 自定义错误提示信息，每一个校验规则都有默认错误提示信息，通过 message 可以设置自定义的错误提示信息
     5) label: 字段标签名称，用于替换错误信息中 {{label}} 格式的参数
  4. 校验规则名称字符串：
     当校验规则不需要参数，并且全部使用默认配置时，可以使用校验规则名称字符串
     示例： 'required' 等价于 { rule: 'required' }
  5. 校验方法：
     1) 参数：
       val：当前字段值
       obj：当前校验对象
     2) 返回值：校验失败时的错误提示信息，如果返回值为空则认为校验成功
  6. 内置校验规则（具体参数请参考校验方法）
     required: 必填校验
     length: 字符串长度校验
     numRange: 数字范围校验
     floatNum: 浮点数校验
### 返回值：
  1. 对象类型数据的返回值
  {
    "__isValid": false, // 验证是否有效
    "title": ["{{label}}不能为空"]
    "bill.amount": ["{{label}}不能为空", "{{label}}数字格式错误，整数部分不能超过12位，小数部分不能超过2位"]
  }
  2. 数组类型数据的返回值
  {
    "__isValid": false, // 验证是否有效
    "0": {
      "title": ["{{label}}不能为空"]
      "bill.amount": ["{{label}}不能为空", "{{label}}数字格式错误，整数部分不能超过12位，小数部分不能超过2位"]
    },
    "1": {
      "bill.amount": ["{{label}}数字格式错误，整数部分不能超过12位，小数部分不能超过2位"]
    }
  }
*/
export function validate (data, validRules) {
  let errors = { __isValid: true }
  if (data && rules) {
    if (data instanceof Array) {
      errors = validateArray(data, validRules)
    } else {
      errors = validateObject(data, validRules)
    }
  }
  return errors
}

function ArrayValidateErrors () {
  this.__isValid = true
}
ArrayValidateErrors.prototype.toErrorString = function () {
  let str = ''
  if (this.__isValid) {
    return str
  }
  let keys = Object.keys(this)
  let rowErrs
  keys.forEach((key, index) => {
    if (!key.startsWith('__')) {
      rowErrs = this[key]
      if (!rowErrs.__isValid) {
        str += '第' + (index + 1) + '行：<br>'
        str += rowErrs.toErrorString('&nbsp;&nbsp;&nbsp;&nbsp;')
      }
    }
  })
  return str
}

function ObjectValidateErrors () {
  this.__isValid = true
}
ObjectValidateErrors.prototype.toErrorString = function (prefix='') {
  let str = ''
  if (this.__isValid) {
    return str
  }
  let keys = Object.keys(this)
  let msgList
  keys.forEach((key, index) => {
    if (!key.startsWith('__')) {
      msgList = this[key]
      if (msgList && msgList.length > 0) {
        msgList.forEach((msg, i) => {
          if (str === '') {
            str += prefix + msg + '；'
          } else {
            str += '<br>' + prefix + msg + '；'
          }
        })
      }
    }
  })
  return str
}

/* 校验数组类型数据 */
function validateArray (list, validRules) {
  let errors = new ArrayValidateErrors()
  let curRowErrors
  list.forEach((item, index) => {
    curRowErrors = validateObject(item, validRules)
    errors[index] = curRowErrors
    if (curRowErrors.__isValid === false) {
      errors.__isValid = false
    }
  })
  return errors
}

/* 校验对象类型数据 */
function validateObject (data, validRules) {
  let errors = new ObjectValidateErrors()
  const ruleKeys = Object.keys(validRules)
  let curKeys = []

  let curKey = null
  let val = null
  ruleKeys.forEach((key) => {
    curKeys = key.split('.')
    val = data
    for (let i = 0; i < curKeys.length; i++) {
      curKey = curKeys[i]
      if (val && val.hasOwnProperty(curKey)) {
        val = val[curKey]
      } else {
        console.warn(`校验字段 ${key} 不存在`)
        val = null
        break
      }
    }
    let ruleList = validRules[key]
    let errMsgList = getErrMsgList(key, val, ruleList, data)
    if (errMsgList && errMsgList.length > 0) {
      errors[key] = errMsgList
      errors.__isValid = false
    }
  })
  return errors
}

/**
 * 获取错误信息数组
 * @param key 字段关键字
 * @param val 字段值
 * @param ruleList 该字段所有校验规则数组
 * @param obj 当前待校验对象
 * @return {Array} 校验错误信息数组
 */
function getErrMsgList (key, val, ruleList, obj) {
  let errMsgList = []
  if (ruleList instanceof Array) {
    let rule
    let errMsg = ''
    for (let i = 0; i < ruleList.length; i++) {
      rule = ruleList[i]
      if (typeof rule === 'string') {
        errMsg = checkSingleRule(key, val, rule)
      } else if (typeof rule === 'function') {
        errMsg = rule(val, obj)
      } else if (rule && rule.rule) {
        errMsg = checkSingleRule(key, val, rule.rule, rule.option, rule.message, rule.label)
      } else {
        console.warn(`${key} 的第${i}个校验规则错误:`, rule)
      }
      if (errMsg) {
        errMsgList.push(errMsg)
        if (rule.isBreak) {
          break
        }
      }
    }
  }
  return errMsgList
}

/**
 * 校验单个规则
 * @param key 字段关键字
 * @param val 字段值
 * @param ruleName 规则名称
 * @param option 校验规则选项
 * @param message 自定义错误信息
 * @param label 字段标签名称，用于替换错误信息中 {{label}} 格式的参数
 * @return {string} 校验失败时的错误提示信息
 */
function checkSingleRule (key, val, ruleName, option, message, label) {
  let ruleFun = rules[ruleName]
  if (ruleFun) {
    let errMsg = ruleFun(val, option)
    errMsg = errMsg ? (message || errMsg) : ''
    if (label) {
      errMsg = errMsg.replace(labelParamReg, label)
    }
    return errMsg
  } else {
    console.warn(`表单校验规则${ruleName}不存在`)
  }
  return ''
}

// ---------------------------- 【校验方法】 ----------------------------------

/**
 * 必填校验方法
 * @param val
 * @return {string}
 */
export function required (val) {
  if (val === undefined || val === null || val === '' || (val instanceof Array && val.length === 0)) {
    return '{{label}}不能为空'
  }
}

/**
 * 字符串长度校验方法
 * @param val 当前字段值
 * @param option 校验选项 (两个选项至少要设置1个)
 *  1) min：字符串最小长度
 *  2) max：字符串最大长度
 * @return {string} 如果校验失败返回错误提示信息
 */
export function length (val, option = {}) {
  if (val !== undefined && val !== null && val !== '') {
    if (typeof val !== 'string') {
      console.warn('校验规则 length 校验的值必须为字符串, val =', val)
      return
    }
    if (option.min !== undefined && option.max !== undefined) {
      if (val.length < option.min || val.length > option.max) {
        return `{{label}}必须填写${option.min}到${option.max}个字符`
      }
    } else if (option.min !== undefined) {
      if (val.length < option.min) {
        return `{{label}}至少需要填写${option.min}个字符`
      }
    } else if (option.max !== undefined) {
      if (val.length > option.max) {
        return `{{label}}最多可填写${option.max}个字符`
      }
    } else {
      console.warn('表单校验 length 的 option 中至少要有 min 和 max 其中一个参数！')
    }
  }
}

/**
 * 数字范围
 * @param val 当前要校验的数值
 * @param option 校验选项 (两个选项至少要设置1个)
 *  1) min：允许的最小数值
 *  2) max：允许的最大数值
 *  3) include: 是否包含边界值（默认为： true）
 * @return {string} 如果校验失败返回错误提示信息
 */
export function numRange (val, option = {}) {
  if (val !== undefined && val !== null && val !== '') {
    let num = Number(val)
    if (option.min !== undefined && option.max !== undefined) {
      if (option.include === false) { // 不包含边界值
        if (isNaN(num) || num <= option.min || num >= option.max) {
          return `{{label}}必须是大于${option.min}小于${option.max}的数字`
        }
      } else { // 包含边界值
        if (isNaN(num) || num < option.min || num > option.max) {
          return `{{label}}必须是${option.min}至${option.max}的数字`
        }
      }
    } else if (option.min !== undefined) {
      if (option.include === false) { // 不包含边界值
        if (isNaN(num) || num <= option.min) {
          return `{{label}}必须是大于${option.min}的数字`
        }
      } else { // 包含边界值
        if (isNaN(num) || num < option.min) {
          return `{{label}}必须是大于等于${option.min}的数字`
        }
      }
    } else if (option.max !== undefined) {
      if (option.include === false) { // 不包含边界值
        if (isNaN(num) || num >= option.max) {
          return `{{label}}必须是小于${option.max}的数字`
        }
      } else { // 包含边界值
        if (isNaN(num) || num > option.max) {
          return `{{label}}必须是小于等于${option.max}的数字`
        }
      }
    } else {
      console.warn('表单校验 numRange 的 option 中至少要有 min 和 max 其中一个参数！')
    }
  }
}

/**
 * 整数校验方法
 * @param val 当前字段值
 * @return {string} 如果校验失败返回错误提示信息
 */
export function intNum (val, option = {}) {
  if (val !== undefined && val !== null && val !== '') {
    let reg = /^-?([1-9][\d]*|0)$/
    let str = val.toString()
    if (!reg.test(str)) {
      return `{{label}}格式错误，必须为整数`
    }
  }
}

/**
 * 浮点数校验方法
 * @param val 当前字段值
 * @param option 校验选项
 *  1) integerSize：整数部分最大位数，默认：12
 *  2) decimalSize：小数部分最大位数，默认：2
 * @return {string} 如果校验失败返回错误提示信息
 */
export function floatNum (val, option = {}) {
  if (val !== undefined && val !== null && val !== '') {
    let integerSize = option.integerSize || 12 // 整数部分长度
    let decimalSize = option.decimalSize || 2 // 小数部分长度
    let reg = new RegExp(`^-?([1-9][\\d]{0,${integerSize}}|0)(\\.[\\d]{1,${decimalSize}})?$`)
    // let num = Math.abs(parseFloat(val))
    let str = val.toString()
    if (!reg.test(str)) {
      return `{{label}}数字格式错误，整数部分不能超过${integerSize}位，小数部分不能超过${decimalSize}位`
    }
  }
}

/**
 * 手机号码校验方法
 * @param val 当前字段值
 * @return {string} 如果校验失败返回错误提示信息
 */
export function phone (val, option = {}) {
  if (val !== undefined && val !== null && val !== '') {
    let reg = /^1[\d]{10}$/
    let str = val.toString()
    if (!reg.test(str)) {
      return `请输入11位手机号码`
    }
  }
}

/**
 * 邮箱校验方法
 * @param val 当前字段值
 * @return {string} 如果校验失败返回错误提示信息
 */
export function email (val, option = {}) {
  if (val !== undefined && val !== null && val !== '') {
    let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    let str = val.toString()
    if (!reg.test(str)) {
      return `请输入正确的邮箱地址`
    }
  }
}

const rules = {
  // 必填校验规则
  required,
  // 字符串长度校验规则, option: { min: 2, max: 10 }
  length,
  // 数值范围校验,option: { min: 1, max: 100 }
  numRange,
  // 整数校验规则
  intNum,
  // 浮点数校验规则, option: { integerSize: 12, decimalSize: 2 }
  floatNum,
  // 手机号码
  phone,
  // 邮箱
  email
}

export default {
  validate,
  /* 校验规则 */
  ...rules
}
