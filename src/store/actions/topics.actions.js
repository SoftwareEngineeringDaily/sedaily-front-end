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
    return axios.get(`${BASE_URL}/topics?user_id=${userId}`)
    .then((response) => {
      commit('setUserTopics', response.data)
      return response
    })
  },
  getAllTopics: ({ commit, state, getters }) => {
    const userId = state.me._id
    return axios.get(`${BASE_URL}/topics`)
    .then((response) => {
      commit('setAllTopics', response.data)
      return response
    })
  },
  addTopicToUser: ({ commit, state, getters }) => {
    return axios.post(`${BASE_URL}/api/topics/addTopicToUser`)
  },
  deleteTopics: ({ commit, state, getters }) => {
    const userId = state.me._id
    return axios.del(`${BASE_URL}/api/topics?user_id=${userId}`)
  },
  showTopic: ({ commit, state, getters }) => {
    const userId = state.me._id
    return axios.get(`${BASE_URL}/api/topics?user_id=${userId}`)
  },
}
