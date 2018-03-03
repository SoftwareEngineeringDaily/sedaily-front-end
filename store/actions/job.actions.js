import { apiConfig } from '~/config'

const BASE_URL = apiConfig.BASE_URL

export default {

  createJob ({ commit, state, getters }, { companyName, applicationEmailAddress, location, title, description, employmentType, remoteWorkingConsidered }) {
    const token = getters.getToken
    const config = {}
    if (!token) {
      return Promise.reject('User not signed in.')
    }

    config.headers = {
      'Authorization': 'Bearer ' + token
    }

    return this.$axios.post(`${BASE_URL}/jobs`, {
      companyName,
      applicationEmailAddress,
      location,
      title,
      description,
      employmentType,
      remoteWorkingConsidered
    }, config)
  },
  updateJob ({ commit, state, getters }, { jobId, companyName, applicationEmailAddress, location, title, description, employmentType, remoteWorkingConsidered }) {
    const token = getters.getToken
    const config = {}
    if (!token) {
      return Promise.reject('User not signed in.')
    }

    config.headers = {
      'Authorization': 'Bearer ' + token
    }

    return this.$.put(`${BASE_URL}/jobs/${jobId}`, {
      companyName,
      applicationEmailAddress,
      location,
      title,
      description,
      employmentType,
      remoteWorkingConsidered
    }, config)
  },
  applyToJob ({ commit, state, getters }, { jobId, coveringLetter, resume }) {
    const token = getters.getToken
    const config = {}
    if (!token) {
      return Promise.reject('User not signed in.')
    }

    config.headers = {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/form-data'
    }
    const formData = new FormData()
    formData.append('resume', resume)
    formData.append('coveringLetter', coveringLetter)

    return this.$axios.post(`${BASE_URL}/jobs/${jobId}/apply`, formData, config)
  },
  fetchJob ({ commit, state, getters }, { jobId }) {
    const token = getters.getToken
    const config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    }
    return this.$axios.get(`${BASE_URL}/jobs/${jobId}`, config)
  },

  jobsSearch ({ commit, state, getters }, { companyName }) {
    let query = '?'
    if (companyName) {
      query += `companyName=${companyName}&`
    }

    return this.$axios.get(`${BASE_URL}/jobs${query}`)
      .then((response) => {
        const jobs = response.data
        commit('setJobs', { jobs })
        return jobs
      })
      .catch((error) => {
        commit('setJobs', { jobs: [] })
        throw error
      })
  },

  fetchJobsList ({ commit, state, getters }) {
    return this.$axios.get(`${BASE_URL}/jobs`)
      .then((response) => {
        commit('setJobs', { jobs: response.data })
        return response
      })
      .catch((error) => {
        commit('setJobs', { jobs: [] })
        throw error
      })
  },
  deleteJob ({ commit, state, getters }, { jobId }) {
    const token = getters.getToken
    const config = {}
    if (!token) {
      return Promise.reject('User not signed in.')
    }

    config.headers = {
      'Authorization': 'Bearer ' + token
    }

    return this.$axios.delete(`${BASE_URL}/jobs/${jobId}`, config)
  }

}
