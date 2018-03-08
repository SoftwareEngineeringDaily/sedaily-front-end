<template>
  <div class="login-view container">
    <div class="row">
      <form
        v-if="!isLoggedIn"
        class="col-md-6 offset-md-3">
        <h1>Login</h1>

        <div class="form-group">
          <label for="usernameInput">Username or Email</label>
          <input
            v-validate="'required'"
            id="usernameInput"
            v-model="username"
            type="text"
            name="username"
            class="form-control"
            aria-describedby="usernameHelp"
            placeholder="Enter a username or email">

          <div
            v-show="errors.has('username')"
            class="alert alert-danger">
            {{ errors.first('username') }}</div>
        </div>

        <div class="form-group">
          <label for="inputPassword">Password</label>
          <input
            v-validate="'required'"
            id="inputPassword"
            v-model="password"
            name="password"
            type="password"
            class="form-control"
            placeholder="Password">

          <div
            v-show="errors.has('password')"
            class="alert alert-danger">
            {{ errors.first('password') }}</div>
        </div>

        <button
          :disabled="loading"
          name="submit-button"
          class="button-submit"
          @click.prevent="login">Login</button>

        <div class="col-med-12">
          <br>
          <nuxt-link
            to="/forgot-password"
            name="forgot-password">Forgot Password?</nuxt-link>
        </div>
      </form>
    </div>

    <spinner :show="loading" />
    <div
      v-if="isLoggedIn"
      class="col-md-6 offset-md-3">
      <div>
        You're already logged in! <a
          href=""
          @click.prevent="logout">Logout</a> or <nuxt-link to="/profile">go to your profile</nuxt-link>.
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from '~/components/Spinner'
import { wantedToSubscribe } from '~/utils/subscription.utils'
import { mapActions, mapGetters } from 'vuex'

export default {
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
  computed: {
    ...mapGetters(['isLoggedIn'])
  },
  methods: {
    login () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true
          const { username, password } = this
          this.$auth
            .login({
              data: {
                username,
                password
              }
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          this.$toast.error('Invalid values')
          this.loading = false
        }
      })
    },
    logout () {
      this.$auth.logout()
      this.$axios.setHeader('Authorization', null)
      this.$router.replace('/')
    }
  }
}
</script>

<style lang="stylus">
.container
  margin-top 45px
</style>
