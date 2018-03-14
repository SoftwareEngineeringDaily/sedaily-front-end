<template>

  <div>
    <h1> Reset Your Password </h1>

    <form
      class="col-md-9"
      @submit.prevent="submit">

      <div v-if="showForm">
        <div class="form-group">
          <label for="emailInput">Email address</label>
          <input
            id="emailInput"
            v-model="email"
            type="email"
            class="form-control"
            aria-describedby="emailHelp"
            placeholder="youremail@email.com">
        </div>

        <div
          v-show="errors.has('email')"
          class="alert alert-danger">
          {{ errors.first('email') }}
        </div>
      </div>

      <p v-if="submitted">
        Check your email for your reset link.
        Give it a few minutes and make sure to check your Spam folder.
      </p>
      <h3 v-else>We'll send you a special link to allow you to reset your password.</h3>

      <div v-if="showForm">
        <button
          :disabled="loading"
          name="submit-button"
          class="button-submit">Submit </button>
      </div>
    </form>
    <spinner :show="loading" />
  </div>
</template>
<script>
import Spinner from '~/components/Spinner.vue'

export default {
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
    async submit () {
      const valid = this.$validator.validateAll()
      if (valid) {
        this.loading = true
        const { email } = this

        try {
          await this.$store.dispatch('sendForgotPasswordEmail', { email })
          this.submitted = true
        }
        catch (_) {
          this.submitted = false
          this.$toast.error('There was an error with your submission, make sure you are using the right email.')
        }

        this.loading = false
      }
    }
  }
}
</script>
