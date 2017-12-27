<template>
<v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
  <v-form>
    <div class="headline">Reset Your Password</div>

    <v-text-field 
      label="Email address" 
      v-model="email"
      type="email"
      autofocus
      v-validate="'required'"
      @keyup.enter="submitHandler"
      :error-messages="errors.collect('email')"
      data-vv-name="email"
      required /> 
    
    <v-layout row>
      <v-flex xs6>
        <p v-if="submitted">
          Check your email for your reset link.
          Give it a few minutes and make sure to check your Spam folder.
        </p>
        <p v-else>We'll send you a special link to allow you to reset your password.</p>
      </v-flex>
      <v-flex xs6 class="text-xs-right">        
        <v-btn  @click.prevent='submitHandler' color="primary">Submit</v-btn>  
      </v-flex>
    </v-layout>
    
    <spinner :show="loading" />
  </v-form>
</v-flex>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import { mapActions } from 'vuex'

export default {
  name: 'forgot-password',

  components: {
    Spinner
  },

  data () {
    return {
      email: null,
      loading: false,
      submitted: false
    }
  },

  computed: {
    showForm () {
      return !this.submitted
    }
  },

  methods: {
    ...mapActions([
      'sendForgotPasswordEmail',
      'showErrorMessage']),
    submitHandler: function () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true
          const { email } = this
          this.sendForgotPasswordEmail({
            email
          })
            .then((response) => {
              this.loading = false
              this.submitted = true
            })
            .catch(() => {
              this.loading = false
              this.submitted = false
              this.showErrorMessage('There was an error with your submission, make sure you are using the right email.')
            })
        }
      })
    }
  }
}
</script>
