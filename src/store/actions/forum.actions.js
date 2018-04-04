import Vue from 'vue'
import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  forumThreadCreate ({ commit, getters }, { content, title }) {
    const options = { content, title }

    const requestUrl = `${BASE_URL}/forum/`
    return axios.post(requestUrl, options)
  },

  forumThreadDelete: ({ commit, getters, state }, { id }) => {
    if (!getters.isLoggedIn) {
      Vue.toasted.error('Login to delete your post.')
      return
    }
    return axios.delete(`${BASE_URL}/forum/${id}`)
  },

  forumThreadLike: ({ commit, getters, state }, { id }) => {
    if (!getters.isLoggedIn) {
      Vue.toasted.error('You must login to vote')
      return
    }
    // commit('likeComment', { commentId: id, entityId, parentCommentId })
    return axios.post(`${BASE_URL}/forum/${id}/upvote`, {}).then((response) => {
      const forumThread = response.data.entity
      console.log('forumThread', forumThread)
      commit('setForumThread', { entity: forumThread })
      return response
    })
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
        commit('setForumThread', { entity: forumThread })
        return { forumThread }
      })
      .catch((error) => {
      // @TODO: Add pretty pop up here
        console.log(error.response)
        Vue.toasted.error(error.response.data.message)
      })
  }

}
