/**
 * @file store index
 * 
 */

import Vue from 'vue'
import Vuex from 'vuex'
import base from './modules/base.js'
import select from './modules/select.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    base,
    select
  }
})
