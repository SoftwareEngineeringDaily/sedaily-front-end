import Vue from 'vue'
export default {

  setActivePostInPlayer: (state, { post }) => {
    state.activePlayerPost = post
  },

  setActiveType: (state, { type }) => {
    state.activeType = type
  },

  setMe: (state, me) => {
    state.me = me
  },

  setList: (state, { type, posts }) => {
    // This is currently doing an append to the list but
    // it should probably do a simple set like the function name
    // suggets.
    //
    // Though, I imagine what we are aiming for is to have pagination be
    // cached and so for that I think a better approach might be a simple
    // map. I am leaning towards not caching for the time being to avoid
    // extra complexity.
    state.lists[type] = state.lists[type].concat(posts)
  },
  commentPrepend: (state, comment) => {
    if (!state.postComments[comment.postId]) {
      Vue.set(state.postComments, comment.postId, [])
    }
    state.postComments[comment.postId].unshift(comment)
  },
  setComments: (state, {comments, postId}) => {
    Vue.set(state.postComments, postId, comments)
  },

  setPosts: (state, { posts }) => {
    posts.forEach(post => {
      if (post) {
        Vue.set(state.posts, post._id, post)
      }
    })
  },

  upVote: (state, { articleId }) => {
    let incrementValue = 1

    if (state.posts[articleId].downvoted) incrementValue += 1

    if (state.posts[articleId].upvoted) {
      state.posts[articleId].score -= incrementValue
    } else {
      state.posts[articleId].score += incrementValue
    }
    state.posts[articleId].upvoted = !state.posts[articleId].upvoted
    state.posts[articleId].downvoted = false
  },

  downVote: (state, { articleId }) => {
    let incrementValue = 1

    if (state.posts[articleId].upvoted) incrementValue += 1

    if (state.posts[articleId].downvoted) {
      state.posts[articleId].score += incrementValue
    } else {
      state.posts[articleId].score -= incrementValue
    }
    state.posts[articleId].upvoted = false
    state.posts[articleId].downvoted = !state.posts[articleId].downvoted
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
