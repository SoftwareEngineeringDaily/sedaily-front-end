<template>
<v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
  <v-container fluid>
    <v-layout row>
      <v-flex xs12 class="text-xs-center">
        <h1>Subscribe</h1>
        <h3 class="subtitle">Get ad-free episodes and premium content</h3>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs6 class="text-xs-center">
        <h4 class="plan-name"> Monthly </h4>
        <h4 class="price"> <span class="dollars"> $10 </span>  / mo </h4>
        <span class="billed-terms"> billed monthly </span>
        <v-btn @click.prevent="signUpForSubscriptionMonthly" class="monthly-button"> Get Started </v-btn>
      </v-flex>
      <v-flex xs6 class="text-xs-center">
        <h4 class="plan-name">Yearly</h4>
        <h4 class="price"> <span class="dollars"> $100 </span> / yr  </h4>
        <span class="billed-terms"> billed yearly </span>
        <v-btn @click="signUpForSubscriptionYearly" primary> Get Started </v-btn>
      </v-flex>
    </v-layout>
    
    <v-layout row class="why-subscribe">
      <v-flex xs12>
        <div class="text-xs-center mt-3">
          <h2 class="why-subscribe-title">Why Subscribe?</h2>
        </div>
        
        <div class="why-subscribe-inner">
          <br />
          <p>
            For 2.5 years, our business model has been to sell advertisements in exchange for exposure on the podcast. We love our sponsors, and believe in the products that we promote. But we want to give listeners the ability to opt out of advertisements.
          </p>
          <p>
            When you subscribe to Software Engineering Daily, you are supporting us and enabling us to think bigger about what Software Engineering Daily could become.
          </p>
          <p>
            We are investing heavily in both content and new products. We would like to invest more, and hope you will help us.
          </p>
        </div>
      </v-flex>
    </v-layout>

    <v-layout column class="faq">
      <h3> Frequently Asked Questions </h3>
      <br />
      <div class='question'>
        <h4 class="question-title">
          How do I listen to ad free episodes?
        </h4>
        <p class="question-answer">
          Download the Software Engineering Daily app for <a rel="noopener" href="https://itunes.apple.com/us/app/software-engineering-daily-podcast-app/id1253734426?ls=1&mt=8" target="_blank"> iOS </a> or <a href="https://play.google.com/store/apps/details?id=com.koalatea.thehollidayinn.softwareengineeringdaily" rel="noopener" target="_blank">Android</a>, or go to softwaredaily.com and login.
        </p>
      </div>

      <div class='question'>
        <h4 class="question-title">
          What premium content are you offering?
        </h4>
        <p class="question-answer">
          Audio episodes that are only available to subscribers. The first premium episode is planned for January 2018. We will have other value-add features of a premium subscription over time.
        </p>
      </div>

      <div class='question'>
        <h4 class="question-title">
          Why didn't you do Patreon?
        </h4>
        <p class="question-answer">
          We did set up a Patreon account, but never promoted it. We didn't configure any premium offerings, and it was mixed messaging to have advertising and ask for donations.
        </p>
      </div>

      <div class='question'>
        <h4 class="question-title">
          How does payment work for a subscription?
        </h4>
        <p class="question-answer">
          You’ll need a credit card to sign up for a subscription. Payment’s are handled through stripe.
        </p>
      </div>

      <div class='question'>
        <h4 class="question-title">
          How do I cancel my subscription?
        </h4>
        <p class="question-answer">
          You can cancel your subscription at anytime. Visit your subscription settings to cancel.
        </p>
      </div>

      <div class='question'>
        <h4 class="question-title">
          Have more questions?
        </h4>
        <p class="question-answer">
          Feel free to contact us at jeff@softwaredaily.com if you have any more questions.
        </p>
      </div>
    </v-layout>
  </v-container>
</v-flex>
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

<style lang="stylus" scoped>
h1 
  font-size 4rem

.subtitle 
  margin-top 20px
  margin-bottom 50px

.plan-name 
  font-size

.price 
  margin 20px 0

.dollars 
  font-size 4rem

.billed-terms 
  display block
  font-size 2rem

button 
  margin 20px
  padding 5px 0
  min-width 200px
  transition opacity 0.2s

.monthly-button 
  border 1px solid black

.yearly-button 
  background #3f58af
  color white

.container 
  background white
  padding 30px
	box-shadow 0 0.5px 0 0 #ffffff inset, 0 1px 2px 0 #B3B3B3

.why-subscribe-title 
  margin 0 auto
  margin-top 50px
  max-width 80%

.why-subscribe-inner 
  margin  30px auto
  max-width 80%

.why-subscribe 
  margin 50px auto
  background #F6F6F6

.faq 
  max-width 80%
  margin auto

.question 
  margin 10px 0


</style>
