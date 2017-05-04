import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import axios from 'axios'

let BASE_URL = 'http://localhost:4040/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    activeType: null,
    itemsPerPage: 25,
    items: {},
    users: {},
    lists: {
      top: [],
      new: []
    },
    token: localStorage.getItem('token')
  },

  actions: {
    fetchListData: ({ commit, dispatch, state, getters }, { type, page = 1, createdAtBefore }) => {
      if (!createdAtBefore) createdAtBefore = moment().toISOString()
      let token = getters.getToken
      commit('setActiveType', { type })
      return axios.get(`${BASE_URL}/posts?page=${page}&type=${type}&createdAtBefore=${createdAtBefore}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
        .then(function (response) {
          commit('setList', { type, items: response.data })
          commit('setItems', { items: response.data })
          return {items: response.data, maxPage: 4}
        })
        .catch(function (error) {
          // @TODO: Add pretty pop up here
          console.log(error)
          alert(error.message)
        })
    },

    fetchRecommendations: ({ commit, dispatch, state, getters }, { page = 1, type }) => {
      let token = getters.getToken
      commit('setActiveType', { type })
      return axios.get(`${BASE_URL}/posts/recommendations?page=${page}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
        .then(function (response) {
          commit('setList', { type, items: response.data })
          commit('setItems', { items: response.data })
          return {items: response.data, maxPage: 4}
        })
        .catch(function (error) {
          // @TODO: Add pretty pop up here
          console.log(error)
          // alert(error.message)
        })
    },

    fetchArticle: ({commit, state}, { id }) => {
    },

    upvote: ({commit, getters, state}, { id }) => {
      commit('upVote', { articleId: id })
      let article = state.items[id]
      let token = getters.getToken
      return axios.post(`${BASE_URL}/posts/${article._id}/upvote`, {}, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    },

    downvote: ({commit, getters, state}, { id }) => {
      commit('downVote', { articleId: id })
      let token = getters.getToken
      let article = state.items[id]
      return axios.post(`${BASE_URL}/posts/${article._id}/downvote`, {}, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    },

    login: ({commit, state}, { email, password }) => {
      return axios.post(`${BASE_URL}/auth/login`,
        {
          username: email,
          password
        })
        .then(function (response) {
          console.log(response)
          commit('setToken', {token: response.data.token})
        })
        .catch(function (error) {
          // @TODO: Add pretty pop up here
          console.log(error)
          alert(error.message)
        })
    },

    register: ({commit, state}, { email, password }) => {
      return axios.post(`${BASE_URL}/auth/register`,
        {
          username: email,
          password
        })
        .then(function (response) {
          commit('setToken', {token: response.data.token})
        })
        .catch(function (error) {
          // @TODO: Add pretty pop up here
          console.log(error)
          alert(error.message)
        })
    }
  },

  mutations: {
    setActiveType: (state, { type }) => {
      state.activeType = type
    },

    setList: (state, { type, items }) => {
      state.lists[type].concat(items)
    },

    setItems: (state, { items }) => {
      items.forEach(item => {
        if (item) {
          Vue.set(state.items, item.id, item)
        }
      })
    },

    upVote: (state, { articleId }) => {
      let incrementValue = 1

      if (state.items[articleId].downvoted) incrementValue += 1

      if (state.items[articleId].upvoted) {
        state.items[articleId].score -= incrementValue
      } else {
        state.items[articleId].score += incrementValue
      }
      state.items[articleId].upvoted = !state.items[articleId].upvoted
      state.items[articleId].downvoted = false
    },

    downVote: (state, { articleId }) => {
      let incrementValue = 1

      if (state.items[articleId].upvoted) incrementValue += 1

      if (state.items[articleId].downvoted) {
        state.items[articleId].score += incrementValue
      } else {
        state.items[articleId].score -= incrementValue
      }
      state.items[articleId].upvoted = false
      state.items[articleId].downvoted = !state.items[articleId].downvoted
    },

    logout: (state) => {
      localStorage.setItem('token', '')
      state.token = ''
    },

    setToken: (state, { token }) => {
      localStorage.setItem('token', token)
      state.token = token
    }
  },

  getters: {
    activeItems: (state, getters) => (page = 0) => {
      // @TODO if page is larger then send new request
      let prev = page - 1
      let prevOffset = prev * state.itemsPerPage
      let pageOffset = page * state.itemsPerPage

      return state.lists[state.activeType].slice(prevOffset, pageOffset)
    },

    getToken: (state) => {
      return state.token
    }
  }
})

export default store
