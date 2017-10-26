
<template>
  <div class="update-profile-view container">
    <div class='row'>
      <div class='col-md-6 offset-md-3' v-on:submit.prevent='submit'>
        <div class="form-group">

          <label for="exampleInputEmail1">Usenrname</label>
          <input type="username" v-model='username'
          v-validate="'required|email'"
          class="form-control" id="exampleInputEmail1"
          aria-describedby="usernameHelp" placeholder="Enter a username">

          <label for="exampleInputEmail1">Email address</label>
          <input type="email" v-model='email'
          class="form-control" id="exampleInputEmail1"
          aria-describedby="emailHelp" placeholder="Enter email">
        </div>

        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input
          type="password"
          v-model='password'
          class="form-control"
          id="exampleInputPassword1" placeholder="Password">
        </div>

        <button
        class='btn btn-primary'
        @click.prevent='submit' :disabled='loading'>
          Update
        </button>
      </div>
    </div>

    <spinner :show="loading"></spinner>
  </div>
</template>

<script>
/* @flow */
// Maybe this can be a simple updater of profiles etc:
import Spinner from './Spinner.vue'

export default {
  name: 'update-profile',
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
    submit (dsdfsd) {
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
