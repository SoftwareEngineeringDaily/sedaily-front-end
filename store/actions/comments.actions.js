import { apiConfig } from '~/config'

const BASE_URL = apiConfig.BASE_URL

export default {
  commentsCreate ({ commit, getters }, { content, postId, parentCommentId }) {
    const options = { content }
    if (parentCommentId) options.parentCommentId = parentCommentId

    const url = `${BASE_URL}/posts/${postId}/comment`

    // commit('commentPrepend', {content, postId, dateCreated: Date.now()})
    return this.$axios.post(url, options)
  },

  likeComment ({ commit, getters, state }, { id, postId, parentCommentId }) {

    commit('likeComment', { commentId: id, postId, parentCommentId })
    return this.$axios.post(`${BASE_URL}/comments/${id}/upvote`, {})
  },

  removeComment ({ commit, getters, state }, { id }) {
    console.log('ID', id)

    return this.$axios.delete(`${BASE_URL}/comments/${id}`)
  },

  commentsFetch ({ getters, commit }, { postId }) {
    const url = `${BASE_URL}/posts/${postId}/comments`
    return this.$axios.get(url)
      .then((response) => {
        const comments = response.data.result
        commit('setComments', { postId, comments })
        return comments
      })
  }
}
