import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  // Pages should probably start at largest page and go down in number
  // this way links stay around and it's easy to link toa  particular page.
  // perhaps even including a limit and redirect to max if something
  // too large is provided (in the url).
  fetchListData: ({ commit, dispatch, state, getters }, { type, category, page = 1, createdAtBefore, createdAfter, tags, search }) => {
    if (!createdAtBefore && !createdAfter) createdAtBefore = moment().toISOString()

    commit('setActiveType', { type })

    let url = `${BASE_URL}/posts?page=${page}&type=${type}`
    if (createdAtBefore) url += `&createdAtBefore=${createdAtBefore}`
    if (createdAfter) url += `&createdAfter=${createdAfter}`
    if (search) url += `&search=${search}`
    if (category) url += `&categories=${category}`

    if (tags) {
      const tagString = tags.join(',')
      url += `&tags=${tagString}`
    }

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'posts',
            eventAction: 'fetchListData',
            eventLabel: `url: ${url}`,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.get(url)
      .then((response) => {
        commit('setList', { type, posts: response.data })
        commit('setPosts', { posts: response.data })
        return { posts: response.data, maxPage: 4 }
      })
      .catch((error) => {
      // @TODO: Add pretty pop up here
        console.log(error.response)
        Vue.toasted.error(error.response.data.message)
      })
  },

  getTopicsBySearch: ({ commit, dispatch, state, getters }, { topic, search }) => {

    let url = `${BASE_URL}/posts`
    if (topic) url += `?topic=${topic}`
    if (topic === undefined && search ) url += `?search=${search}`
    if (search && topic) url += `&search=${search}`

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'posts',
            eventAction: 'fetchListData',
            eventLabel: `url: ${url}`,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.get(url)
      .then((response) => {
        commit('setPosts', { posts: response.data })
        return { posts: response.data, maxPage: 4 }
      })
      .catch((error) => {
      // @TODO: Add pretty pop up here
        console.log(error.response)
        Vue.toasted.error(error.response.data.message)
      })
  },

  fetchRecommendations: ({ commit, dispatch, state, getters }, { page = 1, category, createdAtBefore, type }) => {
    commit('setActiveType', { type })
    let url = `${BASE_URL}/posts/recommendations?page=${page}`
    if (createdAtBefore) url += `&createdAtBefore=${createdAtBefore}`
    if (category) url += `&categories=${category}`

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'posts',
            eventAction: 'fetchRecommendations',
            eventLabel: `url: ${url}`,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.get(url)
      .then((response) => {
        commit('setList', { type, posts: response.data })
        commit('setPosts', { posts: response.data })
        return { posts: response.data, maxPage: 4 }
      })
      .catch((error) => {
      // @TODO: Add pretty pop up here
        console.log(error)
      // Vue.toasted.error(error.message)
      // Vue.toasted.error(error.response.data.message)
      })
  },

  // aka fetchPost
  fetchArticle: ({ commit, state, getters }, { id }) => {
    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'posts',
            eventAction: 'fetchArticle',
            eventLabel: `id: ${id}`,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.get(`${BASE_URL}/posts/${id}`)
      .then((response) => {
        var post = response.data
        commit('setPosts', { posts: [post] })
        return { post }
      })
      .catch((error) => {
      // @TODO: Add pretty pop up here
        console.log(error.response)
        Vue.toasted.error(error.response.data.message)
      })
  },

  upvote: ({ commit, getters, state }, { id }) => {
    if (!getters.isLoggedIn) {
      Vue.toasted.error('You must login to vote')

      commit('analytics', {
        meta : {
          analytics: [
            ['event', {
              eventCategory: 'errors',
              eventAction: 'upvote -- not logged in',
              eventLabel: id,
              eventValue: 1
            }]
          ]
        }
      })
      return
    }
    commit('upVote', { articleId: id })
    const article = state.posts[id]

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'posts',
            eventAction: 'upvote',
            eventLabel: `id: ${id}`,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.post(`${BASE_URL}/posts/${article._id}/upvote`)
  },

  downvote: ({ commit, getters, state }, { id }) => {
    if (!getters.isLoggedIn) {
      Vue.toasted.error('You must login to vote')

      commit('analytics', {
        meta : {
          analytics: [
            ['event', {
              eventCategory: 'errors',
              eventAction: 'downvote -- not logged in',
              eventLabel: id,
              eventValue: 1
            }]
          ]
        }
      })
      return
    }
    commit('downVote', { articleId: id })
    const article = state.posts[id]

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'posts',
            eventAction: 'downvote',
            eventLabel: `id: ${id}`,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.post(`${BASE_URL}/posts/${article._id}/downvote`)
  }
}
