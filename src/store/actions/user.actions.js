
import axios from 'axios'
import {BASE_URL} from './config.js'

export default {
  fetchMyProfileData: ({commit, state, getters}) => {
    let token = getters.getToken
    let config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    }
    return axios.get(`${BASE_URL}/users/me`, config
      )
      .then(function (response) {
        console.log('data', response.data)
        commit('setMe', {me: response.data})
        return response
      })
      .catch(function (error) {
        // @TODO: Add pretty pop up here
        console.log(error)
        alert(error.response.data.message)
        return error
      })
  }
}
