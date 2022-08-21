/**
 * 客户端检测，并返回客户端信息
 */
export default function clientDetect () {
  // 浏览器引擎
  const engine = {
    ie: 0, // IE浏览器内核：trident
    gecko: 0, // Firefox 内核
    webkit: 0, // Chrome、 Safari、 Edge 浏览器内核
    khtml: 0, // Konqueror 浏览器内核
    opera: 0, // Opera 浏览器内核：presto

    // 引擎版本
    ver: null
  }

  // 浏览器
  const browser = {
    ie: 0, // 微软 IE 浏览器
    edge: 0, // 微软 Edge 浏览器
    firefox: 0, // 火狐浏览器
    safari: 0, // 苹果 Safari 浏览器
    konq: 0, // Konqueror 浏览器（Linux使用）
    opera: 0, // 欧朋浏览器
    chrome: 0, // 谷歌 Chrome 浏览器

    // 浏览器版本
    ver: null
  }

  // 操作系统
  const system = {
    win: false, // 微软 Window 操作系统
    mac: false, // 苹果 Mac 操作系统
    x11: false, // 基于 Linux 的 x11 操作系统

    // 移动设备操作系统
    iphone: false,
    ipod: false,
    ipad: false,
    ios: false,
    android: false,
    nokiaN: false,
    winMobile: false,

    // 游戏操作系统
    wii: false,
    ps: false
  }

  const clientInfo = {
    engine,
    browser,
    system
  }

  const ua = navigator.userAgent
  // Firefox 4.0.1 – Windows 7
  // {"engine":{"ie":0,"gecko":2,"webkit":0,"khtml":0,"opera":0,"ver":"2.0.1"},"browser":{"ie":0,"edge":0,"firefox":4,"safari":0,"konq":0,"opera":0,"chrome":0,"ver":"4.0.1"},"system":{"win":"7","mac":false,"x11":false,"iphone":false,"ipod":false,"ipad":false,"ios":false,"android":false,"nokiaN":false,"winMobile":false,"wii":false,"ps":false}}
  // const ua = 'Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1'

  // Edg 97.0.1072.69 – Windows 10
  // {"engine":{"ie":0,"gecko":0,"webkit":537.36,"khtml":0,"opera":0,"ver":"537.36"},"browser":{"ie":0,"edge":97,"firefox":0,"safari":0,"konq":0,"opera":0,"chrome":0,"ver":"97.0.1072.69"},"system":{"win":true,"mac":false,"x11":false,"iphone":false,"ipod":false,"ipad":false,"ios":false,"android":6,"nokiaN":false,"winMobile":false,"wii":false,"ps":false}}
  // const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 Edg/97.0.1072.69'
  if (window.opera) { // 欧朋浏览器
    engine.ver = browser.ver = window.opera.version()
    engine.opera = browser.opera = parseFloat(engine.ver)
  } else if (/AppleWebKit\/(\S+)/.test(ua)) {
    engine.ver = RegExp.$1
    engine.webkit = parseFloat(engine.ver)

    // 区分是 Chrome、 Safari 还是 Edge
    if (/Edg\/(\S+)/.test(ua)) { // 微软 Edge 浏览器
      browser.ver = RegExp.$1
      browser.edge = parseFloat(browser.ver)
    } else if (/Chrome\/(\S+)/.test(ua)) { // Chrome 浏览器
      browser.ver = RegExp.$1
      browser.chrome = parseFloat(browser.ver)
    } else if (/Version\/(\S+)/.test(ua)) { // Safari 浏览器
      browser.ver = RegExp.$1
      browser.safari = parseFloat(browser.ver)
    } else {
      // 近似版本
      let safariVersion = 1
      if (engine.webkit < 100) {
        safariVersion = 1
      } else if (engine.webkit < 312) {
        safariVersion = 1.2
      } else if (engine.webkit < 412) {
        safariVersion = 1.3
      } else {
        safariVersion = 2
      }

      browser.safari = browser.ver = safariVersion
    }
  } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
    engine.ver = browser.ver = RegExp.$1
    engine.khtml = browser.konq = parseFloat(engine.ver)
    /* eslint-disable no-useless-escape */
  } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
    engine.ver = RegExp.$1
    engine.gecko = parseFloat(engine.ver)

    if (/Firefox\/(\S+)/.test(ua)) {
      browser.ver = RegExp.$1
      browser.firefox = parseFloat(browser.ver)
    }
  } else if (/MSIE ([^;]+)/.test(ua)) {
    engine.ver = browser.ver = RegExp.$1
    engine.ie = browser.ie = parseFloat(engine.ver)
  }

  browser.ie = engine.ie
  browser.opera = engine.opera

  // 操作系统
  const p = navigator.platform
  system.win = p.indexOf('Win') === 0
  system.mac = p.indexOf('Mac') === 0
  system.x11 = (p === 'X11') || (p.indexOf('Linux') === 0)

  // Windows 操作系统
  if (system.win) {
    if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
      if (RegExp.$1 === 'NT') {
        switch (RegExp.$2) {
          case '5.0':
            system.win = '2000'
            break
          case '5.1':
            system.win = 'XP'
            break
          case '6.0':
            system.win = 'Vista'
            break
          case '6.1':
            system.win = '7'
            break
          case '10.0':
            system.win = '10'
            break
          default:
            system.win = 'NT'
            break
        }
      } else if (RegExp.$1 === '9x') {
        system.win = 'ME'
      } else {
        system.win = RegExp.$1
      }
    }
  }

  // 移动端设备
  system.iphone = ua.indexOf('iPhone') > -1
  system.ipod = ua.indexOf('iPod') > -1
  system.ipad = ua.indexOf('iPad') > -1
  system.nokiaN = ua.indexOf('NokiaN') > -1

  // windows mobile
  if (system.win === 'CE') {
    system.winMobile = system.win
  } else if (system.win === 'Ph') {
    if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
      system.win = 'Phone'
      system.winMobile = parseFloat(RegExp.$1)
    }
  }

  // 测定 iOS 版本
  if (system.mac && ua.indexOf('Mobile') > -1) {
    if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
      system.ios = parseFloat(RegExp.$1.replace('_', '.'))
    } else {
      system.ios = 2 // 如果无法测定，就暂时写成这样
    }
  }

  // 测定安卓版本
  if (/Android (\d+\.\d+)/.test(ua)) {
    system.android = parseFloat(RegExp.$1)
  }

  // 游戏操作系统
  system.wii = ua.indexOf('Wii') > -1
  system.ps = /playstation/i.test(ua)

  // 返回所有客户端信息
  return clientInfo
}
