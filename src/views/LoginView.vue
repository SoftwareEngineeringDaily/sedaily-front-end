<template>
  <div class="login-view container">
    <div class='row'>
      <form v-if="!isLoggedIn" class='col-md-6 offset-md-3' v-on:submit.prevent='login'>
        <h1>Login</h1>


        <div class="form-group">
          <label for="usernameInput">Username or Email</label>
          <input type="text" v-model='username'
          id="usernameInput"
          name="username"
          v-validate="'required'"
          class="form-control"
          aria-describedby="usernameHelp"
          placeholder="Enter a username or email">

          <div v-show="errors.has('username')"
          class="alert alert-danger">
          {{ errors.first('username') }}</div>
        </div>

        <div class="form-group">
          <label for="inputPassword">Password</label>
          <input name='password' v-model='password'
          v-validate="'required'"
          type="password"
          class="form-control"
          id="inputPassword"
          placeholder="Password">

          <div v-show="errors.has('password')"
          class="alert alert-danger">
          {{ errors.first('password') }}</div>
        </div>

        <button name='submit-button' class='button-submit' :disabled='loading'>Login</button>

        <div class="col-med-12">
          <br />
          <router-link to="/forgot-password" name="forgot-password">Forgot Password?</router-link>
        </div>
      </form>
    <spinner :show="loading"></spinner>
    <div v-if="isLoggedIn" class='col-md-6 offset-md-3'>
      <p>You're already logged in! <a @click.prevent="logout">Logout</a> or <a href="/profile">go to your profile</a>.</p>
    </div>
  </div>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import { wantedToSubscribe } from '../utils/subscription.utils.js'
import { mapGetters } from 'vuex'

export default {
  name: 'login',
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
  computed: {
    ...mapGetters([
      'isLoggedIn'
    ])
  },
  methods: {
    login () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true
          const { username, password } = this
          this.$auth.login({ username, password })
            .then((response) => {
              if (response.data.token) {
                if (wantedToSubscribe()) this.$router.replace('/subscribe')
                else this.$router.replace('/')
              } else this.$toasted.error('Invalid login')

            })
            .finally(() => { this.loading = false })
        } else {
          console.log('Invalid values..')
          this.loading = false
        }
      })
    },
    logout () {
      this.$auth.logout()
    }
  }
}
</script>

<style lang="stylus">
.container
  margin-top 45px
</style>
