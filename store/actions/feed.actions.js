import uniqBy from 'lodash/uniqBy'

export default {

  fetchMyFeed ({ getters, commit }, { userId }) {
    const requestUrl = '/feed'
    return this.$axios.get(requestUrl)
      .then((response) => {
        const feedItems = uniqBy(response.data, f => f._id)
        commit('setFeedItems', { feedItems })
        return feedItems
      })
  },

  fetchProfileFeed ({ getters, commit }, { userId }) {
    const requestUrl = `/feed/profile-feed/${userId}`
    return this.$axios.get(requestUrl)
      .then((response) => {
        const feedItems = uniqBy(response.data, f => f._id)
        commit('setFeedItems', { feedItems })
        return feedItems
      })
  }

}
