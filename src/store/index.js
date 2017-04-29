import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import axios from 'axios'

let BASE_URL = 'http://localhost:4040/api'

Vue.use(Vuex)

let fakeItems = [
  {
    id: 1,
    score: 1,
    title: 'Testing',
    time: moment().toISOString(),
    upvoted: true,
    downvoted: false
  },
  {
    id: 2,
    score: 8,
    title: 'Testing 2',
    time: moment().toISOString(),
    upvoted: false,
    downvoted: true
  },
  {
    id: 3,
    score: 1,
    title: 'Testing 3',
    time: moment().toISOString(),
    upvoted: false,
    downvoted: false
  }
]

const store = new Vuex.Store({
  state: {
    activeType: null,
    itemsPerPage: 25,
    items: {},
    users: {},
    lists: {
      top: [],
      new: []
    }
  },

  actions: {
    fetchListData: ({ commit, dispatch, state }, { type, page = 1 }) => {
      commit('setActiveType', { type })
      return axios.get(`${BASE_URL}/posts?page=${page}&type=${type}`)
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

    fetchRecommendations: ({ commit, dispatch, state }, { page = 1, type }) => {
      commit('setActiveType', { type })
      return axios.get(`${BASE_URL}/posts/recommendations?page=${page}`)
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
      commit('setItems', { items: fakeItems })
      return new Promise((resolve, reject) => {
        resolve(fakeItems)
      })
    },

    upvote: ({commit, state}, { id }) => {
      commit('upVote', { articleId: id })
      // @TODO API call
      return new Promise((resolve, reject) => {
        resolve()
      })
    },

    downvote: ({commit, state}, { id }) => {
      commit('downVote', { articleId: id })
      // @TODO API call
      return new Promise((resolve, reject) => {
        resolve()
      })
    },

    login: ({commit, state}, { email, password }) => {
      return axios.post(`${BASE_URL}/auth/login`,
        {
          username: email,
          password
        })
        .then(function (response) {
          localStorage.setItem('token', response.token)
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
          localStorage.setItem('token', response.token)
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
      state.lists[type] = items
    },

    setItems: (state, { items }) => {
      items.forEach(item => {
        if (item) {
          Vue.set(state.items, item.id, item)
        }
      })
    },

    upVote: (state, { articleId }) => {
      state.items[articleId].score += 1
      state.items[articleId].upvoted = true
      state.items[articleId].downvoted = false
    },

    downVote: (state, { articleId }) => {
      state.items[articleId].score -= 1
      state.items[articleId].upvoted = false
      state.items[articleId].downvoted = true
    },

    logout: (state) => {
      console.log('logout')
      localStorage.setItem('token', '')
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

    getToken: () => {
      return localStorage.getItem('token')
    }
  }
})

export default store
