
<template>
  <div class="update-profile-view container">
    <div class='row'>
      <div class='col-md-10 offset-md-1' v-on:submit.prevent='submit'>
        <div class="form-group">
          <label for="usernameInput">Username</label>
          <input type="username" v-model='username'
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
          v-validate="{ required: false, email: true}"
          name='email'
          class="form-control" id="emailInput"
          aria-describedby="emailHelp"
           placeholder="youremail@email.com">
           <div v-show="errors.has('email')"
           class="alert alert-danger">
           {{ errors.first('email') }}</div>
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
        {{msg}}
      </div>
    </div>

    <spinner :show="loading"></spinner>
  </div>
</template>

<script>
/* @flow */
// Maybe this can be a simple updater of profiles etc:
import Spinner from './Spinner.vue'
import { mapState, mapActions } from 'vuex'
// TODO: remove usename update for now?
export default {
  name: 'update-profile',
  props: ['initialUsername', 'me'],
  components: {
    Spinner
  },

  data () {
    return {
      msg: '',
      username: this.initialUsername,
      name: this.me ? this.me.name : '',
      email: this.me ? this.me.email : '',
      bio: this.me ? this.me.bio : '',
      website: this.me ? this.me.website : '',
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
    ...mapActions(['updateProfile']),
    submit () {
      this.msg = ''
      this.$validator.validateAll().then((result) => {
        console.log('result', result)
        if (result) {
          this.loading = true
          const {username, email, bio, website, name, id} = this
          this.updateProfile({
            username,
            id,
            name,
            bio,
            website,
            email
          })
          .then((response) => {
            this.loading = false
            // This means we are just updating our profile:
            // TODO: have it be a componenet that is passed on
            if (this.me) {
              this.msg = 'Success, your profile was Updated :)'
            }
          })
        } else {
          this.msg = 'Invalid fields on form :('
          console.log('Invalid fields in form :(')
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
