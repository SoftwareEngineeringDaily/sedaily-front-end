<template>
  <div id='app'>
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
    <button class='pay-with-stripe pay-button' @click='pay' :disabled='!complete'>Pay with credit card</button>

  </div>
</template>

<script>
// import { stripeKey, stripeOptions } from './stripeConfig.json'
import { Card, createToken } from 'vue-stripe-elements-plus'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      complete: false,
      error: null,
      stripeOptions: {
        hidePostalCode: false
        // see https://stripe.com/docs/stripe.js#element-options for details
      }
    }
  },

  components: { Card },

  methods: {
    ...mapActions(['createSubscription']),
    pay () {
      // TODO: GET subscription

      // createToken returns a Promise which resolves in a result object with
      // either a token or an error key.
      // See https://stripe.com/docs/api#tokens for the token object.
      // See https://stripe.com/docs/api#errors for the error object.
      // More general https://stripe.com/docs/stripe.js#stripe-create-token.
      createToken().then(data => {
        // console.log(data.token)
        const stripeToken = data.token.id
        this.createSubscription({stripeToken})
        .then((result) => {
          console.log('result')
          console.log('result', result)
        })
        .catch((error) => {
          console.log('error', error)
          this.error = 'There seems to have been a problem creating your subscription. Please contact jeff@softwaredaily.com'
        })
        // We want : stripeToken tok_1BQj6ULmlLorKKLQ6xoRYTHR
        // console.log(data)
      })
    }
  }
}
</script>


<style>
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
