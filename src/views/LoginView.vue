<template>
  <div class="login-view container">
    <div class='row'>
      <form class='col-md-6 offset-md-3' v-on:submit.prevent='login'>
        <h1>Login</h1>


        <div class="form-group">
          <label for="usernameInput">Username</label>
          <input type="text" v-model='username'
          id="usernameInput"
          name="username"
          v-validate="'required'"
          class="form-control"
          aria-describedby="usernameHelp"
          placeholder="Enter a username">

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

        <button name='submit-button' class='btn btn-primary' :disabled='loading'>Login</button>
      </form>
    </div>

    <spinner :show="loading"></spinner>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'

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
    login: function () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true
          const {username, password} = this
          this.$store.dispatch('login', {
            username,
            password
          })
          .then((response) => {
            this.loading = false
            if (response.data.token) this.$router.replace('/')
          })
        } else {
          console.log('Invalid values..')
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
