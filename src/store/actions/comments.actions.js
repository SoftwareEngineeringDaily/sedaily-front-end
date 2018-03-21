import Vue from 'vue'
import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  commentsCreate ({ commit, getters }, { content, entityId, rootEntityType, parentCommentId }) {
    const options = { content, entityType: rootEntityType }
    console.log('type?', options.entityType)
    if (parentCommentId) options.parentCommentId = parentCommentId

    const url = `${BASE_URL}/comments/forEntity/${entityId}`

    // commit('commentPrepend', {content, entityId, dateCreated: Date.now()})
    return axios.post(url, options)
  },

  likeComment: ({ commit, getters, state }, { id, entityId, parentCommentId }) => {
    if (!getters.isLoggedIn) {
      Vue.toasted.error('You must login to vote')
      return
    }
    commit('likeComment', { commentId: id, entityId, parentCommentId })
    return axios.post(`${BASE_URL}/comments/${id}/upvote`, {})
  },

  removeComment: ({ commit, getters, state }, { id }) => {
    console.log('ID', id)
    if (!getters.isLoggedIn) {
      Vue.toasted.error('Login to delete your comment')
      return
    }
    return axios.delete(`${BASE_URL}/comments/${id}`)
  },

  commentsFetch ({ getters, commit }, { entityId }) {
    const url = `${BASE_URL}/comments/forEntity/${entityId}`
    return axios.get(url)
      .then((response) => {
        const comments = response.data.result
        commit('setComments', { entityId, comments })
        return comments
      })
  }
}
