import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  createSubscription: ({ commit, state, getters }, { stripeToken, planType }) => {
    if (!getters.isLoggedIn) {
      throw new Error('You are not signed in.')
    }

    return axios.post(`${BASE_URL}/subscription`, { stripeToken, planType })
  },

  cancelSubscription: ({ commit, getters }) => {
    if (!getters.isLoggedIn) {
      throw new Error('Your are not signed in.')
    }

    return axios.delete(`${BASE_URL}/subscription`)
  }
}
