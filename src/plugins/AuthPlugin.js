import axios from 'axios'

import store from '../store'
import router from '../router'

export default {
  install (Vue, options) {
    axios.interceptors.request.use((config) => {
      const token = this.getToken()
      const hasAuthHeader = config.headers.Authorization

      if (token && !hasAuthHeader) {
        this.setAuthHeader(config, token)
      }

      return config
    })

    axios.interceptors.response.use(response => response, err => {
      if (err.response && err.response.status & err.response.status === 401) {
        this.logout()
        router.replace('login')
      }

      return Promise.reject(err)
    })

    Vue.prototype.$auth = Vue.auth = this
  },

  login (credentials) {
    return store
      .dispatch('login', credentials)
      .then(response => {
        this.storeToken(response)
        store.dispatch('fetchMyProfileData')

        return response
      })
  },

  logout () {
    this.clearToken()
    store.commit('setMe', null)
  },

  setAuthHeader (config, token) {
    config.headers.Authorization = `Bearer ${token}`
  },

  storeToken (response) {
    store.commit('setToken', response.data.token)
  },

  clearToken () {
    store.commit('setToken', '')
  },

  getToken () {
    return store.state.token
  }
}
