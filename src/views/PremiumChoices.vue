<template>
  <div class="container">

    <!--
    <div class="row">

      <div class="col-md-12 text-center subscribe-logo">
        <img width="60%" src="https://s3-us-west-2.amazonaws.com/sd-profile-pictures/SED_Logo_Vector.svg"/>
      </div>
    </div> -->

    <div class="row">
      <div class="col-md-12 text-center">
        <h1>Subscribe</h1>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12 text-center">
        <h3>Get ad-free episodes and premium content</h3>
      </div>
    </div>

    Monthly
    <button @click="signUpForSubscriptionMonthly"> Get Started </button>
    Yearly
    <button @click="signUpForSubscriptionYearly"> Get Started </button>
    <div>
      <h3>Why Subscribe?</h3>
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

<style scoped>
h1 {
  font-size: 4rem;
  
}
.container {
  background: white;
  padding: 30px;
	box-shadow: 0 0.5px 0 0 #ffffff inset, 0 1px 2px 0 #B3B3B3;
}
</style>
