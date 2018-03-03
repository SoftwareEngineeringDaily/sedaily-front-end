import { getS3SingedUploadUrlAndUpload } from '../../utils/uploadImage.utils'
import { apiConfig } from '~/config'

const BASE_URL = apiConfig.BASE_URL

export default {

  uploadAvatarImage ({ commit, state, getters }, { imageFile }) {
    const endpointUrl = `${BASE_URL}/auth/sign-s3`
    return getS3SingedUploadUrlAndUpload({ axios: this.$axios, imageFile, endpointUrl })
  },

  fetchPublicProfileData ({ commit, state, getters }, { userId }) {
    return this.$axios.get(`${BASE_URL}/users/${userId}`)
  },

  updateProfile ({ commit, state, getters }, { id, username, bio, isAvatarSet, website, name, email }) {
    return this.$axios.put(`${BASE_URL}/users/${id}`, {
      username,
      bio,
      website,
      name,
      isAvatarSet,
      email
    })
      .then((response) => {
        this.$auth.fetchUser()
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
