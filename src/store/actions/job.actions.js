
import axios from 'axios'
import { BASE_URL } from './config.js'

export default {

  createJob: ({ commit, state, getters }, { companyName, applicationEmailAddress, location, title, description, employmentType, remoteWorkingConsidered }) => {
    const token = getters.getToken
    const config = {}
    if (!token) {
      return Promise.reject('User not signed in.')
    }

    config.headers = {
      'Authorization': 'Bearer ' + token
    }

    return axios.post(`${BASE_URL}/jobs`, {
      companyName,
      applicationEmailAddress,
      location,
      title,
      description,
      employmentType,
      remoteWorkingConsidered
    }, config)
  },
  updateJob: ({ commit, state, getters }, { jobId, companyName, applicationEmailAddress, location, title, description, employmentType, remoteWorkingConsidered }) => {
    const token = getters.getToken
    const config = {}
    if (!token) {
      return Promise.reject('User not signed in.')
    }

    config.headers = {
      'Authorization': 'Bearer ' + token
    }

    return axios.put(`${BASE_URL}/jobs/${jobId}`, {
      companyName,
      applicationEmailAddress,
      location,
      title,
      description,
      employmentType,
      remoteWorkingConsidered
    }, config)
  },
  fetchJob: ({ commit, state, getters }, { jobId }) => {
    const token = getters.getToken
    const config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    }
    return axios.get(`${BASE_URL}/jobs/${jobId}`, config)
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
    const token = getters.getToken
    const config = {}
    if (!token) {
      return Promise.reject('User not signed in.')
    }

    config.headers = {
      'Authorization': 'Bearer ' + token
    }

    return axios.delete(`${BASE_URL}/jobs/${jobId}`, config)
  }

}
