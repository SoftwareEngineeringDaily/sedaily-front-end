import axios from 'axios'
import {BASE_URL} from './config.js'

export default {
  login: ({commit, state}, { username, password }) => {
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
        // @TODO: Add pretty pop up here
        console.log(error)
        alert(error.response.data.message)
        return error
      })
  },

  register: ({commit, state}, {password, username, bio, website, name, email}) => {
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
      // @TODO: Add pretty pop up here
      console.log(error.response)
      alert(error.response.data.message)
      return error
    })
  },

  sendForgotPasswordEmail: ({commit, state}, { email }) => {
    return axios.post(`${BASE_URL}/users/request-password-reset`,
      {
        email
      })
  }
}
