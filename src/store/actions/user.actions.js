import Vue from 'vue'
import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
import { getS3SingedUploadUrlAndUpload } from '@/utils/uploadImage.utils'
const BASE_URL = apiConfig.BASE_URL

export default {

  uploadAvatarImage: ({ commit, state, getters,dispatch }, { imageFile }) => {
    const endpointUrl = `${BASE_URL}/auth/sign-s3`
    return getS3SingedUploadUrlAndUpload({ imageFile, endpointUrl })
  },

  getBookmarks: () => {
    return axios.get(`${BASE_URL}/users/me/bookmarked`)
    .then((response) => {
      return response.data
    })
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

  getUsers: () => {
    return axios.get(`${BASE_URL}/users`)
      .then(({data}) => {
        return data
      })
  },

  updateUser: (_, { userId, fields }) => {
    return axios.put(`${BASE_URL}/users/admin/${userId}`, fields)
      .then(({data}) => {
        return data
      })
  },

  searchUsers: (_, { name }) => {
    return axios.get(`${BASE_URL}/users/search/names?name=${name}`)
      .then(({data}) => {
        return data
      })
  },

  searchUsersComplete: (_, { query }) => {
    return axios.get(`${BASE_URL}/users/search?name=${query}||email=${query}`)
      .then(({data}) => {
        return data
      })
  },

  fetchPublicActivities: (_, { userId }) => {
    return axios.get(`${BASE_URL}/profile/activities/${userId}`)
  },

  fetchPublicProfileData: (_, { userId }) => {
    return axios.get(`${BASE_URL}/profile/${userId}`)
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
        Vue.toasted.error(error.response.data.message, { 
              singleton: true,
              theme: "bubble", 
              position: "bottom-center", 
              duration : 700
          })
        return error
      })
  },

  updateProfile: ({ commit, dispatch }, { id, bio, isAvatarSet, website, name, lastName, twitter }) => {

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
      bio,
      website,
      name,
      lastName,
      twitter,
      isAvatarSet
    })
      .then((response) => {
        return dispatch('fetchMyProfileData')
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
        return error
      })
  }

}
