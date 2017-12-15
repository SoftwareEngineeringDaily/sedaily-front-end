import axios from 'axios'
import {BASE_URL} from './config.js'

export default {
  createSubscription: ({commit, state, getters}, { stripeToken, planType }) => {
    let token = getters.getToken
    let config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    } else {
      throw new Error('Your are not signed in.')
    }

    return axios.post(`${BASE_URL}/subscription`, {stripeToken, planType}, config)
  },

  cancelSubscription: ({commit, getters}) => {
    let token = getters.getToken
    let config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    } else {
      throw new Error('Your are not signed in.')
    }

    return axios.delete(`${BASE_URL}/subscription`, config)
  }
}
