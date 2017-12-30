import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import initialState from './initialState'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: initialState,
  actions,
  mutations,
  getters
})

export default store
