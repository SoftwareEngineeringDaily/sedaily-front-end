<template>
  <div id='app' class='subscribe-view'>
    <div v-if="loadingUser">

      <spinner :show="loadingUser"></spinner>
    </div>
    <div v-if="alreadySubscribed">
      <br />
      <h1> You are subscribed :) </h1>
      <br />
      <p>
      Your subscription started: {{dateSubscriptionStarted}}
      <br />
      Your plan: {{subscribedToPlan}}
      </p>
      <br />
      <br />

      <div v-if="processing">
        Canceling...
        <spinner :show="processing"></spinner>
      </div>
      <div v-else>

      <h3>
         Checkout the latest episodes:  <router-link to="/" name="home" class="link">here</router-link>.

       </h3>
       <br />
      <div><h2> {{error}} </h2> </div>
      <div><h2 class='success-msg'> {{successSubscribingMessage}} </h2>

       </div>

      <button v-if="justCancelled === false"   class="cancel-button" @click="cancelSubscriptionClicked">
        Cancel Your Subscription
      </button>

      <br />
      <br />
      <h4> Cancelling?</h4>
      <p>
      Your subscription will be cancelled right away and you won't be charged again
      but you will lose access to the premium content right away.
      Contact jeff@softwaredaily.com for any questions.
      </p>
    </div>
    </div>

    <div v-else>
      <h1 class='main-title'> Subscribe </h1>

      <input type="radio" id="monthly" value="monthly" v-model="planType">
      <label for="one">Monthly  ($10 / month )</label>
      <br>
      <input type="radio" id="yearly" value="yearly" v-model="planType">
      <label for="two">Yearly  ($100 / year ) </label>
      <br>

      <h3 class='secondary-title'>Please provide your payment details:</h3>
      <br />
      <card class='stripe-card'
      :class='{ complete }'
      :stripe='stripePublicKey'
      :options='stripeOptions'
      @change='complete = $event.complete'
      />
      <div><h2> {{error}} </h2> </div>
      <div v-if="processing">
        Submitting...
        <spinner :show="processing"></spinner>
      </div>
      <div v-else>
        <button class='pay-with-stripe pay-button' @click='pay' :disabled='!complete'>Pay with credit card</button>
        <div><h2> {{successSubscribingMessage}} </h2> </div>

      </div>

      <img class="icon" src="../assets/powered_by_stripe.png" />
    </div>

  </div>
</template>

<script>
// import { stripeKey, stripeOptions } from './stripeConfig.json'
import moment from 'moment'
import { Card, createToken } from 'vue-stripe-elements-plus'
import { mapActions, mapState, mapGetters } from 'vuex'
import Spinner from '../components/Spinner.vue'
import { wantedToSubscribe, preSelectedSubscriptionPlan, unselectSubscriptionPlan } from '../utils/subscription.utils.js'

export default {
  props: {
    stripePublicKey: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      complete: false,
      planType: 'monthly',
      loadingUser: false,
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

  beforeMount () {
    if (!this.isLoggedIn) {
      // If user is not logged in we should show
      this.$router.replace('/premium')
    } else {
      if (!this.alreadySubscribed) {
        if (wantedToSubscribe()) {
          this.planType = preSelectedSubscriptionPlan()
        }
      } else {
      // Already subbed
        unselectSubscriptionPlan()
      }
    }
  },

  components: { Card, Spinner },

  methods: {
    ...mapActions(['createSubscription', 'cancelSubscription']),
    pay () {
      this.error = null
      this.justCancelled = false
      this.processing = true
      // createToken returns a Promise which resolves in a result object with
      // either a token or an error key.
      // See https://stripe.com/docs/api#tokens for the token object.
      // See https://stripe.com/docs/api#errors for the error object.
      // More general https://stripe.com/docs/stripe.js#stripe-create-token.
      createToken().then(data => {
        // console.log(data.token)
        const stripeToken = data.token.id
        const { planType } = this
        return this.createSubscription({ stripeToken, planType })
      })
        .then((result) => {
        // Successfully created subscription:
          this.processing = false
          this.justSubscribed = true
          this.successSubscribingMessage = 'Thanks for subscribing!'
          unselectSubscriptionPlan()
        })
        .catch((error) => {
        // First we set it just in case as backup
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
          unselectSubscriptionPlan()
        })
    },

    cancelSubscriptionClicked () {
      this.error = null
      this.processing = true
      this.justCancelled = false
      return this.cancelSubscription()
        .then((result) => {
          this.processing = false
          this.justSubscribed = false
          console.log('cancel subscription')
          this.justCancelled = true
          this.successSubscribingMessage = 'Your subscription has been cancelled.'
        })
        .catch((error) => {
          console.log('error', error)
          this.processing = false
          // this.justSubscribed = false
          this.error = 'There seems to have been a problem canceling your subscription. Please contact jeff@softwaredaily.com'
        })
    }
  },

  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      alreadySubscribed (state) {
        if (this.justSubscribed) return true
        if (state.me && state.me.subscription && state.me.subscription.active) {
          return true
        } else {
          return false
        }
      },

      subscribedToPlan (state) {
        if (this.justCancelled) return 'cancelled'
        if (this.justSubscribed) return this.planType
        if (state.me && state.me.subscription && state.me.subscription.active) {
          return state.me.subscription.planFrequency
        } else {
          return ''
        }
      },

      dateSubscriptionStarted (state) {
        if (this.justSubscribed) return 'Today'
        if (state.me && state.me.subscription && state.me.subscription.active) {
          const startDate = state.me.subscription.dateCreated
          return moment(startDate).format('MMMM Do, YYYY')
        } else {
          return 'Loading...'
        }
      },

      me (state) {
        return state.me
      }
    })
  }
}
</script>

<style lang="stylus">
@import './../css/variables'
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
