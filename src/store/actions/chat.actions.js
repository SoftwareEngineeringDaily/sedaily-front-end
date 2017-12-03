export default {
  sendChatMessage ({ commit }, message) {
    commit('addChatMessage', message)
  }
}
