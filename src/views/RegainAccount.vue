<template>
<v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
  <v-form>
    <h1>Enter your new password:</h1>

    <v-text-field 
      label="Password" 
      v-model="password"
      type="password"
      v-validate="'required'"
      autofocus
      @keyup.enter.prevent="register"
      :error-messages="errors.collect('password')"
      data-vv-name="password"
      required />

    <v-btn name='submit-button'  
      @click.prevent='regainAccount' 
      primary 
      :disabled='loading'>Submit</v-btn>
  </v-form>
</v-flex>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import { mapActions } from 'vuex'

export default {
  name: 'regain-account',

  components: {
    Spinner
  },

  data () {
    return {
      password: '',
      submitted: false,
      loading: false
    }
  },

  methods: {
    ...mapActions(['showErrorMessage']),
    regainAccount: function () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true
          const { password } = this
          const { secretKey, resetUID } = this.$route.params
          this.$store.dispatch('regainAccount', {
            newPassword: password,
            secretKey,
            resetUID
          })
            .then((response) => {
              this.loading = false
              this.submitted = true
              // TODO: should log you in :)
              // TODO: should alert success:
              this.$router.replace('/login')
            })
            .catch((error) => {
              console.log('error', error)
              this.loading = false
              this.submitted = false
              this.showErrorMessage('There was an error with your submission, please contact us. Make sure the email you are clicking is not older than a few hours.')
            })
        } else {
          console.log('Invalid values..')
        }
      })
    }
  }
}
</script>
