import Vue from 'vue'
export default {
  setActiveType: (state, { type }) => {
    state.activeType = type
  },

  setList: (state, { type, items }) => {
    // This is currently doing an append to the list but
    // it should probably do a simple set like the function name
    // suggets.
    //
    // Though, I imagine what we are aiming for is to have pagination be
    // cached and so for that I think a better approach might be a simple
    // map. I am leaning towards not caching for the time being to avoid
    // extra complexity.
    state.lists[type] = state.lists[type].concat(items)
  },
  commentPrepend: (state, comment) => {
    if (!state.itemComments[comment.postId]) {
      Vue.set(state.itemComments, comment.postId, [])
    }
    state.itemComments[comment.postId].unshift(comment)
  },
  setComments: (state, {comments, postId}) => {
    Vue.set(state.itemComments, postId, comments)
  },

  setItems: (state, { items }) => {
    items.forEach(item => {
      if (item) {
        Vue.set(state.items, item._id, item)
      }
    })
  },

  upVote: (state, { articleId }) => {
    let incrementValue = 1

    if (state.items[articleId].downvoted) incrementValue += 1

    if (state.items[articleId].upvoted) {
      state.items[articleId].score -= incrementValue
    } else {
      state.items[articleId].score += incrementValue
    }
    state.items[articleId].upvoted = !state.items[articleId].upvoted
    state.items[articleId].downvoted = false
  },

  downVote: (state, { articleId }) => {
    let incrementValue = 1

    if (state.items[articleId].upvoted) incrementValue += 1

    if (state.items[articleId].downvoted) {
      state.items[articleId].score += incrementValue
    } else {
      state.items[articleId].score -= incrementValue
    }
    state.items[articleId].upvoted = false
    state.items[articleId].downvoted = !state.items[articleId].downvoted
  },

  logout: (state) => {
    localStorage.setItem('token', '')
    state.token = ''
  },

  setToken: (state, { token }) => {
    localStorage.setItem('token', token)
    state.token = token
  }
}
