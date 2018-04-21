import { filter, flow, orderBy, values } from 'lodash/fp'

export default {
  activePosts: (state, getters) => (page = 0) => {
    // TODO: if page is larger then send new request
    const prev = page - 1
    const offset = {
      prev: prev * state.postsPerPage,
      page: page * state.postsPerPage
     }
    return state.lists[state.activeType].slice(offset.prev, offset.page)
  },
  isChatBoxDisplayed ({ chat }) {
    return Boolean(chat.settings.displayBox)
  },
  isChatOnline ({ chat }) {
    return Boolean(chat.online)
  },
  isPlayerActive ({ activePlayerPost }) {
    return activePlayerPost.hasOwnProperty('_id')
  },
  getToken (state) {
    return state.token
  },
  isLoggedIn (state, getters) {
    return Boolean(getters.getToken)
  },
  getNextEpisode: (state) => (previousPost) => {
    const postsAfterCurrent = flow([
      values,
      filter((post) => post.date < previousPost.date),
      orderBy(['date'], ['desc'])
    ])(state.posts)
    return postsAfterCurrent ? postsAfterCurrent[0] : state.posts[0]
  },
  metaTag: (state) => (vmid, contentValue = undefined) => {
    // use default if contentValue not specified
    const content = contentValue ? contentValue: state.defaultMetaContent[vmid]
    // open graph (og), uses 'property' key instead of 'name'
    return vmid.substr(0,2) === 'og' ? { vmid, property: vmid, content} : { vmid, name: vmid, content }
  }
}
