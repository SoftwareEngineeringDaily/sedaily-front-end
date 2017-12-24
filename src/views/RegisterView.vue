<template>
<v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
  <v-form>
    <div class="headline">Register</div>
    
    <v-text-field 
      label="Username" 
      v-model="username"
      v-validate="'required'" 
      autofocus
      :error-messages="errors.collect('username')"
      @keyup.enter.prevent="register"
      data-vv-name="username"
      required />                  

    <v-text-field 
      label="Password" 
      v-model="password"
      type="password"
      v-validate="'required'"
      @keyup.enter.prevent="register"
      :error-messages="errors.collect('password')"
      data-vv-name="password"
      required />

    <v-text-field 
      label="Name" 
      v-model="name"
      v-validate="'required'"
      @keyup.enter.prevent="register"
      :error-messages="errors.collect('name')"
      data-vv-name="name"
      required />

    <v-text-field 
      label="Bio" 
      @keyup.enter.prevent="register"
      v-model="bio" /> 

    <v-text-field 
      label="Email address" 
      v-model="email"
      type="email"
      @keyup.enter.prevent="register"
      v-validate="'required'"
      :error-messages="errors.collect('email')"
      data-vv-name="email"
      required />

    <v-text-field 
      label="Website" 
      @keyup.enter.prevent="register"
      v-model="website" />
  
    <v-layout row>
      <v-flex xs6>
        Already have an account?
        <router-link to="/login" name="login-link">Login</router-link>    
      </v-flex>
      <v-flex xs6 class="text-xs-right">        
        <v-btn  @click.prevent='register' :disabled="loading">Register</v-btn>  
      </v-flex>
    </v-layout>

    <spinner :show="loading" />
  </v-form>
</v-flex>
</template>

<script>
import { wantedToSubscribe } from '../utils/subscription.utils.js'
import Spinner from '@/components/Spinner.vue'
import { mapActions } from 'vuex'

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
      loading: false
    }
  },

  methods: {
    ...mapActions(['showErrorMessage']),
    register: function () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true
          const {username, email, bio, website, name, password} = this
          this.$store.dispatch('register', {
            username,
            password,
            name,
            bio,
            website,
            email
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
                this.showErrorMessage('Invalid registration')
              }
            })
        } else {
          console.log('Failed to validate for registraiotn')
        }
      })
    }
  }
}
</script>
