export default {

  register ({ commit, state }, { password, username, bio, website, name, email }) {
    return this.$axios.post('/auth/register', {
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
        return error
      })
  },

  sendForgotPasswordEmail ({ commit, state }, { email }) {
    return this.$axios.post('users/request-password-reset',
      {
        email
      })
  },

  regainAccount ({ commit, state }, { newPassword, resetUID, secretKey }) {
    return this.$axios.post('/users/regain-password',
      {
        newPassword,
        resetUID,
        secretKey
      })
  }
}
