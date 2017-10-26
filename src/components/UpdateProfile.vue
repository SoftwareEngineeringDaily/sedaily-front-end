
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
          placeholder="Username">

          <div v-show="errors.has('username')"
          class="alert alert-danger">
          {{ errors.first('username') }}</div>
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
import { mapState } from 'vuex'
// TODO: remove usename update for now?
export default {
  name: 'update-profile',
  props: ['initialUsername'],
  components: {
    Spinner
  },

  data () {
    return {
      username: this.initialUsername,
      name: '',
      email: '',
      bio: '',
      website: '',
      loading: false
    }
  },

  computed: {
    // local computed methods +
    ...mapState({
      id (state) {
        return state.me._id
      }
    })
  },
  methods: {
    submit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true
          const {username, email, bio, website, name, id} = this
          this.$store.dispatch('updateProfile', {
            username,
            id,
            name,
            bio,
            website,
            email
          })
          .then((response) => {
            this.loading = false
          })
        } else {
          console.log('Invalid fields in form :(')
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
