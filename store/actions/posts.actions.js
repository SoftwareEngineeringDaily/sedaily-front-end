import moment from 'moment'

export default {
  // Pages should probably start at largest page and go down in number
  // this way links stay around and it's easy to link toa  particular page.
  // perhaps even including a limit and redirect to max if something
  // too large is provided (in the url).
  fetchListData ({ commit, dispatch, state, getters }, { type, category, page = 1, createdAtBefore, createdAfter, tags, search }) {
    if (!createdAtBefore && !createdAfter) createdAtBefore = moment().toISOString()

    commit('setActiveType', { type })

    let url = `/posts?page=${page}&type=${type}`
    if (createdAtBefore) url += `&createdAtBefore=${createdAtBefore}`
    if (createdAfter) url += `&createdAfter=${createdAfter}`
    if (search) url += `&search=${search}`
    if (category) url += `&categories=${category}`

    if (tags) {
      const tagString = tags.join(',')
      url += `&tags=${tagString}`
    }

    return this.$axios.get(url)
      .then((response) => {
        commit('setList', { type, posts: response.data })
        commit('setPosts', { posts: response.data })
        return { posts: response.data, maxPage: 4 }
      })
      .catch((error) => {
      // @TODO: Add pretty pop up here
        console.log(error.response)
      })
  },

  fetchRecommendations ({ commit, dispatch, state, getters }, { page = 1, category, createdAtBefore, type }) {
    commit('setActiveType', { type })
    let url = `/posts/recommendations?page=${page}`
    if (createdAtBefore) url += `&createdAtBefore=${createdAtBefore}`
    if (category) url += `&categories=${category}`
    return this.$axios.get(url)
      .then((response) => {
        commit('setList', { type, posts: response.data })
        commit('setPosts', { posts: response.data })
        return { posts: response.data, maxPage: 4 }
      })
      .catch((error) => {
      // @TODO: Add pretty pop up here
        console.log(error)
      })
  },

  fetchArticle ({ commit, state, getters }, { id }) {
    console.log('fetch article', id)

    return this.$axios.get(`/posts/${id}`)
      .then((response) => {
        var post = response.data
        commit('setPosts', { posts: [post] })
        return { post }
      })
      .catch((error) => {
      // @TODO: Add pretty pop up here
        console.log(error.response)
      })
  },

  upvote ({ commit, getters, state }, { id }) {
    if (!getters.isLoggedIn) {
      this.$toast.error('You must login to vote')
      return
    }
    commit('upVote', { articleId: id })
    const article = state.posts[id]
    return this.$axios.post(`/posts/${article._id}/upvote`, {})
  },

  downvote ({ commit, getters, state }, { id }) {
    if (!getters.isLoggedIn) {
      this.$toast.error('You must login to vote')
      return
    }
    commit('downVote', { articleId: id })
    const article = state.posts[id]
    return this.$axios.post(`/posts/${article._id}/downvote`, {})
  }
}
