import axios from 'axios'
import {BASE_URL} from './config.js'

export default {
  relatedLinksCreate ({commit, getters}, {url, title, postId}) {
    let options = {url, title}
    let token = getters.getToken
    let config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    let requestUrl = `${BASE_URL}/posts/${postId}/related-link`
    return axios.post(requestUrl, options, config)
  },

  removeRelatedLink: ({commit, getters, state}, {id}) => {
    let token = getters.getToken
    if (!token) {
      alert('You must login to vote')
      return
    }
    return axios.delete(`${BASE_URL}/related-links/${id}`, {}, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
  },

  upvoteRelatedLink: ({commit, getters, state}, {id, postId}) => {
    let token = getters.getToken
    if (!token) {
      alert('You must login to vote')
      return
    }
    commit('upvoteRelatedLink', {id, postId})
    return axios.post(`${BASE_URL}/related-links/${id}/upvote`, {}, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
  },

  downvoteRelatedLink: ({commit, getters, state}, {id, postId}) => {
    let token = getters.getToken
    if (!token) {
      alert('You must login to vote')
      return
    }
    commit('downvoteRelatedLink', {id, postId})
    return axios.post(`${BASE_URL}/related-links/${id}/downvote`, {}, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
  },

  relatedLinksFetch ({getters, commit}, {postId}) {
    let options = {}
    let token = getters.getToken
    if (token) {
      options.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    let requestUrl = `${BASE_URL}/posts/${postId}/related-links`
    return axios.get(requestUrl, options)
      .then((response) => {
        const relatedLinks = response.data
        commit('setRelatedLinks', {postId, relatedLinks})
        return relatedLinks
      })
  }
}
