import axios from 'axios'
import { actionVars } from '../../../config/index.js'
const BASE_URL = actionVars.BASE_URL

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
