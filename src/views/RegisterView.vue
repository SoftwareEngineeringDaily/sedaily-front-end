<template>
  <div class="login-view container">
    <div class='row' v-if="!isLoggedIn">
      <form class='col-md-6 offset-md-3' v-on:submit.prevent='register'>
        <h1>Register</h1>

        <div class="form-group">
          <label for="usernameInput">Username</label>
          <input type="text" v-model='username'
          id="usernameInput"
          name="username"
          v-validate="'required'"
          class="form-control"
          aria-describedby="usernameHelp"
          placeholder="Username">

          <div v-show="errors.has('username')"
          class="alert alert-danger">
          {{ errors.first('username') }}</div>
        </div>

        <div class="form-group">
          <label for="passwordInput">Password</label>
          <input type="password" v-model='password'
          id="passwordInput"
          name="password"
          v-validate="'required'"
          class="form-control"
          aria-describedby="passwordHelp"
          placeholder="Password">

          <div v-show="errors.has('password')"
          class="alert alert-danger">
          {{ errors.first('password') }}</div>
        </div>

        <div class="form-group">
          <label for="nameInput">Name</label>
          <input type="text" v-model='name'
          name="name"
          id="nameInput"
          class="form-control"
          v-validate="'required'"
          aria-describedby="nameHelp"
          placeholder="Alex Smith">

          <div v-show="errors.has('name')"
          class="alert alert-danger">
          {{ errors.first('name') }}</div>
        </div>

        <div class="form-group">
          <label for="bioInput">Bio</label>
          <input type="text" v-model='bio'
          id="bioInput"
          class="form-control"
          aria-describedby="bioHelp"
          placeholder="A short bio">
        </div>

        <div class="form-group">
          <label for="emailInput">Email address</label>
          <input type="email"
          v-model='email'
          class="form-control" id="emailInput"
          aria-describedby="emailHelp"
          placeholder="youremail@email.com">
        </div>

        <div class="form-group">
          <label for="websiteInput">Website</label>
          <input type="text" v-model='website'
          id="websiteInput"
          class="form-control"
          aria-describedby="websiteHelp"
          placeholder="yourWebsite.com">
        </div>

        <button name='submit-button' class='button-submit' :disabled='loading'>Register</button>
      </form>

    </div>

    <br />
    <div class='row' v-if="!isLoggedIn">
      <div class='col-md-6 offset-md-3'>
        Already have an account?
        <router-link to="/login" name="login-link">Login</router-link>
      </div>
    </div>
    <div v-if="isLoggedIn" class="row">
      <div v-if="isLoggedIn" class='col-md-6 offset-md-3'>
      <p>You're already logged in! <a @click.prevent="logout">Logout</a> or <a href="/profile">go to your profile</a>.</p>
    </div>
    </div>
    <spinner :show="loading"></spinner>
  </div>
</template>

<script>
import { wantedToSubscribe } from '../utils/subscription.utils.js'
import { mapActions, mapGetters } from 'vuex'
import Spinner from '@/components/Spinner.vue'

export default {
  name: 'top-list',

  components: {
    Spinner
  },

  data () {
    return {
      username: '',
      password: '',
      name: '',
      email: '',
      bio: '',
      website: '',
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
    register () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true
          const { username, email, bio, website, name, password } = this
          this.$store.dispatch('register', {
            username,
            password,
            name,
            bio,
            website,
            email
          })
            .then((response) => {
              this.loading = false

              if (response.data.token) {
                this.$store.dispatch('registerEvent', {
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
                alert('Invalid registration')
              }
            })
        } else {
          console.log('Failed to validate for registraiotn')
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
