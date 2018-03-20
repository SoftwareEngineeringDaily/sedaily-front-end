import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  forumThreadCreate ({ commit, getters }, { content, title }) {
    const options = { content, title }
    const token = getters.getToken
    const config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    const requestUrl = `${BASE_URL}/forum/`
    return axios.post(requestUrl, options, config)
  },

  forumThreadLike: ({ commit, getters, state }, { id }) => {
    const token = getters.getToken
    if (!token) {
      alert('You must login to vote')
      return
    }
    // commit('likeComment', { commentId: id, entityId, parentCommentId })
    return axios.post(`${BASE_URL}/forum/${id}/upvote`, {}, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then((response) => {
      const forumThread = response.data.entity
      console.log('forumThread', forumThread)
      commit('setForumThread', { entity: forumThread })
      return response
    })
  },

  fetchForumThreads ({ getters, commit }) {
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
  },

  fetchForumThread: ({ commit, state, getters }, { id }) => {
    const options = {}
    const token = getters.getToken
    if (token) {
      options.headers = {
        'Authorization': 'Bearer ' + token
      }
    }
    return axios.get(`${BASE_URL}/forum/${id}`, options)
      .then((response) => {
        const forumThread = response.data
        commit('setForumThread', { entity: forumThread })
        return { forumThread }
      })
      .catch((error) => {
      // @TODO: Add pretty pop up here
        console.log(error.response)
        alert(error.response.data.message)
      })
  }

}
