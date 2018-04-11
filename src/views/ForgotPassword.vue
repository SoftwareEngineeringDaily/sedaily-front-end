<template>

  <div>
    <h1> Reset Your Password </h1>

    <form class='col-md-9' v-on:submit.prevent='submit'>

      <div v-if=showForm>
        <div class="form-group">
          <label for="emailInput">Email address</label>
          <input type="email"
          v-model='email'
          class="form-control" id="emailInput"
          aria-describedby="emailHelp"
          placeholder="youremail@email.com">
        </div>

        <div v-show="errors.has('email')"
        class="alert alert-danger">
          {{ errors.first('email') }}
        </div>
      </div>

      <p v-if=submitted>
        Check your email for your reset link.
        Give it a few minutes and make sure to check your Spam folder.
      </p>
      <h3 v-else>We'll send you a special link to allow you to reset your password.</h3>

      <div v-if=showForm>
        <button name='submit-button' class='button-submit' :disabled='loading'>Submit </button>
      </div>
    </form>

  <spinner :show="loading"></spinner>
</div>


</template>
<script>
import Spinner from 'components/Spinner.vue'

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
    submit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true
          const { email } = this
          this.$store.dispatch('sendForgotPasswordEmail', {
            email
          })
            .then((response) => {
              this.loading = false
              this.submitted = true
            })
            .catch(() => {
              this.loading = false
              this.submitted = false
              this.$toasted.error('There was an error with your submission, make sure you are using the right email.')
            })
        }
      })
    }
  }
}
</script>
