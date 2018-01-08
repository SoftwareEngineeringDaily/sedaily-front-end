
import axios from 'axios'
import {BASE_URL} from './config.js'

export default {
  getS3SingedUploadUrl: ({commit, state, getters}, {fileName, fileType}) => {
  },

  uploadAvatarImage: ({commit, state, getters}, { imageFile }) => {
    let token = getters.getToken
    let config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    const fileType = imageFile.type
    return axios.post(`${BASE_URL}/auth/sign-s3`, {fileType}, config)
      .then((result) => {
        const {signedRequest} = result.data
        console.log('signedRequest', signedRequest)
        var options = {
          headers: {
            'Content-Type': fileType
          }
        }
        return axios.put(signedRequest, imageFile, options)
      })
  },

  fetchMyProfileData: ({commit, state, getters}) => {
    let token = getters.getToken
    let config = {}
    if (!token) {
      throw new Error('User not signed in.')
    }
    config.headers = {
      'Authorization': 'Bearer ' + token
    }
    return axios.get(`${BASE_URL}/users/me`, config
    )
      .then(function (response) {
        commit('setMe', {me: response.data})
        return response
      })
      .catch(function (error) {
      // @TODO: Add pretty pop up here
        console.log(error)
        alert(error.response.data.message)
        return error
      })
  },

  updateProfile: ({commit, state, getters}, {id, username, bio, isAvatarSet, website, name, email}) => {
    let token = getters.getToken
    let config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    return axios.put(`${BASE_URL}/users/${id}`, {
      username,
      bio,
      website,
      name,
      isAvatarSet,
      email
    }, config)
      .then(function (response) {
        commit('setMe', {me: response.data})
        return response
      })
      .catch(function (error) {
        // @TODO: Add pretty pop up here
        console.log(error)
        alert(error.response.data.message)
        return error
      })
  }

}
