export default {
  commentsCreate ({ commit, getters }, { content, postId, parentCommentId }) {
    const options = { content }
    if (parentCommentId) options.parentCommentId = parentCommentId

    const url = `/posts/${postId}/comment`

    // commit('commentPrepend', {content, postId, dateCreated: Date.now()})
    return this.$axios.post(url, options)
  },

  likeComment ({ commit, getters, state }, { id, postId, parentCommentId }) {

    commit('likeComment', { commentId: id, postId, parentCommentId })
    return this.$axios.post(`/comments/${id}/upvote`, {})
  },

  removeComment ({ commit, getters, state }, { id }) {
    console.log('ID', id)

    return this.$axios.delete(`/comments/${id}`)
  },

  commentsFetch ({ getters, commit }, { postId }) {
    const url = `/posts/${postId}/comments`
    return this.$axios.get(url)
      .then((response) => {
        const comments = response.data.result
        commit('setComments', { postId, comments })
        return comments
      })
  }
}
