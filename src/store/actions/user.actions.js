
import axios from 'axios'
import { BASE_URL } from './config.js'

const uploadFile = (file, signedRequest, url) => {
  const p = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', signedRequest)
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('Success!!! url', url)
          resolve({ imageUrl: url })
        } else {
          reject('Could not upload file.')
        }
      }
    }
    xhr.send(file)
  })
  return p
}

export default {
  getS3SingedUploadUrl: ({ commit, state, getters }, { fileName, fileType }) => {
  },

  uploadAvatarImage: ({ commit, state, getters }, { imageFile }) => {
    const token = getters.getToken
    const config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    const fileType = imageFile.type
    return axios.post(`${BASE_URL}/auth/sign-s3`, { fileType }, config)
      .then((result) => {
        const { signedRequest, url } = result.data
        console.log('signedRequest', signedRequest)
        // return axios.put(signedRequest, imageFile, options)
        return uploadFile(imageFile, signedRequest, url)
      })
  },

  fetchMyProfileData: ({ commit, state, getters }) => {
    const token = getters.getToken
    const config = {}
    if (!token) {
      return Promise.reject('User not signed in.')
    }

    config.headers = {
      'Authorization': 'Bearer ' + token
    }

    return axios.get(`${BASE_URL}/users/me`, config)
      .then((response) => {
        commit('setMe', { me: response.data })
        return response
      })
      .catch((error) => {
        // @TODO: Add pretty pop up here
        console.log(error)
        alert(error.response.data.message)
        return error
      })
  },

  updateProfile: ({ commit, state, getters }, { id, username, bio, isAvatarSet, website, name, email }) => {
    const token = getters.getToken
    const config = {}
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
      .then((response) => {
        commit('setMe', { me: response.data })
        return response
      })
      .catch((error) => {
        // @TODO: Add pretty pop up here
        console.log(error)
        alert(error.response.data.message)
        return error
      })
  }

}
