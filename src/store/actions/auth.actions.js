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

  register: ({commit, state}, { email, password }) => {
    return axios.post(`${BASE_URL}/auth/register`, { username: email, password })
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
  }
}
