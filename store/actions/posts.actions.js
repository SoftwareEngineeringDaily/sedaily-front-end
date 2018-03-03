import moment from 'moment'
import { apiConfig } from '~/config'

const BASE_URL = apiConfig.BASE_URL

export default {
  // Pages should probably start at largest page and go down in number
  // this way links stay around and it's easy to link toa  particular page.
  // perhaps even including a limit and redirect to max if something
  // too large is provided (in the url).
  fetchListData ({ commit, dispatch, state, getters }, { type, category, page = 1, createdAtBefore, createdAfter, tags, search }) {
    if (!createdAtBefore && !createdAfter) createdAtBefore = moment().toISOString()
    const token = getters.getToken
    commit('setActiveType', { type })
    const options = {}

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
      const tagString = tags.join(',')
      url += `&tags=${tagString}`
    }

    return this.$axios.get(url, options)
      .then((response) => {
        commit('setList', { type, posts: response.data })
        commit('setPosts', { posts: response.data })
        return { posts: response.data, maxPage: 4 }
      })
      .catch((error) => {
      // @TODO: Add pretty pop up here
        console.log(error.response)
        alert(error.response.data.message)
      })
  },

  fetchRecommendations ({ commit, dispatch, state, getters }, { page = 1, category, createdAtBefore, type }) {
    const token = getters.getToken
    commit('setActiveType', { type })
    let url = `${BASE_URL}/posts/recommendations?page=${page}`
    if (createdAtBefore) url += `&createdAtBefore=${createdAtBefore}`
    if (category) url += `&categories=${category}`
    return this.$axios.get(url, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then((response) => {
        commit('setList', { type, posts: response.data })
        commit('setPosts', { posts: response.data })
        return { posts: response.data, maxPage: 4 }
      })
      .catch((error) => {
      // @TODO: Add pretty pop up here
        console.log(error)
      // alert(error.message)
      // alert(error.response.data.message)
      })
  },

  fetchArticle ({ commit, state, getters }, { id }) {
    console.log('fetch article', id)

    const options = {}

    const token = getters.getToken
    if (token) {
      options.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    return this.$axios.get(`${BASE_URL}/posts/${id}`, options)
      .then((response) => {
        var post = response.data
        commit('setPosts', { posts: [post] })
        return { post }
      })
      .catch((error) => {
      // @TODO: Add pretty pop up here
        console.log(error.response)
        alert(error.response.data.message)
      })
  },

  upvote ({ commit, getters, state }, { id }) {
    const token = getters.getToken
    if (!token) {
      alert('You must login to vote')
      return
    }
    commit('upVote', { articleId: id })
    const article = state.posts[id]
    return this.$axios.post(`${BASE_URL}/posts/${article._id}/upvote`, {}, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
  },

  downvote ({ commit, getters, state }, { id }) {
    const token = getters.getToken
    if (!token) {
      alert('You must login to vote')
      return
    }
    commit('downVote', { articleId: id })
    const article = state.posts[id]
    return this.$axios.post(`${BASE_URL}/posts/${article._id}/downvote`, {}, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
  }
}
