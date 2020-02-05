<template>
  <div class="subscribe-container">
    <subscribe-box />
    <p class="footer-message">Want more information? Visit our <router-link to="/premium"><b>Subscription Page</b></router-link></p>
  </div>
</template>

<script>
import SwitchToggle from '@/components/SwitchToggle'
import SubscribeBox from '@/components/subscribe/SubscriptionBox'

export default {
  components: { SwitchToggle, SubscribeBox }
}
</script>

<style lang="stylus" scoped>
.subscribe-container
  margin 70px 0 120px 0
  padding: 60px 0
  font-size .8rem
  display flex
  flex-direction column
  text-align center
  border-top 1px solid #e9ecef
  align-items center
  @media (max-width 1000px)
    margin 0
    padding: 60px 0 0 0
    border-top none
  .footer-message
    font-size .7rem
    a
      color #222 !important

</style>
