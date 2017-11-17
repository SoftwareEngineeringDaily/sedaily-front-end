import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    activePlayerPost: { title: {} },
    activeType: null,
    posts: {},
    postComments: {},
    postRelatedLinks: {},
    feed: [],
    me: {},
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
