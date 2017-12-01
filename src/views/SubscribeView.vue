<template>
  <div id='app'>
    <div v-if="loadingUser">
      <spinner :show="loadingUser"></spinner>
    </div>
    <div v-if="alreadySubscribed">
      <br />
      <h1> You are already subscribed :) </h1>
      <br />
      <br />

      <div v-if="processing">
        Canceling...
        <spinner :show="processing"></spinner>
      </div>
      <div v-else="processing">
        
      <button class="cancel-button" @click="cancelSubscriptionClicked">
        Cancel Your Subscription
      </button>
    </div>
    </div>

    <div v-else="alreadySubscribed">
      <h1> Subscribe </h1>
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
        <button class='pay-with-stripe pay-button' @click='pay' :disabled='!complete'>Pay with credit card</button>
        <div><h2> {{successSubscribingMessage}} </h2> </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { stripeKey, stripeOptions } from './stripeConfig.json'
import { Card, createToken } from 'vue-stripe-elements-plus'
import { mapActions, mapState } from 'vuex'
import Spinner from '../components/Spinner.vue'

export default {
  data () {
    return {
      complete: false,
      loadingUser: true,
      processing: false,
      successSubscribingMessage: null,
      justSubscribed: false,
      error: null,
      stripeOptions: {
        hidePostalCode: false
        // see https://stripe.com/docs/stripe.js#element-options for details
      }
    }
  },

  beforeMount () {
    this.fetchMyProfileData()
    .then((myData) => {
      console.log('myData', myData)
      this.loadingUser = false
    })
    .catch((error) => {
      alert('Error loading your uer')
      console.log('error loading user', error)
    })
  },

  components: { Card, Spinner },

  methods: {
    ...mapActions(['createSubscription', 'fetchMyProfileData', 'cancelSubscription']),
    pay () {
      this.processing = true
      // createToken returns a Promise which resolves in a result object with
      // either a token or an error key.
      // See https://stripe.com/docs/api#tokens for the token object.
      // See https://stripe.com/docs/api#errors for the error object.
      // More general https://stripe.com/docs/stripe.js#stripe-create-token.
      createToken().then(data => {
        // console.log(data.token)
        const stripeToken = data.token.id
        return this.createSubscription({stripeToken})
      })
      .then((result) => {
        // Successfully created subscription:
        this.processing = false
        this.justSubscribed = true
        this.successSubscribingMessage = 'Thanks for subscribing!'
      })
      .catch((error) => {
        console.log('error', error)
        this.processing = false
        this.error = 'There seems to have been a problem creating your subscription. Please contact jeff@softwaredaily.com'
      })
    },

    cancelSubscriptionClicked () {
      this.processing = true
      return this.cancelSubscription()
      .then((result) => {
        this.processing = false
        this.justSubscribed = false
        console.log('cancel subscription')
        this.successSubscribingMessage = 'Your subscription has been cancelled.'
      })
      .catch((error) => {
        console.log('error', error)
        this.processing = false
        this.error = 'There seems to have been a problem canceling your subscription. Please contact jeff@softwaredaily.com'
      })
    }
  },
  computed: {
    ...mapState({
      alreadySubscribed (state) {
        if (this.justSubscribed) return true
        if (state.me && state.me.subscription && state.me.subscription.active) {
          return true
        } else {
          return false
        }
      },
      me (state) {
        return state.me
      }
    })
  }
}
</script>

<style>

.cancel-button {
  background: #e8e8e8;
  padding: 9px 14px;
  margin: 17px 0px;
  border: 1px solid black;
}

.pay-button {
  background: #ceffa8;
  padding: 9px 14px;
  margin: 17px 0px;
  border: 2px solid #33ff00;
  box-shadow: 1px 1px 2px #888888;
}
.pay-button:disabled {
  background: #e8e8e8;
  padding: 9px 14px;
  margin: 17px 0px;
  border: 1px solid #b9b9b9;
  opacity: 0.3;
}

.stripe-card {
  width: 300px;
  border: 1px solid grey;
}
.stripe-card.complete {
  border-color: green;
}
</style>
