import { apiConfig } from '~/config'

const BASE_URL = apiConfig.BASE_URL

export default {
  relatedLinksCreate ({ commit, getters }, { url, title, postId }) {
    const options = { url, title }

    const requestUrl = `${BASE_URL}/posts/${postId}/related-link`
    return this.$axios.post(requestUrl, options)
  },

  removeRelatedLink ({ commit, getters, state }, { id }) {
    if (!getters.isLoggedIn) {
      alert('You must login to remove your link')
      return
    }
    if (!id) {
      alert('Error with that link')
      return
    }
    return this.$axios.delete(`${BASE_URL}/related-links/${id}`)
  },

  upvoteRelatedLink ({ commit, getters, state }, { id, postId }) {
    if (!getters.isLoggedIn) {
      alert('You must login to vote')
      return
    }
    commit('upvoteRelatedLink', { id, postId })
    return this.$axios.post(`${BASE_URL}/related-links/${id}/upvote`, {})
  },

  downvoteRelatedLink ({ commit, getters, state }, { id, postId }) {
    if (!getters.isLoggedIn) {
      alert('You must login to vote')
      return
    }
    commit('downvoteRelatedLink', { id, postId })
    return this.$axios.post(`${BASE_URL}/related-links/${id}/downvote`, {})
  },

  relatedLinksFetch ({ getters, commit }, { postId }) {
    const requestUrl = `${BASE_URL}/posts/${postId}/related-links`
    return this.$axios.get(requestUrl)
      .then((response) => {
        const relatedLinks = response.data
        commit('setRelatedLinks', { postId, relatedLinks })
        return relatedLinks
      })
  }
}
