import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  playEpisode ({ commit }, post) {
    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'player',
            eventAction: 'playEpisode',
            eventLabel: post._id,
            eventValue: 1
          }]
        ]
      }
    })
    commit('setActivePostInPlayer', { post })
    const requestUrl = `${BASE_URL}/posts/${post._id}/listened`
    try {
      return axios.post(requestUrl, {})
    } catch (e) {

    }
  },

  updatePlayerState ({ commit }, playerState) {
    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'player',
            eventAction: 'playEpisode',
            eventLabel: playerState,
            eventValue: 1
          }]
        ]
      }
    })
    commit('updatePlayerState', playerState)
  }
}
