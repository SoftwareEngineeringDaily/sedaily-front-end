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
    placeholderAvatar: 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/profile-icon-9.png',
    me: {},
    users: {},
    lists: {
      top: [],
      new: [],
      recommendation: []
    },
    chat: {
      settings: {
        displayBox: true
      },
      messages: []
    },
    token: localStorage.getItem('token')
  },
  actions,
  mutations,
  getters
})

export default store
