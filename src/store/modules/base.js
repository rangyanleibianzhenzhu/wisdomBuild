/**
 * 基础信息
 * 
 * @date 2020/10/13
 */
import { QUERY_USER_INFO } from '../action-types'
import { SET_USER_INFO, SET_CUR_MENU_ID, SET_CUR_FULL_SCREEN, SET_CUR_FOLD_MENU } from '../mutation-types'
import api from '@/assets/js/api.js'

const state = {
  // 用户信息
  userInfo: {},
  // 当前菜单ID
  curMenuId: '',
  // 是否将tabs标签面板全屏(含页签和功能展示区域)
  fullScreen: false,
  // 是否将菜单折叠（菜单栏变窄）
  foldMenu: false
}

// 异步获取数据，commit给mutations，mutations改变state
const actions = {
  /* 获取用户信息 */
  [QUERY_USER_INFO] ({ commit }, params) {
    return api.get({
      url: '/api/user/getUser',
      timeout: 3000
    }, params.vm).then(data => {
      commit(SET_USER_INFO, data)
      return data
    })
  }
}

const getters = {
  // 当前用户信息
  userInfo: state => state.userInfo,
  /* // 当前用户权限
  perms: state => {
    if (state.userInfo && state.userInfo.permList) {
      let perms = {}
      state.userInfo.permList.forEach((resourceName) => {
        perms[resourceName] = true
      })
      return perms
    }
    return {}
  }, */
  // 当前菜单ID
  curMenuId: state => state.curMenuId,
  // 是否将tabs标签面板全屏(含页签和功能展示区域)
  fullScreen: state => state.fullScreen,
  // 是否将菜单折叠（菜单栏变窄）
  foldMenu: state => state.foldMenu
}

// 同步获取
const mutations = {
  [SET_USER_INFO] (state, data) {
    state.userInfo = data
  },
  // 设置当前菜单ID
  [SET_CUR_MENU_ID] (state, data) {
    state.curMenuId = data
  },
  // 设置是否将tabs标签面板全屏(含页签和功能展示区域)
  [SET_CUR_FULL_SCREEN] (state, data) {
    state.fullScreen = data
  },
  // 设置是否将菜单折叠（菜单栏变窄）
  [SET_CUR_FOLD_MENU] (state, data) {
    state.foldMenu = data
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
