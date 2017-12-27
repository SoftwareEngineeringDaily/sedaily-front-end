<template>
<v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
  <v-form>
    <div class="headline">Login</div>
    
    <v-text-field 
      label="Username or Email" 
      v-model="username"
      v-validate="'required'" 
      :error-messages="errors.collect('username')"
      data-vv-name="username"
      autofocus
      @keyup.enter.prevent="loginHandler"
      required />                  

    <v-text-field 
      label="Password" 
      v-model="password"
      type="password"
      v-validate="'required'"
      :error-messages="errors.collect('password')"
      data-vv-name="password"
      @keyup.enter.prevent="loginHandler"
      required />            
  
    <v-layout row>
      <v-flex xs6>
        <router-link to="/forgot-password" name="forgot-password">Forgot Password?</router-link>
      </v-flex>
      <v-flex xs6 class="text-xs-right">
        <v-btn  @click.prevent='loginHandler' color="primary">Login</v-btn>
      </v-flex>
    </v-layout>
    
    <spinner :show="loading" />
  </v-form>
</v-flex>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import { wantedToSubscribe } from '../utils/subscription.utils.js'
import { mapActions } from 'vuex'

export default {
  $validates: true,
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
    ...mapActions([
      'login',
      'showErrorMessage'
    ]),
    loginHandler: function () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true
          const {username, password} = this
          this.login({
            username,
            password
          })
            .then((response) => {
              this.loading = false
              if (response.data.token) {
                if (wantedToSubscribe()) {
                  this.$router.replace('/subscribe')
                } else {
                  this.$router.replace('/')
                }
              } else {
                this.showErrorMessage('Invalid login')
              }
            })
        } else {
          console.log('Invalid values..')
          this.loading = false
        }
      })
    }
  }
}
</script>
