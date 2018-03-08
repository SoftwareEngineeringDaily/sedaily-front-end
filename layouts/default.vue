<template>
  <div id="app">
    <navigation-bar />

    <div class="container-fluid main-app">
      <div class="row">
        <div
          v-if="showBeta"
          class="col-md-8 col-centered text-center beta-msg">
          Welcome! We are in early beta, checkout the open source project on
          <a
            href="https://github.com/SoftwareEngineeringDaily"
            target="_blank"
            class="link"> Github</a> &amp; become a
          <nuxt-link
            to="/contributors"
            class="link">contributor</nuxt-link>.
        </div>
      </div>
      <div class="row text-center">
        <div
          v-if="showBeta"
          class="col-md-12">
          <br>
          <h3> Check out the apps: </h3>

          <a
            href="https://itunes.apple.com/us/app/software-engineering-daily/id1253734426?mt=8"
            target="_blank">
            <img
              src="~assets/iosstore.png"
              class="icon">
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=com.koalatea.thehollidayinn.softwareengineeringdaily&hl=en"
            target="_blank">
            <img
              src="~assets/androidstore.png"
              class="icon">
          </a>
        </div>
      </div>
    </div>
    <transition
      name="fade"
      mode="out-in">
      <nuxt class="view" />
    </transition>

    <transition
      name="fade"
      mode="out-in">
      <div
        v-if="isPlayerActive"
        class="player-holder">
        <sticky-player />
      </div>
    </transition>
  </div>
</template>

<script>
import StickyPlayer from '~/components/StickyPlayer.vue'
import NavigationBar from '~/components/NavigationBar.vue'
import { mapState } from 'vuex'

export default {
  components: {
    NavigationBar,
    StickyPlayer
  },

  computed: {
    ...mapState(['activePlayerPost']),
    isPlayerActive () {
      return Boolean(this.activePlayerPost && this.activePlayerPost.mp3)
    },
    showBeta () {
      return this.$route.path === '/'
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/stylus/variables'

#app
  margin-left 0.3rem
  margin-right 0.3rem

.main-app
  margin-top 3rem

.call-to-action
  background accent-color
  color white
  padding 4px 10px
  border-radius 8px
  font-weight 200
  text-transform uppercase

.header .call-to-action
  color white

.button-submit
  background primary-color
  color white
  padding 10px 20px
  cursor pointer

.button-submit-small
  background primary-color
  color white
  padding 5px 10px
  border-radius 2px
  cursor pointer

.button-delete
  background #fbf4f4
  color black
  padding 5px 10px
  cursor pointer

.section-title
  font-weight 300

.col-centered
  float none
  margin 0 auto

body
  font-family 'Roboto', sans-serif
  font-size 14px
  background-color white
  overflow-y scroll
  margin 0
  #app
    margin-bottom 120px

a
  color #34495e
  text-decoration none

.header
  z-index 999
  top 0
  left 0
  right 0
  .inner
    max-width 1200px
    box-sizing border-box
    margin 0px auto
    padding 15px 5px
  a
    font-size 14px
    line-height 16px
    padding-top 8px
    transition color .15s ease
    display inline-block
    vertical-align middle
    letter-spacing .075em
    margin-right 1.8em
    &:hover
      color primary-color
      text-decoration none
    &.router-link-active
      text-decoration underline
    &:nth-child(6)
      margin-right 0
  .github
    color #fff
    font-size .9em
    margin 0
    float right

.player-holder
  padding 10px 20px
  box-shadow -5px -5px 5px -2px rgba(176,176,176,0.3)
  background-color white
  width 100%
  position fixed
  bottom 0
  left 0

.icon {
  width: 150px;
}

.logo
  width 30px
  margin-right 10px
  display inline-block
  vertical-align middle

.feed-icon
  width 30px

.registration-icon
  width 30px

.like-icon
  width 30px

.trophy-icon
  width 30px

.new-icon
  width 30px

.view
  max-width 1200px
  margin 0 auto
  position relative

.fade-enter-active, .fade-leave-active
  transition all .2s ease

.fade-enter, .fade-leave-active
  opacity 0

@media (max-width 860px)
  .header .inner
    padding 15px 30px

@media (max-width 600px)
  body
    font-size 14px
  .header
    min-height 80px
    .inner
      padding 15px
    a
      margin-right 1em
    .github
      display none
</style>
