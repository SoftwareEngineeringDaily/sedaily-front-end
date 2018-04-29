import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  createSubscription: async ({ commit, state, getters, dispatch }, { stripeToken, planType }) => {
    if (!getters.isLoggedIn) {
      throw new Error('You are not signed in.')
    }

    await axios.post(`${BASE_URL}/subscription`, { stripeToken, planType })
    return dispatch('fetchMyProfileData')
  },

  cancelSubscription: async ({ commit, getters, dispatch }) => {
    if (!getters.isLoggedIn) {
      throw new Error('Your are not signed in.')
    }

    await axios.delete(`${BASE_URL}/subscription`)
    return dispatch('fetchMyProfileData')
  }
}