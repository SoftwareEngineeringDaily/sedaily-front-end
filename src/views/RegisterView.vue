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
          placeholder="AlexSmith">

          <div v-show="errors.has('username')"
          class="alert alert-danger">
          {{ errors.first('username') }}</div>
        </div>

        <div class="form-group">
          <label for="passwordInput">Password</label>
          <input type="Enter password" v-model='password'
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
          placeholder="Alex">

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
          placeholder="alex@email.com">
        </div>

        <div class="form-group">
          <label for="websiteInput">Website</label>
          <input type="text" v-model='website'
          id="websiteInput"
          class="form-control"
          aria-describedby="websiteHelp"
          placeholder="alexWebsite.com">
        </div>

        <div class="form-group">
          <label class="container-input">
            Register for newsletter?
            <input type="checkbox" v-model='newsletter'
            id="allowNewsletter"
            class=""
            aria-describedby="newsletterHelp">
            <span class="checkmark"></span>
          </label>
        </div>
        <div class="login-buttons col-md-12" v-if="!isLoggedIn">
          <button name='submit-button' class='button-submit' :disabled='loading'>Register</button>
          <div>
            Already have an account?
            <router-link to="/login" name="login-link"> Login</router-link>
          </div>
        </div>
      </form>
    </div>

    <br />
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
  @import './../css/variables'
  .container-input
    width auto
    display flex
    align-items center
    position relative
    padding-left 25px
    margin-bottom 12px
    margin-top 12px
    cursor pointer
    font-size 14px
    -webkit-user-select none
    -moz-user-select none
    -ms-user-select none
    input
      position absolute
      opacity 0
      cursor pointer
      height 0
      width 0
    .checkmark
      position absolute
      left 0
      height 15px
      width 15px
      background-color #eee
  .container:hover input ~ .checkmark
    background-color #eee
  .container input:checked ~ .checkmark
    background-color #ccc
  .checkmark:after
    content ""
    position absolute
    display none
  .container input:checked ~ .checkmark:after
    display block
  .container .checkmark:after
    left 5px
    top 2px
    width 5px
    height 10px
    border 1px solid white
    border-width 0 3px 3px 0
    -webkit-transform rotate(45deg)
    -ms-transform rotate(45deg)
    transform rotate(45deg)
  .container
    margin 45px
    .login-buttons
      padding 15px 0
      flex-direction row
      display flex
      align-items center
      justify-content space-between
      .button-submit
        min-width 100px
  @media (max-width 500px)
    .container
      margin 45px 0
      .container-input
        text-align center
      .login-buttons
        flex-direction column
        align-items flex-start
        button
          margin-bottom 1rem
</style>
