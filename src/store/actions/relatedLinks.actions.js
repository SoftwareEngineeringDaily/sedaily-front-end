import axios from 'axios'
import { actionVars } from '../../../config/index.js'
const BASE_URL = actionVars.BASE_URL

export default {
  relatedLinksCreate ({ commit, getters }, { url, title, postId }) {
    const options = { url, title }
    const token = getters.getToken
    const config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    const requestUrl = `${BASE_URL}/posts/${postId}/related-link`
    return axios.post(requestUrl, options, config)
  },

  removeRelatedLink: ({ commit, getters, state }, { id }) => {
    const token = getters.getToken
    if (!token) {
      alert('You must login to remove your link')
      return
    }
    if (!id) {
      alert('Error with that link')
      return
    }
    return axios.delete(`${BASE_URL}/related-links/${id}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
  },

  upvoteRelatedLink: ({ commit, getters, state }, { id, postId }) => {
    const token = getters.getToken
    if (!token) {
      alert('You must login to vote')
      return
    }
    commit('upvoteRelatedLink', { id, postId })
    return axios.post(`${BASE_URL}/related-links/${id}/upvote`, {}, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
  },

  downvoteRelatedLink: ({ commit, getters, state }, { id, postId }) => {
    const token = getters.getToken
    if (!token) {
      alert('You must login to vote')
      return
    }
    commit('downvoteRelatedLink', { id, postId })
    return axios.post(`${BASE_URL}/related-links/${id}/downvote`, {}, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
  },

  relatedLinksFetch ({ getters, commit }, { postId }) {
    const options = {}
    const token = getters.getToken
    if (token) {
      options.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    const requestUrl = `${BASE_URL}/posts/${postId}/related-links`
    return axios.get(requestUrl, options)
      .then((response) => {
        const relatedLinks = response.data
        commit('setRelatedLinks', { postId, relatedLinks })
        return relatedLinks
      })
  }
}
