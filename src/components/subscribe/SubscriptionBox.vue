<template>
  <div>
    <h3>Subscribe to Software Daily</h3>
    <p>Get ad-free episodes</p>
    <div class="switch-section">
      <span class="option">Bill monthly</span>
      <switch-toggle v-model="checked" />
      <span class="option">Bill yearly (save 20%!)</span>
    </div>
    <div class="subscription-box" v-on:click="signUpForSubscription" >
      <h5>Software Daily Podcast Subscription</h5>
      <div class="details-price">
        <div class="price"><b v-if="!checked">$10</b><b v-else>$100</b> month</div>
        <div>billed yearly</div>
      </div>
      <div><button class="btn-default">subscribe</button></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SwitchToggle from '@/components/SwitchToggle'
import { selectSubscriptionPlan } from '@/utils/subscription.utils.js'

export default {
  data: function () {
      return {
        checked: false
      }
  },
  components: { SwitchToggle },
  methods: {
    signUpForSubscription () {
      // if logged in
      let planType
      if (this.checked) {
        planType = 'yearly'
      } else {
        planType = 'monthly'
      }
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
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn'])
  }
}
</script>

<style lang="stylus" scoped>
.switch-section
  display flex
  justify-content center
  align-items center
  span
    margin -10px 20px 0 20px
    font-weight bold
.subscription-box
  margin 20px auto 10px auto
  max-width 270px
  padding 30px 30px
  border 1px solid #dee2e6
  border-radius 2px
  display flex
  flex-direction column
  cursor pointer
  .details-price
    margin 10px 0 20px 0
    .price
      font-size 1.6rem
  .btn-default
    padding 8px 30px
    border-radius 3px
    font-size 1.03rem
    color #fff
    background-color #222
    text-transform uppercase
    text-decoration none !important
    transition all .2s
    font-weight 400
  &:hover
    .btn-default
      background-color #a591ff
      transform scale(1.02)
.option
  width 150px
  @media (max-width 800px)
    width 100px
  &:first-child
    text-align right
    margin-right 23px
</style>
