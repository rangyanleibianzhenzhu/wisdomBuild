import { loadStyle } from './utils'

/**
 * JSON 转化为 HTML 字符串工具
 * @param {String | Object} data JSON数据
 * @retur {String} htmlString html字符转
 */
const JSONFormat = (function () {
  const _toString = Object.prototype.toString
  // 折叠展开图标
  const collapseIcon = '<span class="json-object-icon" onclick="__jsonToggleCollapse(this)"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEUAAACampqYmJiZmZmYmJiZmZmZmZmampqZmZmZmZmXl5eampqZmZmZmZmVlZWZmZmG6kFuAAAAD3RSTlMA1IA9Kt/Iv69wYFEtIwyht0PUAAAAOUlEQVQI12MgBvD/B4MCBjYIo4GBGUx/dWBgsAcxvgAV8YEYB0DK7////wusj/v/fwWICYqSDMQBADRzI2ARySoEAAAAAElFTkSuQmCC"/></span>'
  // 对象或数组折叠方法
  window.__jsonToggleCollapse = function (iconElement) {
    const isCollapse = iconElement.getAttribute('collapse') === 'Y'
    if (isCollapse) {
      iconElement.nextSibling.style.display = 'inline'
      iconElement.nextSibling.nextSibling.style.display = 'none'
      iconElement.className = iconElement.className.replace(/\s*collapse\b/, '')
    } else {
      iconElement.nextSibling.style.display = 'none'
      iconElement.nextSibling.nextSibling.style.display = 'inline'
      iconElement.className = iconElement.className + ' collapse'
    }
    iconElement.setAttribute('collapse', isCollapse ? 'N' : 'Y')
  }

  function format (object, indentCount) {
    let htmlFragment = ''
    switch (_typeof(object)) {
      case 'Null':
        htmlFragment = formatNull(object)
        break
      case 'Boolean':
        htmlFragment = formatBoolean(object)
        break
      case 'Number':
        htmlFragment = formatNumber(object)
        break
      case 'String':
        htmlFragment = formatString(object)
        break
      case 'Array':
        htmlFragment = formatArray(object, indentCount)
        break
      case 'Object':
        htmlFragment = formatObject(object, indentCount)
        break
    }
    return htmlFragment
  };

  function formatNull (object) {
    return '<span class="json-null">null</span>'
  }

  function formatBoolean (object) {
    return '<span class="json-boolean">' + object + '</span>'
  }

  function formatNumber (object) {
    return '<span class="json-number">' + object + '</span>'
  }

  function formatString (object) {
    /* eslint-disable no-useless-escape */
    object = object.replace(/\</g, '&lt;')
    /* eslint-disable no-useless-escape */
    object = object.replace(/\>/g, '&gt;')
    if (object.search(/^http/) >= 0) {
      object = '<a href="' + object + '" target="_blank" class="json_link">' + object + '</a>'
    }
    return ' <span class="json-string">"' + object + '"</span>'
  }

  function formatArray (object, indentCount) {
    const tmpArray = []
    for (let i = 0, size = object.length; i < size; ++i) {
      tmpArray.push(indentTab(indentCount + 1) + format(object[i], indentCount + 1))
    }
    return `${collapseIcon}<span data-type="array" data-size="${tmpArray.length}"> [<br/>${tmpArray.join(',<br/>')}<br/>${indentTab(indentCount)}]</span>` + // 展开时内容
      '<span style="display:none;" data-type="array"> [...]</span>' // 折叠时显示内容
  }

  function formatObject (object, indentCount) {
    const tmpArray = []
    for (const key in object) {
      tmpArray.push(`${indentTab(indentCount + 1)}<span class="json-key">${key}</span>:&nbsp;${format(object[key], indentCount + 1)}`)
    }
    return `${collapseIcon}<span data-type="object"> {<br/>${tmpArray.join(',<br/>')}<br/>${indentTab(indentCount)}}</span>` + // 展开时内容
      '<span style="display:none;" data-type="object"> {...}</span>' // 折叠时内容
  }

  function indentTab (indentCount) {
    return (new Array(indentCount + 1)).join('&nbsp;&nbsp;&nbsp;&nbsp;')
  }

  function _typeof (object) {
    const tf = typeof object
    const ts = _toString.call(object)
    return object === null
      ? 'Null'
      : tf === 'undefined'
        ? 'Undefined'
        : tf === 'boolean'
          ? 'Boolean'
          : tf === 'number'
            ? 'Number'
            : tf === 'string'
              ? 'String'
              : ts === '[object Function]'
                ? 'Function'
                : ts === '[object Array]'
                  ? 'Array'
                  : ts === '[object Date]' ? 'Date' : 'Object'
  }

  loadStyle(
    '.json-format-root{font-size:12px;line-height:1.4;}' +
    '.json-key{color: #92278f;font-weight:bold;}' +
    '.json-null{color:#f1592a;font-weight:bold;}' +
    '.json-string{color: #3ab54a;font-weight:bold;}' +
    '.json-number{color: #25aae2;font-weight:bold;}' +
    '.json-boolean{color: #e2a125;font-weight:bold;}' +
    '.json_link{color: #717171;font-weight:bold;}' +
    '.json-object-icon{display:inline-block;width:1.4em;height:1.4em;text-align:center;cursor: pointer;}' +
    '.json-object-icon img{width:12px;height:12px;vertical-align: -20%}' +
    '.json-object-icon.collapse img{transform: rotate(-90deg);}',
    'jsonFormat')

  const _JSONFormat = function (originData) {
    let data = {}
    if (typeof originData === 'string') {
      data = JSON.parse(originData)
    } else if (typeof originData === 'object') {
      data = originData
    }
    this.data = data
  }

  _JSONFormat.prototype = {
    constructor: JSONFormat,
    toString: function () {
      return `<span class="json-format-root">${format(this.data, 0)}</span>`
    }
  }

  return _JSONFormat
})()

export default JSONFormat
