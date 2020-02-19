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
  components: {
    SwitchToggle,
    SubscribeBox
  }
}
</script>

<style lang="stylus" scoped>
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
