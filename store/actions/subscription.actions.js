export default {
  createSubscription ({ commit, state, getters }, { stripeToken, planType }) {
    if (!getters.isLoggedIn) {
      throw new Error('Your are not signed in.')
    }

    return this.$axios.post('/subscription', { stripeToken, planType })
  },

  cancelSubscription ({ commit, getters }) {
    if (!getters.isLoggedIn) {
      throw new Error('Your are not signed in.')
    }

    return this.$axios.delete('/subscription')
  }
}
