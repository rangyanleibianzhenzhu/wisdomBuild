/*
 * 默认配置
 */
// 默认参数配置
const props = {
  // 触发加载的临界距离
  distance: 100,
  // 强制使用无限滚动包裹器
  forceUseInfiniteWrapper: false
}

/**
 * 默认系统配置
 */
const system = {
  // scroll 事件节流的间隔时间（单位：毫秒）
  throttleLimit: 50,

  // the timeout for check infinite loop, unit: ms
  loopCheckTimeout: 1000,

  // the max allowed number of continuous calls, unit: ms
  loopCheckMaxCalls: 10
}

/**
 * default slot messages
 */
const slots = {
  noResults: '没有查到任何数据 o(╥﹏╥)o',
  noMore: '没有更多了',
  error: '加载异常 o(╥﹏╥)o',
  errorBtnText: '再试'
}

/**
 * 是否支持 事件第3个参数 passive 的安全检测
 * （如果支持 passive 并且值为true 则表示 listener 永远不会调用 preventDefault()，从而改善滚屏新能）
 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 */
export const evt3rdArg = (() => {
  let result = false

  try {
    const arg = Object.defineProperty({}, 'passive', {
      get () {
        result = { passive: true }
        return true
      }
    })

    window.addEventListener('testpassive', arg, arg)
    window.remove('testpassive', arg, arg)
  } catch (e) { /* */ }

  return result
})()

/**
 * 警告信息
 */

export const WARNINGS = {
  STATE_CHANGER: [
    'emit `loaded` and `complete` event through component instance of `$refs` may cause error, so it will be deprecated soon, please use the `$state` argument instead (`$state` just the special `$event` variable):',
    '\ntemplate:',
    '<infinite-loading @infinite="infiniteHandler"></infinite-loading>',
    `
script:
...
infiniteHandler($state) {
  ajax('https://www.example.com/api/news')
    .then((res) => {
      if (res.data.length) {
        $state.loaded();
      } else {
        $state.complete();
      }
    });
}
...`,
    '',
    'more details: https://github.com/PeachScript/vue-infinite-loading/issues/57#issuecomment-324370549',
  ].join('\n')
}

/**
 * error messages
 */

export const ERRORS = {
  INFINITE_LOOP: [
    `executed the callback function more than ${system.loopCheckMaxCalls} times for a short time, it looks like searched a wrong scroll wrapper that doest not has fixed height or maximum height, please check it. If you want to force to set a element as scroll wrapper ranther than automatic searching, you can do this:`,
    `
<!-- add a special attribute for the real scroll wrapper -->
<div infinite-wrapper>
  ...
  <!-- set force-use-infinite-wrapper -->
  <infinite-loading force-use-infinite-wrapper></infinite-loading>
</div>
or
<div class="infinite-wrapper">
  ...
  <!-- set force-use-infinite-wrapper as css selector of the real scroll wrapper -->
  <infinite-loading force-use-infinite-wrapper=".infinite-wrapper"></infinite-loading>
</div>
    `,
    'more details: https://github.com/PeachScript/vue-infinite-loading/issues/55#issuecomment-316934169',
  ].join('\n')
}

/**
 * plugin status constants
 */
export const STATUS = {
  READY: 0,
  LOADING: 1,
  COMPLETE: 2,
  ERROR: 3
}

/**
 * default slot styles
 */
export const SLOT_STYLES = {
  color: '#666',
  fontSize: '14px',
  padding: '10px 0'
}

export default {
  mode: 'development',
  props,
  system,
  slots,
  WARNINGS,
  ERRORS,
  STATUS
}
