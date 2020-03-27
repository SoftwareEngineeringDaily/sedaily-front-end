import Vue from 'vue'
import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  createTopic: ({ commit, state, getters }, { data }) => {
    const createTopic = data
    return axios.post(`${BASE_URL}/topics`, createTopic)
    .then((response) => {
      return response
    })
  },

  getTopic: (_, { topicId }) => {
    return axios.get(`${BASE_URL}/topic/${topicId}`)
    .then((response) => {
      return response.data
    })
  },

  addTopic: (_, data) => {
    return axios.post(`${BASE_URL}/topic`, data)
    .then((response) => {
      return response.data
    })
  }, 

  updateTopic: (_, { topicId, data }) => {
    return axios.put(`${BASE_URL}/topic/${topicId}`, data)
    .then((response) => {
      return response
    })
  },

  getFullTopics: () => {
    return axios.get(`${BASE_URL}/topic`)
    .then((response) => {
      return response.data
    })
  },

  getUserTopics: ({ commit, state, getters }) => {
    const userId = state.me._id
    return axios.get(`${BASE_URL}/topics?userId=${userId}`)
    .then((response) => {
      commit('setUserTopics', response.data)
      return response
    })
  },

  getTopTopics: (_, top) => {
    return axios.get(`${BASE_URL}/topics/top/${top}`)
    .then((response) => {
      return response.data
    })
  },

  setMaintainerInterest: (_, data) => {
    return axios.post(`${BASE_URL}/topics/interest`, data)
    .then((response) => {
      return response.data
    })
  },

  getPostTopics: ({ commit, state, getters }, { postId }) => {
    const post_id = postId
     return axios.get(`${BASE_URL}/topics?postId=${post_id}`)
     .then((response) => {
       commit('setPostTopics', response.data)
       return response
     })
  },

  getAllTopics: ({ commit, state, getters }) => {
    return axios.get(`${BASE_URL}/topics`)
    .then((response) => {
      commit('setAllTopics', response.data)
      return response
    })
  },

  getSearchedTopics: ({ commit, state, getters }, search) => {
    return axios.get(`${BASE_URL}/topics/searchTopics?search=${search}`)
    .then((response) => {
      commit('setSearchedAllTopics', response.data)
      return response
    })
  },

  addTopicToUser: ({ commit, state, getters, dispatch }, topics) => {
    const assignTopicsToUser = topics
    return axios.post(`${BASE_URL}/topics/addTopicsToUser`, assignTopicsToUser).then( async response =>
      await dispatch('getUserTopics')
    )
  },

  addTopicsToPost: ({ commit, state, getters }, {topics}) => {
    return axios.post(`${BASE_URL}/topics/addTopicsToPost`,topics)
  },

  deleteTopics: ({ commit, state, getters }) => {
    const user = {
      isAdmin: state.me.isAdmin,
      id: state.me._id
    }
    return axios.del(`${BASE_URL}/topics`,user)
  },

  showTopic: ({ commit, state, getters }, topic_id) => {
    const topicId = topic_id
    return axios.get(`${BASE_URL}/topics/${topicId}`).then((response) => {
      commit('setSearchTopic', response.data)
      return response
    })
  },

  mostPopular: ({ commit, state}) => {
    return axios.get(`${BASE_URL}/topics/mostPopular`).then((response) => {
      commit('setMostPopular', response.data)
      return response
    })
  }
}
