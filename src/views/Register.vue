<template>
  <div class="login-view container">
    <div class='row'>
      <form class='col-md-6 offset-md-3' v-on:submit.prevent='login'>
        <h1>Register</h1>

        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input type="email" v-model='email' class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
          <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>

        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input type="password" v-model='password' class="form-control" id="exampleInputPassword1" placeholder="Password">
        </div>

        <button class='btn btn-primary' @click.prevent='login' :disabled='loading'>Register</button>
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
      email: '',
      password: '',
      loading: false
    }
  },

  methods: {
    login: function () {
      this.loading = true
      this.$store.dispatch('register', {
        email: this.email,
        password: this.password
      })
      .then((response) => {
        this.loading = false
        if (response.data.token) this.$router.replace('/')
      })
    }
  }
}
</script>

<style lang="stylus">
</style>
