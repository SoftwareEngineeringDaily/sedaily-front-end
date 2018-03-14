import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  commentsCreate ({ commit, getters }, { content, entityId, parentCommentId }) {
    const options = { content }
    if (parentCommentId) options.parentCommentId = parentCommentId
    const token = getters.getToken
    const config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    const url = `${BASE_URL}/posts/${entityId}/comment`

    // commit('commentPrepend', {content, entityId, dateCreated: Date.now()})
    return axios.post(url, options, config)
  },

  likeComment: ({ commit, getters, state }, { id, entityId, parentCommentId }) => {
    const token = getters.getToken
    if (!token) {
      alert('You must login to vote')
      return
    }
    commit('likeComment', { commentId: id, entityId, parentCommentId })
    return axios.post(`${BASE_URL}/comments/${id}/upvote`, {}, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
  },

  removeComment: ({ commit, getters, state }, { id }) => {
    console.log('ID', id)
    const token = getters.getToken
    if (!token) {
      alert('Login to delete your comment')
      return
    }
    return axios.delete(`${BASE_URL}/comments/${id}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
  },

  commentsFetch ({ getters, commit }, { entityId }) {
    const options = {}
    const token = getters.getToken
    if (token) {
      options.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    const url = `${BASE_URL}/posts/${entityId}/comments`
    return axios.get(url, options)
      .then((response) => {
        const comments = response.data.result
        commit('setComments', { entityId, comments })
        return comments
      })
  }
}
