import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import clone from 'lodash/clone'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import keys from 'lodash/keys'

import { apiConfig } from '../../../config/apiConfig'

const BASE_URL = apiConfig.BASE_URL
const toastOptions = {
  singleton: true,
  theme: "bubble",
  position: "bottom-center",
  duration: 3000,
}

// Clean Observer `__ob__`
const co = (obj = {}) => {
  return JSON.parse(JSON.stringify(obj))
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

  getPostsList: ({ commit, dispatch, state, getters }, { type = 'popular', createdAtBefore }) => {
    if (!createdAtBefore) {
      createdAtBefore = moment().toISOString()
    }

    let url = `${BASE_URL}/posts?type=top&limit=30&createdAtBefore=${createdAtBefore}`

    return axios.get(url)
      .then((response) => {
        const posts = response.data

        if (type == 'popular') {
          posts.sort((a, b) => {
            return (a.thread && b.thread && a.thread.commentsCount > b.thread.commentsCount) ? -1 : 1
          })
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
        const posts = response.data.posts || []
        const nextPage = response.data.nextPage || 0
        const isEnd = response.data.isEnd

        commit('setPosts', { posts })
        commit('setNextPage', { nextPage })

        return { posts, nextPage, isEnd, maxPage: 4 }
      })
      .catch((error) => {
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
        console.error('error ', error)
        Vue.toasted.error(error.response.data.message, toastOptions)
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
        console.error('error ', error)
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

  likePost: ({ commit, getters, state }, { id, active, posts = [] }) => {
    const url = `${BASE_URL}/posts/${id}/like`
    const options = { active }

    let _post = (state.post._id === id) ? state.post : {}
    let event = {
      eventLabel: id,
      eventValue: 1
    }

    if (!getters.isLoggedIn) {
      Vue.toasted.error('You must be logged in to like a post', toastOptions)

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

    _post = isEmpty(_post) ? find(posts, { _id: id }) || {} : _post

    _post.upvoted = active
    _post.score = _post.score || 0
    _post.score = Math.max(active ? ++_post.score : --_post.score, 0)

    for (let i = 0; i < posts.length; i++) {
      if (posts[i]._id === id) {
        posts[i].upvoted = !!(_post.upvoted)
        posts[i].score = _post.score
        break
      }
    }

    commit('setPost', { post: _post })
    commit('setPosts', { posts })

    return axios.post(url, options)
      .then(({ data }) => {

        // Set again after response
        // so data is accurate
        _post.score = data.score
        _post.upvoted = data.upvoted

        commit('setPost', { post: _post })
      })
      .catch((error) => {

        // Reset post on error
        commit('setPost', { post: clone(state.post) })
        Vue.toasted.error(error.response.data.message)
      })
  },

  bookmarkPost: ({ commit, getters, state }, { id, active, posts = [] }) => {
    const url = `${BASE_URL}/posts/${id}/${active ? '' : 'un'}bookmark`
    const options = { active }

    let _post = (state.post._id === id) ? state.post : {}
    let event = {
      eventLabel: id,
      eventValue: 1
    }

    if (!getters.isLoggedIn) {
      Vue.toasted.error('You must be logged in to bookmark', toastOptions)

      event.eventCategory = 'errors'
      event.eventAction = 'bookmark -- not logged in'

      return commit('analytics', {
        meta : {
          analytics: [
            [ 'event', event ]
          ]
        }
      })
    }

    event.eventCategory = 'posts'
    event.eventAction = 'bookmark'

    commit('analytics', {
      meta : {
        analytics: [
          [ 'event', event ]
        ]
      }
    })

    _post = isEmpty(_post) ? find(posts, { _id: id }) || {} : _post

    _post.bookmarked = active
    _post.totalFavorites = _post.totalFavorites || 0
    _post.totalFavorites = Math.max(active ? ++_post.totalFavorites : --_post.totalFavorites, 0)

    for (let i = 0; i < posts.length; i++) {
      if (posts[i]._id === id) {
        posts[i].bookmarked = !!(_post.bookmarked)
        posts[i].totalFavorites = _post.totalFavorites
        break
      }
    }

    commit('setPost', { post: _post })
    commit('setPosts', { posts })

    return axios.post(url, options)
      .then(({ data }) => {

        // Set again after response
        // so data is accurate
        _post.totalFavorites = data.totalFavorites
        _post.bookmarked = data.active

        commit('setPost', { post: _post })
      })
      .catch((error) => {

        // Reset post on error
        commit('setPost', { post: clone(state.post) })
        Vue.toasted.error(error.response.data.message)
      })
  },

  updatePostTopics: (_, { topics, postId }) => {
    return axios.put(`${BASE_URL}/posts/${postId}/topics`,{ topics })
  },
}

export default PostActions
