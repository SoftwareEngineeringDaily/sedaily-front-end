
import axios from 'axios'
import {BASE_URL} from './config.js'

export default {
  getMyProfileData: ({commit, state}, { }) => {
    let token = getters.getToken
    let config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    }
    return axios.get(`${BASE_URL}/users/me`, {}, config
      )
      .then(function (response) {
        commit('setMe', {token: response.data.token})
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
