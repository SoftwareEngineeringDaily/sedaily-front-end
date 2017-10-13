import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    activeType: null,
    itemsPerPage: 25,
    items: {},
    users: {},
    lists: {
      top: [],
      new: [],
      recommendation: []
    },
    token: localStorage.getItem('token')
  },
  actions,
  mutations,
  getters
})

export default store
