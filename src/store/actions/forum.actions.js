import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  forumThreadCreate ({ commit, getters }, { content, title }) {
    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'forum',
            eventAction: 'create thread',
            eventLabel: title.substr(0,100),
            eventValue: 1
          }]
        ]
      }
    })

    const options = { content, title }
    const requestUrl = `${BASE_URL}/forum/`
    return axios.post(requestUrl, options)
  },

  forumThreadEdit ({ commit, getters }, { content, title, id }) {
    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'forum',
            eventAction: 'edit thread',
            eventLabel: title.substr(0,100),
            eventValue: 1
          }]
        ]
      }
    })

    const url = `${BASE_URL}/forum/${id}`
    return axios.put(url, {content, title})
  },

  forumThreadDelete: ({ commit, getters, state }, { id }) => {
    if (!getters.isLoggedIn) {
      Vue.toasted.error('Login to delete your post.')
      return
    }

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'forum',
            eventAction: 'delete thread',
            eventLabel: id,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.delete(`${BASE_URL}/forum/${id}`)
  },

  forumThreadLike: ({ commit, getters, state }, { id }) => {
    if (!getters.isLoggedIn) {
      Vue.toasted.error('You must login to vote')
      return
    }

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'forum',
            eventAction: 'like thread',
            eventLabel: id,
            eventValue: 1
          }]
        ]
      }
    })

    // commit('likeComment', { commentId: id, entityId, parentCommentId })
    return axios.post(`${BASE_URL}/forum/${id}/upvote`, {}).then((response) => {
      const forumThread = response.data.entity
      console.log('forumThread', forumThread)
      commit('setForumThread', { entity: forumThread })
      return response
    })
  },

  fetchForumThreads ({ getters, commit }, {lastActivityBefore}) {
    if (!lastActivityBefore) lastActivityBefore = moment().toISOString()
    let requestUrl = `${BASE_URL}/forum?`
    if (lastActivityBefore) requestUrl += `&lastActivityBefore=${lastActivityBefore}`
    console.log('requestUrl', requestUrl)
    return axios.get(requestUrl)
      .then((response) => {
        const forumThreads = response.data
        commit('setForumThreads', { list: forumThreads })
        return forumThreads
      })
  },

  fetchForumThread: ({ commit, state, getters }, { id }) => {
    return axios.get(`${BASE_URL}/forum/${id}`)
      .then((response) => {
        const forumThread = response.data
        commit('setForumThread', { entity: forumThread })
        return { forumThread }
      })
      .catch((error) => {
      // @TODO: Add pretty pop up here
        console.log(error.response)
        Vue.toasted.error(error.response.data.message)
      })
  }

}
