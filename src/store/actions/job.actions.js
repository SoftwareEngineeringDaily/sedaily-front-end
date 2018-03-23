import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {

  createJob: ({ commit, state, getters }, { companyName, applicationEmailAddress, location, title, description, employmentType, remoteWorkingConsidered }) => {
    if (!getters.isLoggedIn) {
      return Promise.reject('User not signed in.')
    }

    return axios.post(`${BASE_URL}/jobs`, {
      companyName,
      applicationEmailAddress,
      location,
      title,
      description,
      employmentType,
      remoteWorkingConsidered
    })
  },
  updateJob: ({ commit, state, getters }, { jobId, companyName, applicationEmailAddress, location, title, description, employmentType, remoteWorkingConsidered }) => {
    if (!getters.isLoggedIn) {
      return Promise.reject('User not signed in.')
    }

    return axios.put(`${BASE_URL}/jobs/${jobId}`, {
      companyName,
      applicationEmailAddress,
      location,
      title,
      description,
      employmentType,
      remoteWorkingConsidered
    })
  },
  applyToJob: ({ commit, state, getters }, { jobId, coveringLetter, resume }) => {
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

    return axios.post(`${BASE_URL}/jobs/${jobId}/apply`, formData, config)
  },
  fetchJob: ({ commit, state, getters }, { jobId }) => {
    return axios.get(`${BASE_URL}/jobs/${jobId}`)
  },

  jobsSearch: ({ commit, state, getters }, { companyName }) => {
    let query = '?'
    if (companyName) {
      query += `companyName=${companyName}&`
    }

    return axios.get(`${BASE_URL}/jobs${query}`)
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

  fetchJobsList: ({ commit, state, getters }) => {
    return axios.get(`${BASE_URL}/jobs`)
      .then((response) => {
        commit('setJobs', { jobs: response.data })
        return response
      })
      .catch((error) => {
        commit('setJobs', { jobs: [] })
        throw error
      })
  },
  deleteJob: ({ commit, state, getters }, { jobId }) => {
    if (!getters.isLoggedIn) {
      return Promise.reject('User not signed in.')
    }

    return axios.delete(`${BASE_URL}/jobs/${jobId}`)
  }

}
