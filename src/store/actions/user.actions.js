import Vue from 'vue'
import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
import { getS3SingedUploadUrlAndUpload } from '../../utils/uploadImage.utils'
const BASE_URL = apiConfig.BASE_URL

export default {

  uploadAvatarImage: ({ commit, state, getters }, { imageFile }) => {
    const endpointUrl = `${BASE_URL}/auth/sign-s3`
    return getS3SingedUploadUrlAndUpload({ imageFile, endpointUrl })
  },

  fetchMyProfileData: ({ commit, state, getters, dispatch }) => {
    if (!getters.isLoggedIn) {
      return Promise.reject('User not signed in.')
    }

    return axios.get(`${BASE_URL}/users/me`)
      .then((response) => {
        commit('setMe', response.data)
        dispatch('getUserTopics')
        return response
      })
  },

  searchUsers: ({ commit, state, getters }, { name }) => {
    return axios.get(`${BASE_URL}/users/search?name=${name}`)
      .then(({data}) => {
        return data
      })
  },

  fetchPublicProfileData: ({ commit, state, getters }, { userId }) => {
    return axios.get(`${BASE_URL}/users/${userId}`)
  },

  updateEmailNotiicationSettings: ({ commit, dispatch }, { emailNotificationSettings }) => {

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'email-notifications',
            eventAction: 'updateEmailNoticationSettings',
            eventLabel: JSON.stringify(emailNotificationSettings),
            eventValue: 1
          }]
        ]
      }
    })

    return axios.put(`${BASE_URL}/users/update-email-notiication-settings`, emailNotificationSettings)
      .then((response) => {
        return dispatch('fetchMyProfileData')
      })
      .catch((error) => {
        // @TODO: Add pretty pop up here
        console.log(error)
        Vue.toasted.error(error.response.data.message)
        return error
      })
  },

  updateProfile: ({ commit, dispatch }, { id, username, bio, isAvatarSet, website, name, email }) => {

    commit('analytics', {
      meta : {
        analytics: [
          ['event', {
            eventCategory: 'user',
            eventAction: 'updateProfile',
            eventLabel: `id: ${id}`,
            eventValue: 1
          }]
        ]
      }
    })

    return axios.put(`${BASE_URL}/users/${id}`, {
      username,
      bio,
      website,
      name,
      isAvatarSet,
      email
    })
      .then((response) => {
        return dispatch('fetchMyProfileData')
      })
      .catch((error) => {
        // @TODO: Add pretty pop up here
        console.log(error)
        Vue.toasted.error(error.response.data.message)
        return error
      })
  }

}
