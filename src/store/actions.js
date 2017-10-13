import axios from 'axios'
import moment from 'moment'

// let BASE_URL = 'https://software-enginnering-daily-api.herokuapp.com/api'
let BASE_URL = 'http://localhost:4040/api'

export default {
  // Pages should probably start at largest page and go down in number
  // this way links stay around and it's easy to link toa  particular page.
  // perhaps even including a limit and redirect to max if something
  // too large is provided (in the url).
  fetchListData: ({ commit, dispatch, state, getters }, { type, category, page = 1, createdAtBefore, createdAfter, tags, search }) => {
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
    if (category) url += `&categories=${category}`

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

  fetchRecommendations: ({ commit, dispatch, state, getters }, { page = 1, category, createdAtBefore, type }) => {
    let token = getters.getToken
    commit('setActiveType', { type })
    let url = `${BASE_URL}/posts/recommendations?page=${page}`
    if (createdAtBefore) url += `&createdAtBefore=${createdAtBefore}`
    if (category) url += `&categories=${category}`
    return axios.get(url, {
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
    return axios.post(`${BASE_URL}/auth/register`, { username: email, password })
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
}
