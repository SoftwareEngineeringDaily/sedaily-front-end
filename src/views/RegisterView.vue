<template>
  <div class="login-view container">
    <div class='row' v-if="!isLoggedIn">
      <form class='col-md-6 offset-md-3' @submit.prevent='registerHandler'>
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

        <div class="form-group">
          <center>
            <input type="checkbox" v-model='newsletter'
            id="allowNewsletter"
            class=""
            aria-describedby="newsletterHelp">
            <label for="allowNewsletter" class="newsletter-text"> Register for newsletter?</label>
          </center>
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
import { wantedToSubscribe } from '@/utils/subscription.utils.js'
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
      newsletter: true,
      loading: false
    }
  },
  methods: {
    ...mapActions(['register']),
    registerHandler () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true
          const { username, email, bio, website, name, password, newsletter } = this
          this.$store.dispatch('register', {
            username,
            password,
            name,
            bio,
            website,
            email,
            newsletter
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
                this.$toasted.error('Invalid registration')
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

<style scoped lang="stylus">
  .newsletter-text
    padding-left 15px
</style>
