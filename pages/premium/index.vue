<template>
  <div
    id="app"
    class="subscribe-view">
    <div v-if="alreadySubscribed">
      <br>
      <h1> You are subscribed :) </h1>
      <br>
      <div>
        Your subscription started: {{ dateSubscriptionStarted }}
        <br>
        Your plan: {{ subscribedToPlan }}
      </div>
      <br>
      <br>

      <div v-if="processing">
        Canceling...
        <spinner :show="processing" />
      </div>
      <div v-else>
        <h3>
          Checkout the latest episodes:  <nuxt-link
            to="/"
            name="home"
            class="link">here</nuxt-link>.
        </h3>
        <br>
        <div><h2> {{ error }} </h2> </div>
        <div><h2 class="success-msg"> {{ successSubscribingMessage }} </h2></div>

        <button
          v-if="justCancelled === false"
          class="cancel-button"
          @click="cancelSubscriptionClicked">
          Cancel Your Subscription
        </button>

        <br>
        <br>
        <h4> Cancelling?</h4>
        <div>
          Your subscription will be cancelled right away and you won't be charged again
          but you will lose access to the premium content right away.
          Contact jeff@softwaredaily.com for any questions.
        </div>
      </div>
    </div>

    <div v-else>
      <h1 class="main-title"> Subscribe </h1>

      <input
        id="monthly"
        v-model="planType"
        type="radio"
        value="monthly">
      <label for="one">Monthly  ($10 / month )</label>
      <br>
      <input
        id="yearly"
        v-model="planType"
        type="radio"
        value="yearly">
      <label for="two">Yearly  ($100 / year ) </label>
      <br>

      <h3 class="secondary-title">Please provide your payment details:</h3>
      <br>
      <card
        :class="{ complete }"
        :stripe="stripePublicKey"
        :options="stripeOptions"
        class="stripe-card"
        @change="complete = $event.complete" />

      <div><h2> {{ error }} </h2> </div>
      <div v-if="processing">
        Submitting...
        <spinner :show="processing" />
      </div>
      <div v-else>
        <button
          :disabled="!complete"
          class="pay-with-stripe pay-button"
          @click="pay">Pay with credit card</button>
        <div><h2> {{ successSubscribingMessage }} </h2> </div>
      </div>

      <img
        class="icon"
        src="~/assets/powered_by_stripe.png">
    </div>
  </div>
</template>

<script>
import config from '../../config'
import moment from 'moment'
import { Card, createToken } from 'vue-stripe-elements-plus'
import { mapActions, mapState, mapGetters } from 'vuex'
import Spinner from '~/components/Spinner.vue'
import { wantedToSubscribe, preSelectedSubscriptionPlan, unselectSubscriptionPlan } from '~/utils/subscription.utils.js'

export default {
  middleware: 'auth',
  components: { Card, Spinner },
  data () {
    return {
      complete: false,
      planType: 'monthly',
      processing: false,
      successSubscribingMessage: null,
      justSubscribed: false,
      justCancelled: false,
      error: null,
      stripeOptions: {
        hidePostalCode: false
        // see https://stripe.com/docs/stripe.js#element-options for details
      }
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      me ({ auth }) {
        return auth ? auth.user : null
      },

      alreadySubscribed (state) {
        if (this.justSubscribed) return true
        if (this.me && this.me.subscription && this.me.subscription.active) {
          return true
        } else {
          return false
        }
      },

      subscribedToPlan (state) {
        if (this.justCancelled) return 'cancelled'
        if (this.justSubscribed) return this.planType
        if (this.me && this.me.subscription && this.me.subscription.active) {
          return this.me.subscription.planFrequency
        } else {
          return ''
        }
      },

      dateSubscriptionStarted (state) {
        if (this.justSubscribed) return 'Today'
        if (this.me && this.me.subscription && this.me.subscription.active) {
          const startDate = this.me.subscription.dateCreated
          return moment(startDate).format('MMMM Do, YYYY')
        } else {
          return 'Loading...'
        }
      }
    })
  },
  asyncData ({ store, isDev }) {
    const env = isDev ? 'development' : 'production'
    const stripePublicKey = config.getApiConfig(env).STRIPE_PUBLIC_KEY
    let planType = 'monthly'

    if (!(store.state.me && 
      store.state.me.subscription && 
      store.state.me.subscription.active)) {
      if (wantedToSubscribe(store)) {
        planType = preSelectedSubscriptionPlan(store)
      }
    } else {
    // Already subbed
      unselectSubscriptionPlan(store)
    }

    return {
      planType,
      stripePublicKey
    }
  },

  methods: {
    async pay () {
      this.error = null
      this.justCancelled = false
      this.processing = true
      // createToken returns a Promise which resolves in a result object with
      // either a token or an error key.
      // See https://stripe.com/docs/api#tokens for the token object.
      // See https://stripe.com/docs/api#errors for the error object.
      // More general https://stripe.com/docs/stripe.js#stripe-create-token.
      const data = await createToken()
      // console.log(data.token)
      const stripeToken = data.token.id
      const { planType } = this

      try {
        const subscriptionResult = await this.$axios.post('/subscription', { stripeToken, planType })
        // Successfully created subscription:
        this.processing = false
        this.justSubscribed = true
        this.successSubscribingMessage = 'Thanks for subscribing!'
        unselectSubscriptionPlan(this.$store)
        // Ghetto, to update to Navbar menu button
        this.$auth.fetchUser()
      } catch (error) {
        this.processing = false
        this.error = 'There seems to have been a problem creating your subscription. Please contact jeff@softwaredaily.com'
        // Then we get the error msg:
        try {
          const errorMsg = error.response.data.message
          console.log('error', errorMsg)
          this.error = `${errorMsg} We were not able to start your subscription. Please contact for any questions. jeff@softwaredaily.com`
        } catch (e) {
        }
        // Probably don't need to do this but should:
        unselectSubscriptionPlan(this.$store)
      }
    },

    async cancelSubscriptionClicked () {
      this.error = null
      this.processing = true
      this.justCancelled = false

      try {
        await this.$axios.delete('/subscription')

        this.processing = false
        this.justSubscribed = false
        console.log('cancel subscription')
        this.justCancelled = true
        this.successSubscribingMessage = 'Your subscription has been cancelled.'
        // Ghetto, to update to Navbar menu button
        this.$auth.fetchUser()
      } catch (_) {
        console.log('error', error)
        this.processing = false
        // this.justSubscribed = false
        this.error = 'There seems to have been a problem canceling your subscription. Please contact jeff@softwaredaily.com'
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/variables'
.success-msg
  margin-top 30px
.subscribe-view
  padding 20px
  h1,h2,h3,h4
    font-weight 200
  .main-title
    margin 30px 0
  .secondary-title
    margin 20px 0

.cancel-button
  cursor pointer
  background white
  padding 9px 14px
  margin 17px 0px
  border 1px solid black
  border-radius 3px

.pay-button
  background #ceffa8
  padding 9px 14px
  margin 17px 0px
  border 2px solid #33ff00
  box-shadow 1px 1px 2px #888888

.pay-button:disabled
  background #e8e8e8
  padding 9px 14px
  margin 17px 0px
  border 1px solid #b9b9b9
  opacity 0.3

.stripe-card
  width 300px
  border 1px solid grey

.stripe-card.complete
  border-color primary-color
</style>
