import axios from 'axios'
import {BASE_URL} from './config.js'

export default {
  relatedLinksCreate ({commit, getters}, {url, postId}) {
    let options = {url}
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
