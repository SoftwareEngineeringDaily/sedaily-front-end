import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
import { getS3SingedUploadUrlAndUpload } from '@/utils/uploadImage.utils'
const BASE_URL = apiConfig.BASE_URL

export default {
  companiesCreate ({ commit, getters }, company) {
    const url = `${BASE_URL}/companies`
    console.log('company', company)
    return axios.post(url, company)
  },

  companiesEdit ({ commit, getters }, company) {
    const url = `${BASE_URL}/companies/${company._id}`
    console.log('company', company)
    return axios.put(url, company)
  },

  companiesUploadImage: ({ commit, state, getters }, { imageFile }) => {
    const endpointUrl = `${BASE_URL}/companies/upload-image`
    return getS3SingedUploadUrlAndUpload({ imageFile, endpointUrl })
  },

  companiesFetchById ({ getters, commit }, id) {
    const url = `${BASE_URL}/companies/${id}`
    return axios.get(url)
      .then((response) => {
        const company = response.data
        // commit('setCompanies', { companies })
        return company
      })
  },

  companiesFetchByLocalUrl ({ getters, commit }, localUrl) {
    const url = `${BASE_URL}/companies/findByLocalUrl/${localUrl}`
    return axios.get(url)
      .then((response) => {
        const companies = response.data
        //  set company... by local url
        // commit('setCompanies', { companies })
        return companies
      })
  },

  companiesFetch ({ getters, commit }) {
    const url = `${BASE_URL}/companies`
    return axios.get(url)
      .then((response) => {
        const companies = response.data
        commit('setCompanies', { companies })
        return companies
      })
  },

  deleteCompany: ({ commit, state, getters }, companyId) => {
    if (!getters.isLoggedIn) {
      return Promise.reject('User not signed in.')
    }

    return axios.delete(`${BASE_URL}/companies/${companyId}`)
  }

}
