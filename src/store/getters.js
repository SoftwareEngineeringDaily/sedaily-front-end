import { filter, flow, orderBy, values } from 'lodash/fp'

export default {
  activePosts: (state, getters) => (page = 0) => {
    // @TODO if page is larger then send new request
    const prev = page - 1
    const prevOffset = prev * state.postsPerPage
    const pageOffset = page * state.postsPerPage

    return state.lists[state.activeType].slice(prevOffset, pageOffset)
  },
  isChatBoxDisplayed: ({ chat }) => Boolean(chat.settings.displayBox),
  isChatOnline: ({ chat }) => Boolean(chat.online),
  isPlayerActive: ({ activePlayerPost }) => activePlayerPost && activePlayerPost._id,
  getToken: (state) => state.token,
  isLoggedIn: (state, getters) => Boolean(getters.getToken),
  getNextEpisode: (state) => (previousPost) => {
    const postsAfterCurrent = flow([
      values,
      filter((post) => post.date < previousPost.date),
      orderBy(['date'], ['desc'])
    ])(state.posts)

    if (postsAfterCurrent.length) {
      return postsAfterCurrent[0]
    } else {
      return state.posts[0]
    }
  }
}
