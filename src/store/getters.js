export default {
  activePosts: (state, getters) => (page = 0) => {
    // @TODO if page is larger then send new request
    const prev = page - 1
    const prevOffset = prev * state.postsPerPage
    const pageOffset = page * state.postsPerPage

    return state.lists[state.activeType].slice(prevOffset, pageOffset)
  },
  getToken: (state) => state.token,
  isLoggedIn: (state, getters) => Boolean(getters.getToken)
}
