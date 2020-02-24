<template>
  <div v-if="!alreadySubscribed" class="subscribe-container">
    <h3>Subscribe to Software Daily</h3>
    <p>Get ad-free episodes</p>
    <div class="switch-section">
      <span class="option">Bill monthly</span>
      <switch-toggle v-model="checked" />
      <span class="option">Bill yearly (save 20%!)</span>
    </div>
    <div class="subscription-box" v-on:click="signUpForSubscription">
      <h5>Software Daily Podcast Subscription</h5>
      <div class="details-price">
        <div v-if="!checked" class="price">
          <b>$10</b> /month
        </div>
        <div v-else class="price">
          <b>$100</b> /year
        </div>
      </div>
      <button class="btn-default">subscribe</button>
    </div>
    <p class="footer-message">
      Want more information? Visit our <router-link to="/premium"><b>Subscription Page</b></router-link>
    </p>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
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
        this.$router.push('/subscribe')
      } else {
        // Redirect to  sign up page, then redirect to Subscription
        // OR at least show a banner
        selectSubscriptionPlan(planType)
        this.$router.push('/register')
      }
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      alreadySubscribed(state) {
        if (!this.isLoggedIn) return false;
        if (state.me && state.me.subscription && state.me.subscription.active) {
          return true;
        } else {
          return false;
        }
      },
      avatarUrl(state) {
        return state.me.avatarUrl || state.placeholderAvatar;
      },
    })
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

.subscribe-container
  margin 120px 0 60px
  font-size .8rem
  display flex
  flex-direction column
  text-align center
  align-items center

  @media (max-width 1000px)
    .footer-message
      font-size .7rem
      a
        color #222 !important
</style>
