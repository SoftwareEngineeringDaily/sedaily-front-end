import { getS3SingedUploadUrlAndUpload } from '~/utils/uploadImage.utils'
import { apiConfig } from '~/config'

const BASE_URL = apiConfig.BASE_URL

export default {
  companiesCreate ({ commit, getters }, company) {
    const url = `${BASE_URL}/companies`
    console.log('company', company)
    return this.$axios.post(url, company, config)
  },

  companiesEdit ({ commit, getters }, company) {
    const url = `${BASE_URL}/companies/${company._id}`
    console.log('company', company)
    return this.$axios.put(url, company, config)
  },

  companiesUploadImage ({ commit, state, getters }, { imageFile }) {
    const endpointUrl = `${BASE_URL}/companies/upload-image`
    return getS3SingedUploadUrlAndUpload({ imageFile, endpointUrl })
  },

  companiesFetchById ({ getters, commit }, id) {
    const url = `${BASE_URL}/companies/${id}`
    return this.$axios.get(url, options)
      .then((response) => {
        const company = response.data
        // commit('setCompanies', { companies })
        return company
      })
  },

  companiesFetchByLocalUrl ({ getters, commit }, localUrl) {
    const url = `${BASE_URL}/companies/findByLocalUrl/${localUrl}`
    return this.$axios.get(url, options)
      .then((response) => {
        const companies = response.data
        //  set company... by local url
        // commit('setCompanies', { companies })
        return companies
      })
  },

  companiesFetch ({ getters, commit }) {
    const url = `${BASE_URL}/companies`
    return this.$axios.get(url, options)
      .then((response) => {
        const companies = response.data
        commit('setCompanies', { companies })
        return companies
      })
  },

  deleteCompany: ({ commit, state, getters }, companyId) => {
    return this.$axios.delete(`${BASE_URL}/companies/${companyId}`, config)
  }

}
