import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  createSubscription: async ({ commit, state, getters, dispatch }, { stripeToken, planType }) => {
    if (!getters.isLoggedIn) {
      commit('analytics', {
        meta : {
          analytics: [
            ['event', {
              eventCategory: 'errors',
              eventAction: 'createSubscription',
              eventLabel: 'not signed in',
              eventValue: 1
            }]
          ]
        }
      })
      throw new Error('You are not signed in.')
    }

    await axios.post(`${BASE_URL}/subscription`, { stripeToken, planType })

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'subscriptions',
            eventAction: 'createSubscription',
            eventLabel: `planType: ${planType}`,
            eventValue: 1
          }]
        ]
      }
    })


    return dispatch('fetchMyProfileData')
  },

  cancelSubscription: async ({ commit, getters, dispatch }) => {
    if (!getters.isLoggedIn) {
      commit('analytics', {
        meta : {
          analytics: [
            ['event', {
              eventCategory: 'errors',
              eventAction: 'cancelSubscription',
              eventLabel: 'not signed in',
              eventValue: 1
            }]
          ]
        }
      })
      throw new Error('Your are not signed in.')
    }

    await axios.delete(`${BASE_URL}/subscription`)

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'subscriptions',
            eventAction: 'cancelSubscription',
            eventLabel: `--`,
            eventValue: 1
          }]
        ]
      }
    })

    return dispatch('fetchMyProfileData')
  }
}
