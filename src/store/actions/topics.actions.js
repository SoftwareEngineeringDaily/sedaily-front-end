import Vue from 'vue'
import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  createTopic: ({ commit, state, getters }, { topic }) => {
    const createTopics = topic
    return axios.post(`${BASE_URL}/topics`, createTopic)
  },
  getUserTopics: ({ commit, state, getters }) => {
    const userId = state.me._id
    return axios.get(`${BASE_URL}/topics?userId=${userId}`)
    .then((response) => {
      commit('setUserTopics', response.data)
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
  addTopicToUser: ({ commit, state, getters }, topics) => {
    const assignTopicsToUser = topics
    return axios.post(`${BASE_URL}/topics/addTopicsToUser`, assignTopicsToUser)
  },
  deleteTopics: ({ commit, state, getters }) => {
    const userId = state.me._id
    return axios.del(`${BASE_URL}/api/topics?userId=${userId}`)
  },
  showTopic: ({ commit, state, getters }, topic_id) => {
    const topicId = topic_id
    return axios.get(`${BASE_URL}/topics/${topicId}`)
  },
}
