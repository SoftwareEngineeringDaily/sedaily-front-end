<template>
  <div class="login-view container">
    <div
      v-if="!isLoggedIn"
      class="row">
      <form
        class="col-md-6 offset-md-3"
        @submit.prevent="register">
        <h1>Register</h1>

        <div class="form-group">
          <label for="usernameInput">Username</label>
          <input
            v-validate="'required'"
            id="usernameInput"
            v-model="username"
            type="text"
            name="username"
            class="form-control"
            aria-describedby="usernameHelp"
            placeholder="Username">

          <div
            v-show="errors.has('username')"
            class="alert alert-danger">
            {{ errors.first('username') }}</div>
        </div>

        <div class="form-group">
          <label for="passwordInput">Password</label>
          <input
            v-validate="'required'"
            id="passwordInput"
            v-model="password"
            type="password"
            name="password"
            class="form-control"
            aria-describedby="passwordHelp"
            placeholder="Password">

          <div
            v-show="errors.has('password')"
            class="alert alert-danger">
            {{ errors.first('password') }}</div>
        </div>

        <div class="form-group">
          <label for="nameInput">Name</label>
          <input
            v-validate="'required'"
            id="nameInput"
            v-model="name"
            type="text"
            name="name"
            class="form-control"
            aria-describedby="nameHelp"
            placeholder="Alex Smith">

          <div
            v-show="errors.has('name')"
            class="alert alert-danger">
            {{ errors.first('name') }}</div>
        </div>

        <div class="form-group">
          <label for="bioInput">Bio</label>
          <input
            id="bioInput"
            v-model="bio"
            type="text"
            class="form-control"
            aria-describedby="bioHelp"
            placeholder="A short bio">
        </div>

        <div class="form-group">
          <label for="emailInput">Email address</label>
          <input
            id="emailInput"
            v-model="email"
            type="email"
            class="form-control"
            aria-describedby="emailHelp"
            placeholder="youremail@email.com">
        </div>

        <div class="form-group">
          <label for="websiteInput">Website</label>
          <input
            id="websiteInput"
            v-model="website"
            type="text"
            class="form-control"
            aria-describedby="websiteHelp"
            placeholder="yourWebsite.com">
        </div>

        <button
          :disabled="loading"
          name="submit-button"
          class="button-submit">Register</button>
      </form>

    </div>

    <br>
    <div
      v-if="!isLoggedIn"
      class="row">
      <div class="col-md-6 offset-md-3">
        Already have an account?
        <nuxt-link
          to="/login"
          name="login-link">Login</nuxt-link>
      </div>
    </div>
    <spinner :show="loading" />
    <div
      v-if="isLoggedIn"
      class="row">
      <div class="col-md-6 offset-md-3">
        You're already logged in! <a
          href=""
          @click.prevent="logout">Logout</a> or <nuxt-link to="/profile">go to your profile</nuxt-link>.
      </div>
    </div>
  </div>
</template>

<script>
import { wantedToSubscribe } from '~/utils/subscription.utils.js'
import Spinner from '~/components/Spinner.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
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
  computed: {
    ...mapGetters(['isLoggedIn'])
  },
  methods: {
    logout () {
      this.$auth.logout()
      this.$axios.setHeader('Authorization', null)
      this.$router.replace('/')
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
                if (wantedToSubscribe(this.$store)) {
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
    }
  }
}
</script>
