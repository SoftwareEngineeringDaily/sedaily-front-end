import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  companiesCreate ({ commit, getters }, company) {
    const token = getters.getToken
    const config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    const url = `${BASE_URL}/companies`
    console.log('company', company)
    return axios.post(url, company, config)
  },

  companiesEdit ({ commit, getters }, company) {
    const token = getters.getToken
    const config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    const url = `${BASE_URL}/companies/${company._id}`
    console.log('company', company)
    return axios.put(url, company, config)
  },
  companiesFetchById ({ getters, commit }, id) {
    const options = {}
    const token = getters.getToken
    if (token) {
      options.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    const url = `${BASE_URL}/companies/${id}`
    return axios.get(url, options)
      .then((response) => {
        const company = response.data
        // commit('setCompanies', { companies })
        return company
      })
  },

  companiesFetchByLocalUrl ({ getters, commit }, localUrl) {
    const options = {}
    const token = getters.getToken
    if (token) {
      options.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    const url = `${BASE_URL}/companies/findByLocalUrl/${localUrl}`
    return axios.get(url, options)
      .then((response) => {
        const companies = response.data
        //  set company... by local url
        // commit('setCompanies', { companies })
        return companies
      })
  },

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
  },

  deleteCompany: ({ commit, state, getters }, companyId) => {
    const token = getters.getToken
    const config = {}
    if (!token) {
      return Promise.reject('User not signed in.')
    }

    config.headers = {
      'Authorization': 'Bearer ' + token
    }

    return axios.delete(`${BASE_URL}/companies/${companyId}`, config)
  }

}
