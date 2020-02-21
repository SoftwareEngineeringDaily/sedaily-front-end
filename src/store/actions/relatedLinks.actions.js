import Vue from 'vue'
import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  relatedLinksCreate ({ commit, getters }, { url, title, postId, type }) {
    const options = { url, title, type }

    const requestUrl = `${BASE_URL}/posts/${postId}/related-link`

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'related-links',
            eventAction: 'relatedLinksCreate',
            eventLabel: `url: ${url}`,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.post(requestUrl, options)
  },

  removeRelatedLink: ({ commit, getters, state }, { id }) => {
    if (!getters.isLoggedIn) {
      Vue.toasted.error('You must login to remove your link',{
        singleton: true,
        theme: "bubble",
        position: "bottom-center",
        duration : 700
      })

      return
    }

    if (!id) {
      Vue.toasted.error('Error with that link', {
        singleton: true,
        theme: "bubble",
        position: "bottom-center",
        duration : 700
      })

      return
    }

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'related-links',
            eventAction: 'removeRelatedLink',
            eventLabel: `id: ${id}`,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.delete(`${BASE_URL}/related-links/${id}`)
  },

  upvoteRelatedLink: ({ commit, getters, state }, { id, postId }) => {
    if (!getters.isLoggedIn) {
      Vue.toasted.error('You must login to vote', {
        singleton: true,
        theme: "bubble",
        position: "bottom-center",
        duration : 700
      })

      return
    }
    commit('upvoteRelatedLink', { id, postId })

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'related-links',
            eventAction: 'upvoteRelatedLink',
            eventLabel: `id: ${id}`,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.post(`${BASE_URL}/related-links/${id}/upvote`, {})
  },

  downvoteRelatedLink: ({ commit, getters, state }, { id, postId }) => {
    if (!getters.isLoggedIn) {
      Vue.toasted.error('You must login to vote', {
        singleton: true,
        theme: "bubble",
        position: "bottom-center",
        duration : 700
      })

      return
    }
    commit('downvoteRelatedLink', { id, postId })

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'related-links',
            eventAction: 'downvoteRelatedLink',
            eventLabel: `id: ${id}`,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.post(`${BASE_URL}/related-links/${id}/downvote`)
  },

  relatedLinksFetch ({ getters, commit }, { postId }) {
    const requestUrl = `${BASE_URL}/posts/${postId}/related-links`
    return axios.get(requestUrl)
      .then((response) => {
        const relatedLinks = response.data
        commit('setRelatedLinks', { postId, relatedLinks })
        return relatedLinks
      })
  }
}
