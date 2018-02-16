import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  companiesFetch ({ getters, commit }) {
    const options = {}
    const token = getters.getToken
    if (token) {
      options.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    const url = `${BASE_URL}/companies`
    return axios.get(url, options)
      .then((response) => {
        const companies = response.data
        commit('setCompanies', { companies })
        return companies
      })
  }
}
