import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import axios from 'axios'

let BASE_URL = 'https://software-enginnering-daily-api.herokuapp.com/api'
// let BASE_URL = 'http://localhost:4040/api'

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

  actions: {
    // Pages should probably start at largest page and go down in number
    // this way links stay around and it's easy to link toa  particular page.
    // perhaps even including a limit and redirect to max if something
    // too large is provided (in the url).
    fetchListData: ({ commit, dispatch, state, getters }, { type, page = 1, createdAtBefore, createdAfter, tags, search }) => {
      if (!createdAtBefore && !createdAfter) createdAtBefore = moment().toISOString()
      let token = getters.getToken
      commit('setActiveType', { type })
      let options = {}

      if (token) {
        options.headers = {
          'Authorization': 'Bearer ' + token
        }
      }

      let url = `${BASE_URL}/posts?page=${page}&type=${type}`
      if (createdAtBefore) url += `&createdAtBefore=${createdAtBefore}`
      if (createdAfter) url += `&createdAfter=${createdAfter}`
      if (search) url += `&search=${search}`

      if (tags) {
        let tagString = tags.join(',')
        url += `&tags=${tagString}`
      }

      return axios.get(url, options)
        .then(function (response) {
          commit('setList', { type, items: response.data })
          commit('setItems', { items: response.data })
          return {items: response.data, maxPage: 4}
        })
        .catch(function (error) {
          // @TODO: Add pretty pop up here
          console.log(error.response)
          alert(error.response.data.message)
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
          // alert(error.response.data.message)
        })
    },

    fetchArticle: ({commit, state, getters}, { id }) => {
      console.log('fetch article', id)

      let options = {}

      let token = getters.getToken
      if (token) {
        options.headers = {
          'Authorization': 'Bearer ' + token
        }
      }

      return axios.get(`${BASE_URL}/posts/${id}`, options)
        .then(function (response) {
          console.log('response', response)
          var item = response.data
          commit('setItems', { items: [item] })
          return {item}
        })
        .catch(function (error) {
          // @TODO: Add pretty pop up here
          console.log(error.response)
          alert(error.response.data.message)
        })
    },

    upvote: ({commit, getters, state}, { id }) => {
      let token = getters.getToken
      if (!token) {
        alert('You must login to vote')
        return
      }
      commit('upVote', { articleId: id })
      let article = state.items[id]
      return axios.post(`${BASE_URL}/posts/${article._id}/upvote`, {}, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    },

    downvote: ({commit, getters, state}, { id }) => {
      let token = getters.getToken
      if (!token) {
        alert('You must login to vote')
        return
      }
      commit('downVote', { articleId: id })
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
          commit('setToken', {token: response.data.token})
          return response
        })
        .catch(function (error) {
          // @TODO: Add pretty pop up here
          console.log(error)
          alert(error.response.data.message)
          return error
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
          return response
        })
        .catch(function (error) {
          // @TODO: Add pretty pop up here
          console.log(error.response)
          alert(error.response.data.message)
          return error
        })
    }
  },

  mutations: {
    setActiveType: (state, { type }) => {
      state.activeType = type
    },

    setList: (state, { type, items }) => {
      // This is currently doing an append to the list but
      // it should probably do a simple set like the function name
      // suggets.
      //
      // Though, I imagine what we are aiming for is to have pagination be
      // cached and so for that I think a better approach might be a simple
      // map. I am leaning towards not caching for the time being to avoid
      // extra complexity.
      state.lists[type] = state.lists[type].concat(items)
    },

    setItems: (state, { items }) => {
      items.forEach(item => {
        if (item) {
          Vue.set(state.items, item._id, item)
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
