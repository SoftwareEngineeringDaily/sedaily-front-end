export default {
  relatedLinksCreate ({ commit, getters }, { url, title, postId }) {
    const options = { url, title }

    const requestUrl = `/posts/${postId}/related-link`
    return this.$axios.post(requestUrl, options)
  },

  removeRelatedLink ({ commit, getters, state }, { id }) {
    if (!getters.isLoggedIn) {
      this.$toast.error('You must login to remove your link')
      return
    }
    if (!id) {
      this.$toast.error('Error with that link')
      return
    }
    return this.$axios.delete(`/related-links/${id}`)
  },

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
  },

  relatedLinksFetch ({ getters, commit }, { postId }) {
    const requestUrl = `/posts/${postId}/related-links`
    return this.$axios.get(requestUrl)
      .then((response) => {
        const relatedLinks = response.data
        commit('setRelatedLinks', { postId, relatedLinks })
        return relatedLinks
      })
  }
}
