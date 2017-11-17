import axios from 'axios'
import {BASE_URL} from './config.js'

export default {

  fetchMyFeed ({getters, commit}, {userId}) {
    let options = {}
    let token = getters.getToken
    if (token) {
      options.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    let requestUrl = `${BASE_URL}/feed`
    return axios.get(requestUrl, options)
      .then((response) => {
        const feedItems = response.data
        commit('setFeedItems', {feedItems})
        return feedItems
      })
  }
}
