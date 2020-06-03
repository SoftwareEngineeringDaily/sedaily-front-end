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
        Vue.toasted.error(error.response.data.message, {
          singleton: true,
          theme: "bubble",
          position: "bottom-center",
          duration : 700
      })

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

  twitterRequest: ({ commit, state }) => {
    const analyticsEvent = {
      eventCategory: 'auth',
      eventAction: 'twitter-request',
      eventValue: 1
    }

    const callback = `${window.location.origin}/callback/twitter`

    commit('analytics', {
      meta : { analytics: [ [ 'event', analyticsEvent ] ] }
    })

    return axios.post(`${BASE_URL}/auth/twitter-request`, { callback })
      .then(({ data }) => {
        return window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${data.oauth_token}`
      })
      .catch((error) => {
        // @TODO: Add pretty pop up here
        console.log(error)
        Vue.toasted.error(error.response.data.message, {
          singleton: true,
          theme: "bubble",
          position: "bottom-center",
          duration : 700
        })

        analyticsEvent.eventCategory = 'errors'
        analyticsEvent.eventAction = 'errors twitter request'

        commit('analytics', {
          meta : { analytics: [ [ 'event', analyticsEvent ] ] }
        })

        return Promise.reject(error)
      });
  },

  twitterAccess: ({ commit, state }, { oauth_token, oauth_verifier }) => {
    const analyticsEvent = {
      eventCategory: 'auth',
      eventAction: 'twitter-request',
      eventValue: 1
    }

    const options = {
      oauth_token,
      oauth_verifier,
    }

    commit('analytics', {
      meta : { analytics: [ [ 'event', analyticsEvent ] ] }
    })

    return axios.post(`${BASE_URL}/auth/twitter-access`, options)
      .then(({ data }) => {
        commit('setToken', data.token)
        return data
      })
      .catch((error) => {
        // @TODO: Add pretty pop up here
        Vue.toasted.error(error.response.data.message, {
          singleton: true,
          theme: "bubble",
          position: "bottom-center",
          duration : 700
        })

        analyticsEvent.eventCategory = 'errors'
        analyticsEvent.eventAction = 'errors twitter request'

        commit('analytics', {
          meta : { analytics: [ [ 'event', analyticsEvent ] ] }
        })

        return Promise.reject(error)
      });
  },

  register: ({ commit, dispatch },
    { password, name, lastName, email }) => {


    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'auth',
            eventAction: 'register',
            eventLabel: `${email}`,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.post(`${BASE_URL}/auth/register`, {
      password,
      name,
      lastName,
      email
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
