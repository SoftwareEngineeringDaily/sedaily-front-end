import axios from 'axios'
import { BASE_URL } from './config.js'

export default {

  fetchMyFeed ({ getters, commit }, { userId }) {
    const options = {}
    const token = getters.getToken
    if (token) {
      options.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    const requestUrl = `${BASE_URL}/feed`
    return axios.get(requestUrl, options)
      .then((response) => {
        const feedItems = response.data
        commit('setFeedItems', { feedItems })
        return feedItems
      })
  },

  fetchProfileFeed ({ getters, commit }, { userId }) {
    const options = {}
    const token = getters.getToken
    if (token) {
      options.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    const requestUrl = `${BASE_URL}/feed/profile-feed/${userId}`
    return axios.get(requestUrl, options)
      .then((response) => {
        const feedItems = response.data
        commit('setFeedItems', { feedItems })
        return feedItems
      })
  }

}
