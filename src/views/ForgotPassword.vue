<template>

  <div class="forgot-password-view container">

    <form class='col-md-6 offset-md-3' v-on:submit.prevent='submit'>
      <h1> Reset Your Password </h1>

      <div v-if="showForm">
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

      <p class="forgot-p" v-if="submitted">
        Check your email for your reset link.
        Give it a few minutes and make sure to check your Spam folder.
      </p>
      <p class="forgot-p" v-else>We'll send you a special link to allow you to reset your password.</p>

      <div class="form-group login-buttons" v-if="showForm">
        <div>
          <button name='submit-button' class='button-submit' :disabled='loading'>Submit </button>
          <spinner :show="loading"></spinner>
        </div>
        <router-link to="/login">Back to sign in</router-link>
      </div>
    </form>

</div>


</template>
<script>
import Spinner from '@/components/Spinner.vue'

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
              this.$toasted.error('There was an error with your submission, make sure you are using the right email.', { 
                  theme: "bubble"
              })
            })
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  .login-buttons
    display flex
    align-items center
    justify-content space-between
  .forgot-p
    margin 15px 0
</style>
