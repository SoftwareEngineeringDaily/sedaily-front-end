import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const EVENTS_API_BASE_URL = apiConfig.EVENTS_API_BASE_URL

export default {
  enableLogging: ({ commit, getters, state }) => {
    const token = getters.getToken
    if (!token) {
      alert('Login to enable logging')
      return
    }
    commit('enableLogging')
  },

  disableLogging: ({ commit, getters, state }) => {
    const token = getters.getToken
    if (!token) {
      alert('Login to disable logging')
      return
    }
    commit('disableLogging')
  },

  registerEvent: ({ commit, state }, { username }) => {
    return axios.post(`${EVENTS_API_BASE_URL}`, {
      clientId: username,
      deviceType: 'Browser',
      eventTime: new Date().getTime(),
      eventType: 'register',
      eventData: {}
    })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.log(error.response)
        return error
      })
  }
}
