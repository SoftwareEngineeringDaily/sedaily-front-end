import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import clone from 'lodash/clone'

import { apiConfig } from '../../../config/apiConfig'

const BASE_URL = apiConfig.BASE_URL
const toastOptions = {
  singleton: true,
  theme: "bubble",
  position: "bottom-center",
  duration: 3000,
}

const PostActions = {

  getTopicsInSearch: ({ commit, dispatch, state, getters }, { topic, search, createdAtBefore }) => {

    if (!createdAtBefore) {
      createdAtBefore = moment().toISOString()
    }

    let url = `${BASE_URL}/posts`

    if (topic) url += `?topic=${topic}`
    if (topic === undefined && search ) url += `?search=${search}`
    if (search && topic ) url += `&search=${search}`
    if (search || topic) url += `&createdAtBefore=${createdAtBefore}`
    if (!search && !topic) url += `?createdAtBefore=${createdAtBefore}`

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

  getPostsList: ({ commit, dispatch, state, getters }, {page=1, type='popular'}) => {
    const MONTH_OFFSET = 2

    const date = new Date()
    date.setMonth(date.getMonth() - MONTH_OFFSET)

    let url = `${BASE_URL}/posts?limit=30&createdAtBefore=${date.toISOString()}`

    return axios.get(url)
      .then((response) => {
        const posts = response.data
        if (type=='popular'){
          posts.sort((a, b) => (a.thread.commentsCount > b.thread.commentsCount) ? -1 : 1)
        } else {
          posts.sort((a, b) => (0.5 - Math.random()))
        }

        commit('setPosts', { posts })
        return { posts, maxPage: 4 }
      })
      .catch((error) => {
        console.log(error)
        Vue.toasted.error(error.response.data.message)
      })
  },

  fetchSearch: ({ commit, dispatch, state, getters }, { query, page = 0 }) => {
    let url = `${BASE_URL}/posts/search`

    if (!query) {
      return this.getTopicsInSearch({})
    }

    url += `?query=${query}&page=${page}`

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'posts',
            eventAction: 'fetchSearchData',
            eventLabel: `url: ${url}`,
            eventValue: 1,
          }]
        ]
      }
    })

    return axios.get(url)
      .then((response) => {
        let posts = response.data.posts || []
        let nextPage = response.data.nextPage || 0

        commit('setPosts', { posts })
        commit('setNextPage', { nextPage })

        return { posts, nextPage, maxPage: 4 }
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
        commit('setPost', { post })
        return { post }
      })
      .catch((error) => {
        // @TODO: Add pretty pop up here
        console.log('error',error)
        console.error(error.response)
        Vue.toasted.error(error.response.data.message, toastOptions)
      })
  },

  upvote: ({ commit, getters, state }, { id }) => {
    if (!getters.isLoggedIn) {
      Vue.toasted.error('You must login to vote', toastOptions)

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
      Vue.toasted.error('You must login to vote', toastOptions)

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
  },

  likePost: ({ commit, getters, state }, { id, active }) => {
    let event = {
      eventLabel: id,
      eventValue: 1
    }

    const url = `${BASE_URL}/posts/${id}/like`
    const options = { active }
    const _post = clone(state.post)

    if (!getters.isLoggedIn) {
      Vue.toasted.error('You must login to vote', toastOptions)

      event.eventCategory = 'errors'
      event.eventAction = 'like -- not logged in'

      return commit('analytics', {
        meta : {
          analytics: [
            [ 'event', event ]
          ]
        }
      })
    }

    event.eventCategory = 'posts'
    event.eventAction = 'like'

    commit('analytics', {
      meta : {
        analytics: [
          [ 'event', event ]
        ]
      }
    })

    _post.likeActive = active
    _post.likeCount = _post.likeCount || 0
    _post.likeCount = Math.max(active ? ++_post.likeCount : --_post.likeCount, 0)

    commit('setPost', { post: _post })

    return axios.post(url, options)
      .then(({ data }) => {

        // Set again after response
        // so data is accurate
        _post.likeCount = data.likeCount
        _post.likeActive = data.likeActive

        commit('setPost', { post: _post })
      })
      .catch((error) => {

        // Reset post on error
        commit('setPost', { post: clone(state.post) })
        Vue.toasted.error(error.response.data.message)
      })
  }
}

export default PostActions
