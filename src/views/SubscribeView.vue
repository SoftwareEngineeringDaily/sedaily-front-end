<template>
<v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
  <div id='app'>
    <div v-if="loadingUser">
      <spinner :show="loadingUser"></spinner>
    </div>
    <div v-if="alreadySubscribed">
      <br />
      <h1> You are subscribed :) </h1>
      Your subscription started: {{dateSubscriptionStarted}}
      <br />
      Your plan: {{subscribedToPlan}}
      <br />
      <br />

      <div v-if="processing">
        Canceling...
        <spinner :show="processing"></spinner>
      </div>
      <div v-else>

      <h3>
         Checkout the latest episodes:  <router-link to="/" name="home">here</router-link>.
       </h3>
       <br />
      <div><h2> {{error}} </h2> </div>
      <div><h2> {{successSubscribingMessage}} </h2>

       </div>

      <v-btn v-if="justCancelled === false" class="cancel-button" @click="cancelSubscriptionClicked">
        Cancel Your Subscription
      </v-btn>
      <p>
      <h4> Cancelling?</h4>
      Your subscription will be cancelled right away and you won't be charged again
      but you will lose access to the premium content right away.
      Contact jeff@softwaredaily.com for any questions.
      </p>
    </div>
    </div>

    <div v-else>
      <h1> Subscribe </h1>

      <v-radio-group v-model="planType" :mandatory="true">
        <v-radio label="Monthly ($10 / month)" value="monthly" />
        <v-radio label="Yearly ($100 / year)" value="yearly" />
      </v-radio-group>

      <h3>Please provide your payment details:</h3>
      <br />
      <card class='stripe-card'
        :class='{ complete }'
        stripe='pk_test_RayhhznsRXj6hqZ8SnKJY70Y'
        :options='stripeOptions'
        @change='complete = $event.complete'
        />
      <div><h2> {{error}} </h2> </div>
      <div v-if="processing">
        Submitting...
        <spinner :show="processing"></spinner>
      </div>
      <div v-else>
        <v-btn class='pay-with-stripe pay-button' @click='pay' :disabled='!complete'>Pay with credit card</v-btn>
        <div><h2> {{successSubscribingMessage}} </h2> </div>
      </div>
    </div>
  </div>
</v-flex>
</template>

<script>
// import { stripeKey, stripeOptions } from './stripeConfig.json'
import moment from 'moment'
import { Card, createToken } from 'vue-stripe-elements-plus'
import { mapActions, mapState, mapGetters } from 'vuex'
import Spinner from '../components/Spinner.vue'
import { wantedToSubscribe, preSelectedSubscriptionPlan, unselectSubscriptionPlan } from '../utils/subscription.utils.js'

export default {
  data () {
    return {
      complete: false,
      planType: 'monthly',
      loadingUser: true,
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
      this.fetchMyProfileData()
        .then((myData) => {
          console.log('myData', myData)
          this.loadingUser = false
          if (!this.alreadySubscribed) {
            if (wantedToSubscribe()) {
              this.planType = preSelectedSubscriptionPlan()
            }
          } else {
            unselectSubscriptionPlan()
          }
        })
        .catch((error) => {
          alert('Error loading user info.')
          console.log('error loading user', error)
        })
    }
  },

  components: { Card, Spinner },

  methods: {
    ...mapActions(['createSubscription', 'fetchMyProfileData', 'cancelSubscription']),
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
        return this.createSubscription({stripeToken, planType})
      })
        .then((result) => {
        // Successfully created subscription:
          this.processing = false
          this.justSubscribed = true
          this.successSubscribingMessage = 'Thanks for subscribing!'
          unselectSubscriptionPlan()
        })
        .catch((error) => {
          console.log('error', error)
          this.processing = false
          this.error = 'There seems to have been a problem creating your subscription. Please contact jeff@softwaredaily.com'
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

<style lang="stylus" scoped>
.cancel-button
  background #e8e8e8
  padding 9px 14px
  margin 17px 0px
  border 1px solid black

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
  border-color green

</style>
