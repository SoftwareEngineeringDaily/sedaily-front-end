import Vue from 'vue'
import Vuex from 'vuex'
import { analyticsMiddleware } from 'vue-analytics'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import initialState from './initialState'

import post from './post.module'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: initialState,
  actions,
  mutations,
  getters,
  post,
  plugins: [
    analyticsMiddleware
  ]
})

export default store
