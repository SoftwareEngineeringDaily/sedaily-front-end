import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  forumThreadCreate ({ commit, getters }, { content, title }) {
    const options = { content, title }

    const requestUrl = `${BASE_URL}/forum/`
    return axios.post(requestUrl, options)
  },

  fetchForumThreads ({ getters, commit }) {
    const requestUrl = `${BASE_URL}/forum`
    return axios.get(requestUrl)
      .then((response) => {
        const forumThreads = response.data
        commit('setForumThreads', { list: forumThreads })
        return forumThreads
      })
  },

  fetchForumThread: ({ commit, state, getters }, { id }) => {
    return axios.get(`${BASE_URL}/forum/${id}`)
      .then((response) => {
        const forumThread = response.data
        commit('setForumThreads', { list: [forumThread] })
        return { forumThread }
      })
      .catch((error) => {
      // @TODO: Add pretty pop up here
        console.log(error.response)
        alert(error.response.data.message)
      })
  }

}
