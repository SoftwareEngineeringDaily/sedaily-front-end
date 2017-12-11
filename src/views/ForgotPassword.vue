<template>

  <div>
    <h1> Reset Your Password </h1>

    <form class='col-md-9' v-on:submit.prevent='submit'>
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

      <p v-if={submitted}>
        Check your email for your reset link.
        Give it a few minutes and make sure to check your Spam folder.
      </p>
      <h3 v-else>We'll send you a special link to allow you to reset your password. j</h3>
      <button name='submit-button' class='btn btn-primary' :disabled='loading'>Submit </button>
    </form>

  <spinner :show="loading"></spinner>
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

  methods: {
    submit: function () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true
          const { email } = this
          this.$store.dispatch('resetPassword', {
            email
          })
          .then((response) => {
            this.loading = false
            this.submitted = true
          })
          .catch(() => {
            alert('There was an error with your submission, make sure you are using the right email.')
          })
        }
      })
    }
  }
}

</script>

<style>
</style>
