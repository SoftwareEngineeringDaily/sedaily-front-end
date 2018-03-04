import { getS3SingedUploadUrlAndUpload } from '~/utils/uploadImage.utils'

export default {
  companiesCreate ({ commit, getters }, company) {
    const url = '/companies'
    console.log('company', company)
    return this.$axios.post(url, company, config)
  },

  companiesEdit ({ commit, getters }, company) {
    const url = `/companies/${company._id}`
    console.log('company', company)
    return this.$axios.put(url, company, config)
  },

  companiesUploadImage ({ commit, state, getters }, { imageFile }) {
    const endpointUrl = '/companies/upload-image'
    return getS3SingedUploadUrlAndUpload({ imageFile, endpointUrl })
  },

  companiesFetchById ({ getters, commit }, id) {
    const url = `/companies/${id}`
    return this.$axios.get(url, options)
      .then((response) => {
        const company = response.data
        // commit('setCompanies', { companies })
        return company
      })
  },

  companiesFetchByLocalUrl ({ getters, commit }, localUrl) {
    const url = `/companies/findByLocalUrl/${localUrl}`
    return this.$axios.get(url, options)
      .then((response) => {
        const companies = response.data
        //  set company... by local url
        // commit('setCompanies', { companies })
        return companies
      })
  },

  companiesFetch ({ getters, commit }) {
    const url = '/companies'
    return this.$axios.get(url, options)
      .then((response) => {
        const companies = response.data
        commit('setCompanies', { companies })
        return companies
      })
  },

  deleteCompany: ({ commit, state, getters }, companyId) => {
    return this.$axios.delete(`/companies/${companyId}`, config)
  }

}
