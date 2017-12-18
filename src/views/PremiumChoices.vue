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
    <h3 class="subtitle">Get ad-free episodes and premium content</h3>
  </div>
</div>


<div class="row text-center">
  <div class="col-md-offset-2 col-md-5 text-center">
    <h4 class="plan-name"> Monthly </h4>
    <h4 class="price"> <span class="dollars"> $10 </span>  / mo </h4>
    <span class="billed-terms"> billed monthly </span>
    <button @click="signUpForSubscriptionMonthly" class="monthly-button"> Get Started </button>
  </div>

  <div class="col-md-5 text-center yearly-plan">
    <h4 class="plan-name">Yearly</h4>
    <h4 class="price"> <span class="dollars"> $100 </span> / yr  </h4>
    <span class="billed-terms"> billed yearly </span>
    <button @click="signUpForSubscriptionYearly" class="yearly-button"> Get Started </button>
  </div>

</div>


<div class="row why-subscribe">
  <div class="col-md-12 text-center why-subscribe-inner">
    <h3>Why Subscribe?</h3>
    <br />
    <p>
      For 2.5 years, our business model has been to sell advertisements in exchange for exposure on the podcast. We love our sponsors, and believe in the products that we promote. But we want to give listeners the ability to opt out of advertisements.
    </p>
  </div>
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
.yearly-plan {
}
.subtitle {
  margin-top: 20px;
  margin-bottom: 50px;
}

.plan-name {
  font-size:
}
.price {
  margin: 20px 0;
}

.dollars {
  font-size: 4rem;
}

.billed-terms {
  display: block;
  font-size: 2rem;
}


button {
  margin: 20px;
  padding: 5px 0;
  min-width: 200px;
  transition: width 3s;
}
button:hover {
  width: 220px;
}
.monthly-button {
  border: 1px solid black;
}

.yearly-button {
  background: #3f58af;
  color: white;
}
.container {
  background: white;
  padding: 30px;
	box-shadow: 0 0.5px 0 0 #ffffff inset, 0 1px 2px 0 #B3B3B3;
}

.why-subscribe-inner {
  margin: 50px auto;
  max-width: 80%;
}

.why-subscribe {
  margin: 50px auto;
  background: #F6F6F6;
}
</style>
