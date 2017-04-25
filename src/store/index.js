import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)

let fakeItems = [
  {
    id: 1,
    score: 1,
    title: 'Testing',
    time: moment().toISOString(),
    upvoted: true,
    downvoted: false
  },
  {
    id: 2,
    score: 8,
    title: 'Testing 2',
    time: moment().toISOString(),
    upvoted: false,
    downvoted: true
  },
  {
    id: 3,
    score: 1,
    title: 'Testing 3',
    time: moment().toISOString(),
    upvoted: false,
    downvoted: false
  }
]

// function fetchItems () {
//   return new Promise((resolve, reject) => {
//     resolve(fakeItems)
//   })
// }

function fetchIdsByType (type) {
  return new Promise((resolve, reject) => {
    resolve(fakeItems)
  })
}

function fetchUser () {
  return {}
}

const store = new Vuex.Store({
  state: {
    activeType: null,
    itemsPerPage: 2,
    items: {},
    users: {},
    lists: {
      top: [],
      new: []
    }
  },

  actions: {
    FETCH_LIST_DATA: ({ commit, dispatch, state }, { type, page = 1 }) => {
      commit('SET_ACTIVE_TYPE', { type })
      return fetchIdsByType(type, page)
        .then((items) => {
          commit('SET_LIST', { type, items })
          // @TODO: return max pages to
          return {items, maxPage: 3}
        })
    },

    FETCH_USER: ({ commit, state }, { id }) => {
      return state.users[id]
        ? Promise.resolve(state.users[id])
        : fetchUser(id).then(user => commit('SET_USER', { user }))
    },

    fetchArticle: ({commit, state}, { id }) => {
      commit('SET_ITEMS', { items: fakeItems })
      return new Promise((resolve, reject) => {
        resolve(fakeItems)
      })
    },

    upvote: ({commit, state}, { id }) => {
      commit('upVote', { articleId: id })
      // @TODO API call
      return new Promise((resolve, reject) => {
        resolve()
      })
    },

    downvote: ({commit, state}, { id }) => {
      commit('downVote', { articleId: id })
      // @TODO API call
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  },

  mutations: {
    SET_ACTIVE_TYPE: (state, { type }) => {
      state.activeType = type
    },

    SET_LIST: (state, { type, items }) => {
      state.lists[type] = items
    },

    SET_ITEMS: (state, { items }) => {
      items.forEach(item => {
        if (item) {
          console.log(item)
          Vue.set(state.items, item.id, item)
        }
      })
    },

    SET_USER: (state, { user }) => {
      Vue.set(state.users, user.id, user)
    },

    upVote: (state, { articleId }) => {
      state.items[articleId].score += 1
      state.items[articleId].upvoted = true
      state.items[articleId].downvoted = false
    },

    downVote: (state, { articleId }) => {
      state.items[articleId].score -= 1
      state.items[articleId].upvoted = false
      state.items[articleId].downvoted = true
    }
  },

  getters: {
    activeItems: (state, getters) => (page = 0) => {
      // @TODO if page is larger then send new request
      let prev = page - 1
      let prevOffset = prev * 2
      let pageOffset = page * 2

      return state.lists[state.activeType].slice(prevOffset, pageOffset)
    }
  }
})

export default store
