import { getS3SingedUploadUrlAndUpload } from '../../utils/uploadImage.utils'
import { apiConfig } from '~/config'

const BASE_URL = apiConfig.BASE_URL

export default {

  uploadAvatarImage ({ commit, state, getters }, { imageFile }) {
    const token = getters.getToken
    const endpointUrl = `${BASE_URL}/auth/sign-s3`
    return getS3SingedUploadUrlAndUpload({ token, imageFile, endpointUrl })
  },

  fetchPublicProfileData ({ commit, state, getters }, { userId }) {
    return this.$axios.get(`${BASE_URL}/users/${userId}`)
  },

  updateProfile ({ commit, state, getters }, { id, username, bio, isAvatarSet, website, name, email }) {
    const token = getters.getToken
    const config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    return this.$axios.put(`${BASE_URL}/users/${id}`, {
      username,
      bio,
      website,
      name,
      isAvatarSet,
      email
    }, config)
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
