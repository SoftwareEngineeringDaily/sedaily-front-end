import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  commentsCreate ({ commit, getters }, { content, postId, parentCommentId }) {
    const options = { content }
    if (parentCommentId) options.parentCommentId = parentCommentId
    const token = getters.getToken
    const config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    const url = `${BASE_URL}/posts/${postId}/comment`

    // commit('commentPrepend', {content, postId, dateCreated: Date.now()})
    return axios.post(url, options, config)
  },

  likeComment: ({ commit, getters, state }, { id, postId, parentCommentId }) => {
    const token = getters.getToken
    if (!token) {
      alert('You must login to vote')
      return
    }
    commit('likeComment', { commentId: id, postId, parentCommentId })
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

  commentsFetch ({ getters, commit }, { postId }) {
    const options = {}
    const token = getters.getToken
    if (token) {
      options.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    const url = `${BASE_URL}/posts/${postId}/comments`
    return axios.get(url, options)
      .then((response) => {
        const comments = response.data.result
        commit('setComments', { postId, comments })
        return comments
      })
  }
}
