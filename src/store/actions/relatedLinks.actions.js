import Vue from 'vue'
import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'

const TOAST_DELAY = 3000
const BASE_URL = apiConfig.BASE_URL

const formatLink = (url) => {
  if (url.trim().search(/http(s)?:\/\//g) < 0) {
    url = `http://${url}`
  }

  return url
}

export default {
  async relatedLinksCreate ({ commit, getters }, { url, postId, topicSlug, type }) {
    url = formatLink(url)

    if (type === 'episode' && url.trim().search(/softwaredaily\.com/g) < 0) {
      return Vue.toasted.error('Only episodes from softwaredaily.com are permitted.', {
        singleton: true,
        theme: 'bubble',
        position: 'bottom-center',
        duration: TOAST_DELAY,
      })
    }

    const options = { url, type }
    let requestUrl;
    if (postId) requestUrl = `${BASE_URL}/posts/${postId}/related-link`
    if (topicSlug) requestUrl = `${BASE_URL}/topic/${topicSlug}/related-link`

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
        theme: 'bubble',
        position: 'bottom-center',
        duration: TOAST_DELAY,
      })

      return
    }

    if (!id) {
      Vue.toasted.error('Error with that link', {
        singleton: true,
        theme: "bubble",
        position: "bottom-center",
        duration: TOAST_DELAY,
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
        duration: TOAST_DELAY,
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
        duration: TOAST_DELAY,
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

  relatedLinksFetch ({ getters, commit }, { postId, topicSlug }) {
    let requestUrl;
    if (postId) requestUrl = `${BASE_URL}/posts/${postId}/related-links`
    if (topicSlug) requestUrl = `${BASE_URL}/topic/${topicSlug}/related-links`
    return axios.get(requestUrl)
      .then((response) => {
        const relatedLinks = response.data
        commit('setRelatedLinks', { postId, topicSlug, relatedLinks })
        return relatedLinks
      })
  }
}
