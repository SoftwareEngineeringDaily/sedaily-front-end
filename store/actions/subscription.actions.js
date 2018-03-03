import { apiConfig } from '~/config'

const BASE_URL = apiConfig.BASE_URL

export default {
  createSubscription ({ commit, state, getters }, { stripeToken, planType }) {
    if (!getters.isLoggedIn) {
      throw new Error('Your are not signed in.')
    }

    return this.$axios.post(`${BASE_URL}/subscription`, { stripeToken, planType })
  },

  cancelSubscription ({ commit, getters }) {
    if (!getters.isLoggedIn) {
      throw new Error('Your are not signed in.')
    }

    return this.$axios.delete(`${BASE_URL}/subscription`)
  }
}
