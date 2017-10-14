export default {
  activeItems: (state, getters) => (page = 0) => {
    // @TODO if page is larger then send new request
    let prev = page - 1
    let prevOffset = prev * state.itemsPerPage
    let pageOffset = page * state.itemsPerPage

    return state.lists[state.activeType].slice(prevOffset, pageOffset)
  },

  getToken: (state) => {
    return state.token
  }
}
