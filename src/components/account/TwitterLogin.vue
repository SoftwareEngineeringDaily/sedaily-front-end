<template>
  <button
    class="twitter-button"
    :disabled="loading"
    @click="twitter">
    <i class="fa fa-lg fa-twitter" /> {{copy}} with Twitter
  </button>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'twitter-login',

  props: {
    copy: {
      type: String,
      default: 'Sign Up',
    }
  },

  data () {
    return {
      loading: false,
    }
  },

  methods: {
    ...mapActions([
      'register',
      'twitterRequest',
    ]),

    async twitter () {
      this.loading = true
      this.twitterConnecting = true

      try {
        await this.twitterRequest()
      }
      catch (e) {
        const msg = (e.response.data && e.response.data.message)
          ? e.response.data.message
          : 'Failed to register'

        this.$toasted.error(msg, { duration : 6000 })
        this.twitterConnecting = false
        this.loading = false
      }
    },
  },
}
</script>

<style scoped lang="stylus">
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

</style>
