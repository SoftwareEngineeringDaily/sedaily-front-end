import axios from 'axios'
import { apiConfig } from 'config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {

  fetchMyFeed ({ getters, commit }, { userId }) {
    const requestUrl = `${BASE_URL}/feed`
    return axios.get(requestUrl)
      .then((response) => {
        const feedItems = response.data
        commit('setFeedItems', { feedItems })
        return feedItems
      })
  },

  fetchProfileFeed ({ getters, commit }, { userId }) {
    const requestUrl = `${BASE_URL}/feed/profile-feed/${userId}`
    return axios.get(requestUrl)
      .then((response) => {
        const feedItems = response.data
        commit('setFeedItems', { feedItems })
        return feedItems
      })
  }

}
