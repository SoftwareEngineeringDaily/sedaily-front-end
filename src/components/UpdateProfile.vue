
<template>
  <div class="update-profile-view container">
    <div class='row'>
      <div class='col-md-10 offset-md-1' v-on:submit.prevent='submit'>
        <div class="form-group">
          <label for="usernameInput">Username</label>
          <input type="username" v-model='username'
          id="usernameInput"
          name="username"
          v-validate="'required|email'"
          class="form-control"
          aria-describedby="usernameHelp"
          placeholder="Enter a username">
        </div>

        <div class="form-group">
          <label for="nameInput">Name</label>
          <input type="text" v-model='name'
          id="nameInput"
          class="form-control"
          v-validate="'required'"
          aria-describedby="nameHelp"
          placeholder="Alex Smith">
        </div>

        <div class="form-group">
          <label for="bioInput">Bio</label>
          <input type="text" v-model='bio'
          id="bioInput"
          class="form-control"
          v-validate="'required'"
          aria-describedby="bioHelp"
          placeholder="A short bio.">
        </div>

        <div class="form-group">
          <label for="emailInput">Email address</label>
          <input type="email"
          v-model='email'
          class="form-control" id="emailInput"
          aria-describedby="emailHelp"
           placeholder="Enter email">
        </div>

        <div class="form-group">
          <label for="websiteInput">Website</label>
          <input type="text" v-model='website'
          id="websiteInput"
          class="form-control"
          aria-describedby="websiteHelp"
          placeholder="yourWebsite.com">
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
      username: '',
      email: '',
      bio: '',
      website: '',
      loading: false
    }
  },

  methods: {
    submit () {
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
