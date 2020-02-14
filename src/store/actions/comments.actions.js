import Vue from 'vue'
import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  commentsCreate ({ commit, getters }, { content, highlight, entityId, rootEntityType, parentCommentId, mentions }) {
    const url = `${BASE_URL}/comments/forEntity/${entityId}`
    const options = {
      content,
      highlight,
      entityType: rootEntityType,
      mentions,
    }

    if (parentCommentId) {
      options.parentCommentId = parentCommentId
    }

    return axios.post(url, options)
  },

  likeComment: ({ commit, getters, state }, { id, entityId, parentCommentId }) => {
    if (!getters.isLoggedIn) {
      Vue.toasted.error('You must login to vote')
      return
    }

    return axios.post(`${BASE_URL}/comments/${id}/upvote`, {})
      .then((response) => {
        const comment = response.data.entity

        // Tricky since it doesn't come back down with replies:
        // We have to re-add them
        const currentComment = state.comments[comment._id]
        if (currentComment && currentComment.replies) {
          comment.replies = currentComment.replies
        }
        commit('setComment', { entity: comment })
        return response
      })
  },

  editComment: ({ commit, getters, state }, { content, mentions, id }) => {
    if (!getters.isLoggedIn) {
      Vue.toasted.error('Login to edit your comment')
      return
    }
    return axios.put(`${BASE_URL}/comments/${id}`, {content, mentions})
  },

  removeComment: ({ commit, getters, state }, { id }) => {
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
