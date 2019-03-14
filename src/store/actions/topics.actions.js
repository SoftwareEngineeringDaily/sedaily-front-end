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

  getUserTopics: ({ commit, state, getters }) => {
    const userId = state.me._id
    return axios.get(`${BASE_URL}/topics?userId=${userId}`)
    .then((response) => {
      commit('setUserTopics', response.data)
      return response
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

  addTopicToUser: ({ commit, state, getters }, topics) => {
    const assignTopicsToUser = topics
    return axios.post(`${BASE_URL}/topics/addTopicsToUser`, assignTopicsToUser)
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
