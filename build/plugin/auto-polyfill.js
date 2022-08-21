/**
 * IE 浏览器自动加载 JS 垫片
 * @type {string}
 */
!(function () {
  var ua = navigator.userAgent;
  var isIE = false;
  if (/MSIE ([^;]+)/.test(ua)){
    isIE = true;
  }
  if('ActiveXObject' in window){
    isIE = true;
  }
  if (isIE) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '/static/js/polyfill.js';
    document.body.appendChild(script);

    // console垫片
    if (!window.console) {
      var fun = function () {};
      window.console = {
        log: fun,
        info: fun,
        warn: fun,
        error: fun,
        assert: fun,
        clear: fun,
        count: fun,
        group: fun,
        groupCollapsed: fun,
        groupEnd: fun,
        table: fun,
        time: fun,
        timeEnd: fun,
        trace: fun
      };
    }

    if (!window.Blob) {
      window.Blob = function () {
        console.error('当前浏览器不支持Blob!')
      }
    }

    if (!window.FormData) {
      window.FormData = function () {
        console.error('当前浏览器不支持FormData!')
      }
    }
  }
})();

