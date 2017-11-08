export default {
  activePosts: (state, getters) => (page = 0) => {
    // @TODO if page is larger then send new request
    let prev = page - 1
    let prevOffset = prev * state.postsPerPage
    let pageOffset = page * state.postsPerPage

    return state.lists[state.activeType].slice(prevOffset, pageOffset)
  },
  getToken: (state) => {
    return state.token
  },
  isLoggedIn: function (state, getters) {
    return Boolean(getters.getToken)
  }
}
