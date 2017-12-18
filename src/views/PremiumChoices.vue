<template>
  <div>
    <h1>Subscribe</h1>
    Monthly
    <button @click="signUpForSubscriptionMonthly"> Get Started </button>
    Yearly
    <button @click="signUpForSubscriptionYearly"> Get Started </button>
    <div>
      <h3>Why Premium?</h3>
      <p>
        Blah
      </p>
    </div>
    <div>
      <h3> Frequently Asked Questions </h3>
    </div>
  </div>


</template>

<script>

import { mapGetters } from 'vuex'
import { selectSubscriptionPlan } from '../utils/subscription.utils.js'
console.log('subs plan', selectSubscriptionPlan)
export default {
  methods: {
    signUpForSubscriptionYearly () {
      this.signUpForSubscription('yearly')
    },

    signUpForSubscriptionMonthly () {
      this.signUpForSubscription('monthly')
    },

    signUpForSubscription (planType) {
      // if logged in
      if (this.isLoggedIn) {
        selectSubscriptionPlan(planType)
        // Redirect to subscription cc page:
        this.$router.replace('/subscribe')
      } else {
        // Redirect to  sign up page, then redirect to Subscription
        // OR at least show a banner
        selectSubscriptionPlan(planType)
        this.$router.replace('/register')
      }

      // else
      //  We need to take the user to logged in route
    }

  },

  computed: {
    ...mapGetters(['isLoggedIn'])
  }
}

</script>

<style>
</style>
