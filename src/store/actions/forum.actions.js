import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  fetchThreadList ({ getters, commit }) {
    console.log('featchThreadList')
    const options = {}
    const token = getters.getToken
    if (token) {
      options.headers = {
        'Authorization': 'Bearer ' + token
      }
    }
    return axios.get(`${BASE_URL}/forum`, options).then(response => {
      const threads = response.data
      commit('setThreads', { threads })
      return threads
    })
  },

  fetchThread ({ getters, commit }, { threadId }) {
    const options = {}
    const token = getters.getToken
    if (token) {
      options.headers = {
        'Authorization': 'Bearer ' + token
      }
    }
    return axios.get(`${BASE_URL}/forum/${threadId}`, options).then(response => {
      const thread = response.data
      commit('setThread', { thread }) // eslint-disable-line
      return thread
    }).catch(err => console.log(err))
  },

  fetchThreadComments ({ getters, commit }, { threadId }) {
    const options = {}
    const token = getters.getToken
    if (token) {
      options.headers = {
        'Authorization': 'Bearer ' + token
      }
    }
    return axios.get(`${BASE_URL}/forum/${threadId}/comments`, options).then(response => {
      const comments = response.data.result
      commit('setThreadComments', { comments }) // eslint-disable-line
      return comments
    }).catch(err => console.log(err))
  }
}
