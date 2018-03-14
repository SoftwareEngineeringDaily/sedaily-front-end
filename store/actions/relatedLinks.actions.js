export default {
  upvoteRelatedLink ({ commit, getters, state }, { id, postId }) {
    if (!getters.isLoggedIn) {
      this.$toast.error('You must login to vote')
      return
    }
    commit('upvoteRelatedLink', { id, postId })
    return this.$axios.post(`/related-links/${id}/upvote`, {})
  },

  downvoteRelatedLink ({ commit, getters, state }, { id, postId }) {
    if (!getters.isLoggedIn) {
      this.$toast.error('You must login to vote')
      return
    }
    commit('downvoteRelatedLink', { id, postId })
    return this.$axios.post(`/related-links/${id}/downvote`, {})
  }
}
