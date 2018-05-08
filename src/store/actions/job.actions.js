import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {

  createJob: ({ commit, state, getters }, { companyName, applicationEmailAddress, location, title, description, employmentType, remoteWorkingConsidered }) => {
    if (!getters.isLoggedIn) {

      commit('analytics', {
        meta : {
          analytics: [
            ['event', {
              eventCategory: 'errors',
              eventAction: 'error, ',
              eventLabel: `not signed in - creating company ${companyName}`,
              eventValue: 1
            }]
          ]
        }
      })

      return Promise.reject('User not signed in.')
    }

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'jobs',
            eventAction: `create job`,
            eventLabel: `${companyName}`,
            eventValue: 1
          }]
        ]
      }
    })

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
      commit('analytics', {
        meta : {
          analytics: [
            ['event', {
              eventCategory: 'errors',
              eventAction: `update job - not signed in, ${companyName}`,
              eventLabel: `jobId: ${jobId}`,
              eventValue: 1
            }]
          ]
        }
      })

      return Promise.reject('User not signed in.')
    }


      commit('analytics', {
        meta : {
          analytics: [
            ['event', {
              eventCategory: 'jobs',
              eventAction: `update job ${companyName}`,
              eventLabel: `jobId: ${jobId}`,
              eventValue: 1
            }]
          ]
        }
      })

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
      commit('analytics', {
        meta : {
          analytics: [
            ['event', {
              eventCategory: 'errors',
              eventAction: `applyToJob`,
              eventLabel: ` jobId: ${jobId}`,
              eventValue: 1
            }]
          ]
        }
      })

      return Promise.reject('User not signed in.')
    }

    config.headers = {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/form-data'
    }
    const formData = new FormData()
    formData.append('resume', resume)
    formData.append('coveringLetter', coveringLetter)


    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'jobs',
            eventAction: `applyToJob`,
            eventLabel: `jobId: ${jobId}`,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.post(`${BASE_URL}/jobs/${jobId}/apply`, formData, config)
  },

  fetchJob: ({ commit, state, getters }, { jobId }) => {
    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'jobs',
            eventAction: `fetchJob`,
            eventLabel: `jobId: ${jobId}`,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.get(`${BASE_URL}/jobs/${jobId}`)
  },

  jobsSearch: ({ commit, state, getters }, { companyName }) => {
    let query = '?'
    if (companyName) {
      query += `companyName=${companyName}&`
    }

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'jobs',
            eventAction: `jobsSearch`,
            eventLabel: `query: ${query}`,
            eventValue: 1
          }]
        ]
      }
    })

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
    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'jobs',
            eventAction: `fetchJobsList`,
            eventLabel: `jobs list`,
            eventValue: 1
          }]
        ]
      }
    })

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

      commit('analytics', {
        meta : {
          analytics: [
            ['event', {
              eventCategory: 'errors',
              eventAction: `deleteJob`,
              eventLabel: `jobId: ${jobId}`,
              eventValue: 1
            }]
          ]
        }
      })

      return Promise.reject('User not signed in.')
    }

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'jobs',
            eventAction: `Delete job`,
            eventLabel: `jobId ${jobId}`,
            eventValue: 1
          }]
        ]
      }
    })
    return axios.delete(`${BASE_URL}/jobs/${jobId}`)
  }

}
