import { getS3SingedUploadUrlAndUpload } from '../../utils/uploadImage.utils'

export default {

  uploadAvatarImage ({ commit, state, getters }, { imageFile }) {
    const endpointUrl = '/auth/sign-s3'
    return getS3SingedUploadUrlAndUpload({ axios: this.$axios, imageFile, endpointUrl })
  },

  fetchPublicProfileData ({ commit, state, getters }, { userId }) {
    return this.$axios.get(`/users/${userId}`)
  },

  updateProfile ({ commit, state, getters }, { id, username, bio, isAvatarSet, website, name, email }) {
    return this.$axios.put(`/users/${id}`, {
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
        return error
      })
  }

}
