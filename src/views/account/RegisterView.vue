<template>
  <div class="container">
    <div class="row" v-if="!isLoggedIn">
      <form class="col-md-6 offset-md-3" @submit.prevent="() => {}">
        <h1>Register</h1>

        <div class="form-group">
          <label for="emailInput">E-mail address</label>
          <input type="email"
          v-model="email"
          name="email"
          v-validate="'required'"
          class="form-control" id="emailInput"
          aria-describedby="emailHelp"
          placeholder="alex@email.com"
          ref="email">

          <div v-show="errors.has('email')" class="alert alert-danger">
            {{ errors.first('email') }}
          </div>
        </div>

        <div v-if="email">
          <div class="form-group">
            <label for="passwordInput">Password</label>
            <input type="password"
            v-model="password"
            id="passwordInput"
            name="password"
            v-validate="'required'"
            class="form-control"
            aria-describedby="passwordHelp"
            placeholder="Password"
            ref="password">

            <div v-show="errors.has('password')" class="alert alert-danger">
              {{ errors.first('password') }}
            </div>
          </div>

          <div class="form-group">
            <label for="nameInput">First Name</label>
            <input type="text"
            v-model="name"
            name="name"
            id="nameInput"
            class="form-control"
            v-validate="'required'"
            aria-describedby="nameHelp"
            placeholder="Alex">

            <div v-show="errors.has('name')" class="alert alert-danger">
             {{ errors.first('name') }}
            </div>
          </div>

          <div class="form-group">
            <label for="lastNameInput">Last Name</label>
            <input type="text"
            v-model="lastName"
            name="lastName"
            id="lastNameInput"
            class="form-control"
            v-validate="'required'"
            aria-describedby="lastNameHelp"
            placeholder="Smith">

            <div v-show="errors.has('lastName')" class="alert alert-danger">
             {{ errors.first('lastName') }}
            </div>
          </div>
        </div>
        <div v-else>
          <div class="break" name="OR" />
          <twitter-login />
        </div>

        <div class="login-buttons col-md-12" v-if="!isLoggedIn">
          <div>
            Already have an account?
            <router-link to="/login" name="login-link">Sign In</router-link>
          </div>
          <div>
            <button
              name="submit-button"
              class="button-submit"
              :disabled="loading"
              @click="registerHandler">
              Register
            </button>
            <spinner :show="loading" :size="32"></spinner>
          </div>
        </div>
      </form>
    </div>

    <br />
    <div v-if="isLoggedIn" class="row">
      <div v-if="isLoggedIn" class="col-md-6 offset-md-3">
      <p>You're already logged in! <a href="/" @click.prevent="logout">Logout</a> or <a href="/profile">go to your profile</a>.</p>
    </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { getQuery } from '@/utils/link.utils'
import { wantedToSubscribe } from '@/utils/subscription.utils'
import Spinner from '@/components/Spinner'
import TwitterLogin from '@/components/account/TwitterLogin'

export default {
  name: 'register-view',

  components: {
    Spinner,
    TwitterLogin,
  },

  data () {
    return {
      password: '',
      name: '',
      lastName: '',
      email: '',
      loading: false,
    }
  },

  methods: {
    ...mapActions([
      'register',
    ]),

    registerHandler (evt) {
      this.$validator.validateAll().then((result) => {
        if (result) return this._register()
      })
    },

    _register () {
      const { email, name, lastName, password } = this

      this.register({ password, name, lastName, email })
        .then((response) => {
          this.$store.commit('setToken', response.data.token)
          this.$store.dispatch('fetchMyProfileData')
          if (wantedToSubscribe()) {
            this.$router.push('/subscribe')
          } else {
            this.$router.push('/')
          }
        })
        .catch((e) => {
          const msg = (e.response.data && e.response.data.message)
            ? e.response.data.message
            : 'Failed to register'
          this.$toasted.error(msg, { duration : 6000 })
        })
        .finally(() => {
          this.loading = false
        })
    },

    logout () {
      this.$auth.logout()
    }
  },

  computed: {
    ...mapGetters([
      'isLoggedIn'
    ])
  }
}
</script>

<style scoped lang="stylus">
@import '../../css/variables'

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

.container
  padding-top 3rem

.container:hover input ~ .checkmark
  background-color #eee

.container input:checked ~ .checkmark
  background-color #ccc

.container input:checked ~ .checkmark:after
  display block

.checkmark:after
  content ""
  position absolute
  display none

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

.twitter-button
  appearance none
  box-sizing border-box
  display block
  width 100%
  padding 10px 20px
  font-weight 700
  color #ffffff
  border-radius 2px
  background-color #1da1f2
  border none

  .fa
    margin-right 6px

  &[disabled]
    pointer-events none
    background-color #ccc

.login-buttons
  padding 3rem 0 1rem
  flex-direction row
  display flex
  align-items center
  justify-content flex-end

  a
    text-decoration underline

  .button-submit
    min-width 100px
    margin-left 1rem

.break
  display: block;
  position: relative;
  margin: 2rem 0;
  text-align: center;
  text-transform: uppercase;
  border-bottom: 1px solid #e9ecef;

  &:before
    content: attr(name);
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 0 1rem;
    background-color: #ffffff;
    transform: translate(-50%, -50%);

@media (max-width 500px)
  .container
    .container-input
      text-align center
    .login-buttons
      flex-direction column
      align-items flex-start
      button
        margin-bottom 1rem
</style>
