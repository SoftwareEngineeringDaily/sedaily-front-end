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
      <p>You're already logged in! <a href="/logout">Logout</a> or <a href="/profile">go to your profile</a>.</p>
    </div>
  </div>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import { wantedToSubscribe } from '../utils/subscription.utils.js'
import { mapActions, mapGetters } from 'vuex'

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
  created () {
    this.fetchData()
  },
  watch: {
    // re-fetch if route changes
    '$route': 'fetchData'
  },
  methods: {
    ...mapActions(['fetchPublicProfileData']),
    fetchData () {
      this.loading = true
      Promise.all([
        this.fetchPublicProfileData({ userId: this.userId })
      ])
        .then((responses) => {
          /* TODO: Discuss best approach for managing fetched data's state
             in vuex if it's just being displayed and not interacted with:
             not in vuex like this.user or in vuex like feed below
           */
          this.user = responses[0].data
        })
        .catch((error) => {
          this.error = error.response.data.message
        })
        .finally(() => {
          this.loading = false
        })
    },
    login () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true
          const { username, password } = this
          this.$store.dispatch('login', {
            username,
            password
          })
            .then((response) => {
              this.loading = false
              if (response.data.token) {
                this.$store.dispatch('loginEvent', {
                  username
                })
                  .then((eventResponse) => {
                    // Ignore response for now
                  })
                if (wantedToSubscribe()) {
                  this.$router.replace('/subscribe')
                } else {
                  this.$router.replace('/')
                }
              } else {
                alert('Invalid login')
              }
            })
        } else {
          console.log('Invalid values..')
          this.loading = false
          // alert('Please fix the errors')
        }
      })
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn'])
  }
}
</script>

<style lang="stylus">
.container
  margin-top 45px
</style>
