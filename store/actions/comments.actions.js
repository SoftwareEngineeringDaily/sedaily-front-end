export default {
  likeComment ({ commit, getters, state }, { id, postId, parentCommentId }) {

    commit('likeComment', { commentId: id, postId, parentCommentId })
    return this.$axios.post(`/comments/${id}/upvote`, {})
  }
}
