import axios from 'axios'
import {BASE_URL} from './config.js'

export default {
  createSubscription: ({commit, state, getters}, { stripeToken }) => {
    let token = getters.getToken
    let config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    console.log('token id', stripeToken)
    return axios.post(`${BASE_URL}/subscription`, {stripeToken}, config)
  }
}
