import axios from 'axios'
import {BASE_URL} from './config.js'

export default {
  login: ({commit, dispatch, state}, { username, password }) => {
    return axios.post(`${BASE_URL}/auth/login`,
      {
        username,
        password
      })
      .then(function (response) {
        commit('setToken', {token: response.data.token})
        return response
      })
      .catch(function (error) {
        console.log(error.response)
        dispatch('showErrorMessage', error.response.data.message)
        return error
      })
  },

  logout: ({ commit }) => {
    commit('setToken', { token: '' })
  },

  register: ({commit, dispatch, state}, {password, username, bio, website, name, email}) => {
    return axios.post(`${BASE_URL}/auth/register`, {
      username,
      bio,
      password,
      website,
      name,
      email
    })
      .then(function (response) {
        commit('setToken', {token: response.data.token})
        return response
      })
      .catch(function (error) {
        console.log(error.response)
        dispatch('showErrorMessage', error.response.data.message)
        return error
      })
  },

  sendForgotPasswordEmail: ({commit, state}, { email }) => {
    return axios.post(`${BASE_URL}/users/request-password-reset`,
      {
        email
      })
  },

  regainAccount: ({commit, state}, { newPassword, resetUID, secretKey }) => {
    return axios.post(`${BASE_URL}/users/regain-password`,
      {
        newPassword,
        resetUID,
        secretKey
      })
  }
}
