import Vue from 'vue'
import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  createTopic: ({ commit, state, getters }) => {
    return axios.post(`${BASE_URL}/api/topics`)
      // .then((response) => {
      //   commit('topics', response.data)
      //   return response
      // })
  },
  getTopics: ({ commit, state, getters }) => {
    return axios.get(`${BASE_URL}/api/topics`)
    .then((response) => {
      commit('setTopics', response.data)
      return response
    })
  },
  // addTopicToUser: ({ commit, state, getters }) => {
  //   const userId = this.state.user.userId
  //   return axios.post(`${BASE_URL}/api/topics/addTopicToUser`)
  // },
  // deleteTopics: ({ commit, state, getters }) => {
  //   const userId = this.state.user.userId
  //   return axios.del(`${BASE_URL}/api/topics?user_id=${userId}`)
  // },
  // showTopic: ({ commit, state, getters }) => {
  //   const userId = this.state.user.userId
  //   return axios.get(`${BASE_URL}/api/topics?user_id=${userId}`)
  // },
}
