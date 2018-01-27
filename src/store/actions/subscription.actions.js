import axios from 'axios'
import { actionVars } from '../../../config/index.js'
const BASE_URL = actionVars.BASE_URL

export default {
  createSubscription: ({ commit, state, getters }, { stripeToken, planType }) => {
    const token = getters.getToken
    const config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    } else {
      throw new Error('Your are not signed in.')
    }

    return axios.post(`${BASE_URL}/subscription`, { stripeToken, planType }, config)
  },

  cancelSubscription: ({ commit, getters }) => {
    const token = getters.getToken
    const config = {}
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
