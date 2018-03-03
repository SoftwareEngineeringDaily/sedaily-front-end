import { apiConfig } from '~/config'

const BASE_URL = apiConfig.BASE_URL

export default {

  register ({ commit, state }, { password, username, bio, website, name, email }) {
    return this.$axios.post(`${BASE_URL}/auth/register`, {
      username,
      bio,
      password,
      website,
      name,
      email
    })
      .then((response) => {
        return this.$auth.login({
          data: {
            username,
            password
          }
        })
      })
      .catch((error) => {
      // @TODO: Add pretty pop up here
        console.log(error.response)
        alert(error.response.data.message)
        return error
      })
  },

  sendForgotPasswordEmail ({ commit, state }, { email }) {
    return this.$axios.post(`${BASE_URL}/users/request-password-reset`,
      {
        email
      })
  },

  regainAccount ({ commit, state }, { newPassword, resetUID, secretKey }) {
    return this.$axios.post(`${BASE_URL}/users/regain-password`,
      {
        newPassword,
        resetUID,
        secretKey
      })
  }
}
