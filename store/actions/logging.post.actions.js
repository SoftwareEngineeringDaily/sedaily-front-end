export default {
  enableLogging ({ commit, getters, state }) {
    if (!getters.isLoggedIn) {
      this.$toast.error('Login to enable logging')
      return
    }
    commit('enableLogging')
  },

  disableLogging ({ commit, getters, state }) {
    if (!getters.isLoggedIn) {
      this.$toast.error('Login to disable logging')
      return
    }
    commit('disableLogging')
  },

  registerEvent ({ commit, state }, { username }) {
    return this.$axios.post(process.env.eventsApiBaseUrl, {
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
