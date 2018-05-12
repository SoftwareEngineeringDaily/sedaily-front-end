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
