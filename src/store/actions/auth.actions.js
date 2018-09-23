import Vue from 'vue'
import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  login: ({ commit, state }, { username, password }) => {

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'auth',
            eventAction: 'login',
            eventLabel: `${username}`,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.post(`${BASE_URL}/auth/login`,
      {
        username,
        password
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        // @TODO: Add pretty pop up here
        console.log(error)
        Vue.toasted.error(error.response.data.message)

        commit('analytics', {
          meta : {
            analytics: [
              ['event', {
                eventCategory: 'errors',
                eventAction: 'error login in',
                eventLabel: `${username}`,
                eventValue: 1
              }]
            ]
          }
        })

        return Promise.reject(error)
      })
  },

  register: ({ commit, state, dispatch },
    { password, username, bio, website, name, email, newsletter }) => {


    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'auth',
            eventAction: 'register',
            eventLabel: `${username}`,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.post(`${BASE_URL}/auth/register`, {
      username,
      bio,
      password,
      website,
      name,
      email,
      newsletter
    })
      .then((response) => {
        commit('setToken', response.data.token)
        dispatch('fetchMyProfileData')
        return response
      })
      .catch((error) => {
      // @TODO: Add pretty pop up here
        console.log(error.response)
        Vue.toasted.error(error.response.data.message)

        commit('analytics', {
          meta : {
            analytics: [
              ['event', {
                eventCategory: 'errors',
                eventAction: 'register error',
                eventLabel: `${email}`,
                eventValue: 1
              }]
            ]
          }
        })
        return error
      })
  },

  sendForgotPasswordEmail: ({ commit, state }, { email }) => {
    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'auth',
            eventAction: 'sendForgotPasswordEmail',
            eventLabel: `${email}`,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.post(`${BASE_URL}/users/request-password-reset`,
      {
        email
      })
  },

  regainAccount: ({ commit, state }, { newPassword, resetUID, secretKey }) => {
    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'auth',
            eventAction: 'regainAccount',
            eventLabel: `resetUID ${resetUID}`,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.post(`${BASE_URL}/users/regain-password`,
      {
        newPassword,
        resetUID,
        secretKey
      })
  },
  verifyRecaptcha: ({ commit, state }, { recaptchaResponse }) => {
    return axios.post(`${BASE_URL}/auth/recaptcha`,
      {
        recaptchaResponse
      })
  }
}
