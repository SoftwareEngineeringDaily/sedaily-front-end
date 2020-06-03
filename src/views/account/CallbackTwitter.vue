<template>
  <div class="container">
    <div v-if="twitterConnecting">
      <i class="fa fa-twitter fa-5x" />
      <p><strong>Logging In</strong></p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { getQuery } from '@/utils/link.utils'
import { wantedToSubscribe } from '@/utils/subscription.utils'
import Spinner from '@/components/Spinner'

export default {
  name: 'callback-twitter',

  components: {
    Spinner
  },

  data () {
    return {
      twitterConnecting: true,
      loading: false,
    }
  },

  async mounted () {
    const oauth_token = getQuery('oauth_token')
    const oauth_verifier = getQuery('oauth_verifier')

    if (!oauth_token || !oauth_verifier) {
      return this.$router.push(this.isLoggedIn ? '/' : '/register')
    }

    this.twitterConnecting = true
    this.loading = true

    try {
      await this.twitterAccess({
        oauth_token,
        oauth_verifier
      })

      this.fetchMyProfileData()

      if (wantedToSubscribe()) {
        this.$router.push('/subscribe')
      } else {
        this.$router.push('/')
      }
    }
    catch (e) {
      const msg = (e.response.data && e.response.data.message)
        ? e.response.data.message
        : 'Failed to register'

      this.$toasted.error(msg, { duration : 6000 })
    }

    this.loading = false
  },

  methods: {
    ...mapActions([
      'twitterAccess',
      'fetchMyProfileData',
    ]),
  },

  computed: {
    ...mapGetters([
      'isLoggedIn'
    ])
  }
}
</script>

<style scoped lang="stylus">
@import '../../css/variables'

@keyframes bounce {
  0% {
    transform: translateY(5px)
  }
  50% {
    transform translateY(-5px)
  }
  100% {
    transform translateY(4px)
  }
}

.container
  padding 4rem 0
  text-align center
  color #1da1f2

.fa-twitter
  margin-bottom 1rem
  animation bounce 2s ease-in-out 0s infinite

.break
  display: block;
  position: relative;
  margin: 2rem 0;
  text-align: center;
  text-transform: uppercase;
  border-bottom: 1px solid #e9ecef;

  &:before
    content: attr(name);
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 0 1rem;
    background-color: #ffffff;
    transform: translate(-50%, -50%);

</style>
