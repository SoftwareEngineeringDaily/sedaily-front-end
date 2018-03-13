import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  fetchForum ({ getters, commit }) {
    const options = {}
    const token = getters.getToken
    if (token) {
      options.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    const requestUrl = `${BASE_URL}/forum`
    return axios.get(requestUrl, options)
      .then((response) => {
        const forumThreads = response.data
        commit('setForumThreads', { list: forumThreads })
        return forumThreads
      })
  }

}
