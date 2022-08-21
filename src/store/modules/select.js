/**
 * 下拉框相关数据
 * 
 * @date 2020/10/13
 */
import api from '@/assets/js/api.js'
// 选项加载状态-未加载
const LOAD_STATUS_NOT_START = 'not-start'
// 选项加载状态-已加载
const LOAD_STATUS_LOADING = 'loading'
// 选项加载状态-已加载
const LOAD_STATUS_LOADED = 'loaded'

const state = {
  // 是否选项数组
  yesNoOptions: [
    { value: '0', label: '否' },
    { value: '1', label: '是' }
  ],
  // 币种选项数组
  currencyOptions: [],
  // 级别选项数组
  levelOptions: [],

  // 选项加载状态
  loadStatusMap: {}
}

const getters = {}
for (let key in state) {
  let val = state[key]
  if (/Options$/.test(key) && val instanceof Array) {
    if (val.length > 0) {
      state.loadStatusMap[key] = LOAD_STATUS_LOADED
    } else {
      state.loadStatusMap[key] = LOAD_STATUS_NOT_START
    }

    // 增加选型组的值到名称映射的getter属性
    // 例：state 中存在 yesNoOptions, 通过 vm.$store.getters.yesNoOptionsMap 可获得值到名称的映射
    // 数据格式：{ "0": "否", "1": "是" }
    getters[key + 'Map'] = s => {
      const optionsMap = {}
      const options = s[key]
      if (options && options.length > 0) {
        options.forEach((option) => {
          optionsMap[option.value] = option.label
        })
      }
      return optionsMap
    }
  }
  // 增加选项数组的getter属性（例：state 中存在 currencyOptions, 通过 vm.$store.getters.currencyOptions 可获得选项数组）
  getters[key] = s => s[key]
}

const getOptionMethods = {
  // 获取币种选项
  currency: (vm) => {
    return api.get({
      url: '/api/dict/currency'
    }, vm).then(data => {
      let options = []
      if (data && data instanceof Array) {
        options = data.map((item) => {
          return { value: item.code, label: item.ccyName }
        })
      }
      return options
    })
  },
  // 获取级别选项
  level: (vm) => {
    return api.get({
      url: '/api/dict/level'
    }, vm).then(data => {
      let options = []
      if (data && data instanceof Array) {
        options = data.map((item) => {
          return { value: item.code, label: item.name }
        })
      }
      return options
    })
  }
}

// 异步获取数据，commit给mutations，mutations改变state
const actions = {
  /**
   * 初始化指定下拉选项
   * @param type  类型，例：currency
   * @param vm    Vue实例
   * @param force 是否强制查询（默认为：false）
   *              false: 如果选项已经初始化则不查询直接返回，如果选项未初始化则进行查询
   *              true: 不论选项有没有初始化，都进行查询
   * @returns {Promise<Array>} 选项数组，例： [ {value: '0', label: '否'}, {value: '1', label: '是'} ]
   */
  initOptions ({ state, dispatch }, { type, vm, force }) {
    // 选项加载状态
    const loadStatus = state.loadStatusMap[type + 'Options']
    if (loadStatus === LOAD_STATUS_NOT_START || force) { // 还未加载或者需要强制加载
      return dispatch('queryOptions', { type, vm })
    } else if (loadStatus === LOAD_STATUS_LOADED) { // 已加载完成
      return Promise.resolve(state[type + 'Options'])
    } else if (loadStatus === LOAD_STATUS_LOADING) { // 正在加载中
      return new Promise((resolve, reject) => {
        vm.$eventBus.$onReady(`SELECT_OPTIONS_${type.toUpperCase()}_READY`, (options) => {
          resolve(options)
        })
      })
    } else {
      console.error(`store/modules/select.js 未定义 ${type} 下拉类型对应的state： ${type + 'Options'}`)
    }
  },
  /* 获取选项数组 */
  queryOptions ({ commit }, { type, vm }) {
    commit('setLoadStatus', { type, loadStatus: LOAD_STATUS_LOADING })
    if (getOptionMethods[type]) {
      return getOptionMethods[type](vm).then((options) => {
        commit('setOptions', { type, options: options })
        commit('setLoadStatus', { type, loadStatus: LOAD_STATUS_LOADED })
        vm.$eventBus.$emitReady(`SELECT_OPTIONS_${type.toUpperCase()}_READY`, options)
        return options
      })
    } else {
      console.error(`未定义select选项[${type}]的获取方法`)
    }
  },
  /* 批量获取选项数组 */
  batchQueryOptions ({ commit }, { types, vm }) {
    if (types instanceof Array) {
      types.forEach((type) => {
        commit('setLoadStatus', { type, loadStatus: LOAD_STATUS_LOADING })
      })
    }
    return api.post({
      url: '/api/dict/batch',
      data: { types }
    }, vm).then(data => {
      let group = {}
      types.forEach((type) => {
        let curTypeData = data[type]
        if (curTypeData && curTypeData instanceof Array) {
          let options = curTypeData.map((item) => {
            return { value: item.code, label: item.name }
          })
          group[type] = options
          commit('setOptions', { type, options: options })
          commit('setLoadStatus', { type, loadStatus: LOAD_STATUS_LOADED })
          vm.$eventBus.$emitReady(`SELECT_OPTIONS_${type.toUpperCase()}_READY`, options)
        }
      })
      return group
    })
  }
}

// 同步获取
const mutations = {
  setLoadStatus (state, data) {
    state.loadStatusMap[data.type + 'Options'] = data.loadStatus
  },
  setOptions (state, data) {
    state[data.type + 'Options'] = data.options
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
