<template>
  <div class="login-view container">
    <div class='row'>
      <form v-if="!isLoggedIn" class='col-md-6 offset-md-3' v-on:submit.prevent='login'>
        <h1>Login</h1>

        <div class="form-group">
          <label for="usernameInput">Email</label>
          <input type="text" v-model='username'
          id="usernameInput"
          name="username"
          v-validate="'required'"
          class="form-control"
          aria-describedby="usernameHelp"
          placeholder="Enter your email">

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
          placeholder="Enter password">

          <div v-show="errors.has('password')"
          class="alert alert-danger">
          {{ errors.first('password') }}</div>
        </div>
        <div class="form-group">
          <button name='submit-button' class='button-submit' :disabled='loading'>Sign In</button>
          <spinner :show="loading"></spinner>
        </div>
        <div class="login-buttons col-md-12">
          <span>Don't have an account? <router-link to="/register" name="register" class="signup">Sign Up</router-link></span>
          <router-link to="/forgot-password" name="forgot-password">Forgot password?</router-link>
        </div>
      </form>
    <div v-if="isLoggedIn" class='col-md-6 offset-md-3'>
      <p>You're already logged in! <a href="/" @click.prevent="logout">Logout</a> or <a href="/profile">go to your profile</a>.</p>
    </div>
  </div>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner'
import { wantedToSubscribe } from '@/utils/subscription.utils.js'
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
  methods: {
    login () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true
          const { username, password } = this
          this.$auth.login({
            username,
            password
          })
            .then((response) => {
              if (response.data.token) {
                this.$store.dispatch('loginEvent', {
                  username
                })
                  .then((eventResponse) => {
                    // Ignore response for now
                    this.$store.dispatch('notification.app.register')
                  })
                if (wantedToSubscribe()) {
                  this.$router.replace('/subscribe')
                } else {
                  this.$router.replace('/')
                }
              } else {
                this.$toasted.error('Invalid login', { 
                    theme: "bubble"
                })
              }
            })
            .finally(() => { this.loading = false })
        } else {
          this.loading = false
        }
      })
    },
    logout () {
      this.$auth.logout()
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn'])
  }
}
</script>

<style scoped lang="stylus">
.container  
  .login-buttons
    padding 15px 0
    display flex
    align-items center
    justify-content space-between
    
    .button-submit
      min-width 100px
  
  .signup
    text-decoration underline
    color #007bff
  
    &:hover
      color #222

@media (max-width 500px)
  .container    
    .container-input
      text-align center
    
    .login-buttons
      flex-direction column
      align-items flex-start
      button
        margin-bottom 1rem
</style>
