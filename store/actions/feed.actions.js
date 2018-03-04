import { apiConfig } from '~/config'
import uniqBy from 'lodash/uniqBy'

const BASE_URL = apiConfig.BASE_URL

export default {

  fetchMyFeed ({ getters, commit }, { userId }) {
    const requestUrl = `${BASE_URL}/feed`
    return this.$axios.get(requestUrl)
      .then((response) => {
        const feedItems = uniqBy(response.data, f => f._id)
        commit('setFeedItems', { feedItems })
        return feedItems
      })
  },

  fetchProfileFeed ({ getters, commit }, { userId }) {
    const requestUrl = `${BASE_URL}/feed/profile-feed/${userId}`
    return this.$axios.get(requestUrl)
      .then((response) => {
        const feedItems = uniqBy(response.data, f => f._id)
        commit('setFeedItems', { feedItems })
        return feedItems
      })
  }

}
