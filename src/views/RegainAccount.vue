<template>
  <div>

    <form class='col-md-6 offset-md-3' v-on:submit.prevent='regainAccount'>
      <h1>Enter your new password:</h1>
      <div class="form-group">
        <label for="inputPassword">New Password</label>
        <input name='password' v-model='password'
        v-validate="'required'"
        type="password"
        class="form-control"
        id="inputPassword"
        placeholder="Password">

        <div v-show="errors.has('password')"
        class="alert alert-danger">
        {{ errors.first('password') }}
      </div>
    </div>
    <button name='submit-button' class='button-submit' :disabled='loading'>Submit </button>
    </form>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
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
              alert('There was an error with your submission, please contact us. Make sure the email you are clicking is not older than a few hours.')
            })
        } else {
          console.log('Invalid values..')
        }
      })
    }
  }
}
</script>
