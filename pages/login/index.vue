<template>
  <div class="login-view container">
    <div class="row">
      <form
        class="col-md-6 offset-md-3">
        <h1>Login</h1>

        <div class="form-group">
          <label for="usernameInput">Username or Email</label>
          <input
            v-validate="'required'"
            id="usernameInput"
            v-model="username"
            type="text"
            name="username"
            class="form-control"
            aria-describedby="usernameHelp"
            placeholder="Enter a username or email">

          <div
            v-show="errors.has('username')"
            class="alert alert-danger">
            {{ errors.first('username') }}</div>
        </div>

        <div class="form-group">
          <label for="inputPassword">Password</label>
          <input
            v-validate="'required'"
            id="inputPassword"
            v-model="password"
            name="password"
            type="password"
            class="form-control"
            placeholder="Password">

          <div
            v-show="errors.has('password')"
            class="alert alert-danger">
            {{ errors.first('password') }}</div>
        </div>

        <button
          :disabled="loading"
          name="submit-button"
          class="button-submit"
          @click.prevent="login">Login</button>

        <div class="col-med-12">
          <br>
          <nuxt-link
            to="/forgot-password"
            name="forgot-password">Forgot Password?</nuxt-link>
        </div>
      </form>
    </div>

    <spinner :show="loading" />
  </div>
</template>

<script>
import Spinner from '~/components/Spinner'
import { wantedToSubscribe } from '~/utils/subscription.utils'

export default {
  components: {
    Spinner
  },
  data () {
    return {
      username: '',
      password: '',
      loading: false
    }
  },

  methods: {
    login () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true
          const { username, password } = this
          this.$auth
            .login({
              data: {
                username,
                password
              }
            })
            .then(res => {
              console.log(res)
            })
        } else {
          console.log('Invalid values..')
          this.loading = false
          // alert('Please fix the errors')
        }
      })
    }
  }
}
</script>

<style lang="stylus">
.container
  margin-top 45px
</style>
