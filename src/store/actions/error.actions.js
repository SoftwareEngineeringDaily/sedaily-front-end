export default {
  showErrorMessage ({ commit }, message) {
    commit('showErrorDialog', message)
  },
  closeErrorDialog ({ commit }) {
    commit('hideErrorDialog')
  }
}
