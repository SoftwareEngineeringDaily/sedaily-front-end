<template>
  <div class="login-view container">
    <div class='row'>
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

        <button name='submit-button' class='btn btn-primary' @click.prevent='register' :disabled='loading'>Register</button>
      </form>
    </div>

    <spinner :show="loading"></spinner>
  </div>
</template>

<script>
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

  methods: {
    register: function () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true
          const {username, email, bio, website, name, password} = this
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
            if (response.data.token) this.$router.replace('/')
          })
        } else {
          console.log('Failed to validate for registraiotn')
        }
      })
    }
  }
}
</script>

<style lang="stylus">
</style>
