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
  <div class="col-md-offset-2 col-md-6 text-center">
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
  <div class="col-md-12 text-center why-subscribe-title">

    <h3>Why Subscribe?</h3>
  </div>
  <div class="col-md-12 why-subscribe-inner">
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
</div>
<div class='row faq'>
  <h3> Frequently Asked Questions </h3>
  <br />
  <div class='question'>
    <h4 class="question-title">
      How do I listen to ad free episodes?
    </h4>
    <p class="question-answer">
      Download the Software Engineering Daily app for <a href="https://itunes.apple.com/us/app/software-engineering-daily-podcast-app/id1253734426?ls=1&mt=8" target="_blank"> iOS </a> or <a href="https://play.google.com/store/apps/details?id=com.koalatea.thehollidayinn.softwareengineeringdaily" target="_blank">Android</a>, or go to softwaredaily.com and login.
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
      You’ll need a credit card to sign up for a subscription. Payments are handled through stripe.
    </p>
  </div>


  <div class='question'>
    <h4 class="question-title">
      How do I cancel my subscription?
    </h4>
    <p class="question-answer">
      You can cancel your subscription at any time. Visit your subscription settings to cancel.
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


</div>

</div>


</template>

<script>
import { mapGetters } from 'vuex'
import { selectSubscriptionPlan } from '../utils/subscription.utils.js'

export default {
  computed: {
    ...mapGetters([
      'isLoggedIn'
    ]),

    appUrl () {
      return {
        ios: 'https://itunes.apple.com/us/app/software-engineering-daily-podcast-app/id1253734426?ls=1&mt=8',
        android: 'https://play.google.com/store/apps/details?id=com.koalatea.thehollidayinn.softwareengineeringdaily'
      }
    }
  },
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

  }
}
</script>

<style scoped lang="stylus">
@import './../css/variables'

h1
  font-size 4rem

.subtitle
  margin-top 20px
  margin-bottom 50px

.price
  margin 20px 0

.dollars
  font-size 4rem

.billed-terms
  display block
  font-size 2rem

button
  margin 20px
  padding 15px 20px
  min-width 200px
  border none
  border-radius 3px
  background primary-color
  color #FFF
  text-align center
  text-transform uppercase
  letter-spacing 4px
  transition all .5s ease
  font-size 16px
  cursor pointer

button:hover
  box-shadow 0 20px 5px -10px rgba(#000, 0.3)
  transform translateY(10px)

.monthly-button
  background #dcdcdd
  color #000

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
  margin 20px 0

.question-title
  margin 20px 0

.container
  background white
  padding 30px

</style>
