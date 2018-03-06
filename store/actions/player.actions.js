export default {
  playEpisode ({ commit }, post) {
    commit('setActivePostInPlayer', { post })
  },
  updatePlayerState ({ commit }, playerState) {
    commit('updatePlayerState', playerState)
  }
}
