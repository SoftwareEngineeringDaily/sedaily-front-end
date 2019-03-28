<template>
  <div id="app">
    <navigation-bar
      :userData="me"
    />

    <div class="container-fluid main-app">
      <!-- <div
        v-if="showBeta"
        class="row">
        <div
          class="col-md-12 beta-msg text-center">
          Welcome! We are in early beta, checkout the open source project on
          <a
            href="https://github.com/SoftwareEngineeringDaily"
            target="_blank"
            class="link"> Github</a> &amp; become a
          <router-link
            to="/contributors"
            class="link">contributor</router-link>.
        </div>

      </div> -->
      <div class="row">
        <transition
          name="fade"
          mode="out-in">
          <router-view class="view col-md-12" />
        </transition>
      </div>
    </div>

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
import { mapState, mapGetters } from 'vuex'
import StickyPlayer from './components/StickyPlayer.vue'
import ChatBox from './components/ChatBox.vue'
import NavigationBar from './components/NavigationBar.vue'

export default {
  name: 'app',
  components: {
    StickyPlayer,
    ChatBox,
    NavigationBar
  },
  computed: {
    ...mapState({
      me (state) {
        return state.me
      }
    }),
    ...mapState(['activePlayerPost']),
    isPlayerActive () {
      return Boolean(this.activePlayerPost && this.activePlayerPost.mp3)
    },
    showBeta () {
      return this.$route.path === '/'
    },
    ...mapGetters(['isLoggedIn', 'metaTag'])
  },
  // as parent component, these meta tags will appear with defaults
  // in <head></head> unless overwritten with same id in child component
  metaInfo() {
    return {
      title: 'Software Daily',
      meta: [
        this.metaTag('twitter:card'),
        this.metaTag('twitter:site'),
        this.metaTag('twitter:creator'),
        this.metaTag('og:url'),
        this.metaTag('og:title'),
        this.metaTag('description'),
        this.metaTag('og:description'),
        this.metaTag('og:image'),
      ]
    }
  },
}
</script>

<style lang="stylus">
@import './css/variables'
#app
  background-color #f6f7fa
  min-height calc(100vh - 72px)

.main-app
  max-width 1200px
  margin-top 4rem
  padding-top 15px

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
  outline none
  padding 7px 10px
  font-size 12px
  background primary-color
  white-space nowrap
  color white
  min-width 70px
  border none
  border-radius 30px
  text-align center
  transition all .15s ease
  cursor pointer
.button-submit:hover
  background #a591ff
  outline none
.button-submit:focus
  outline none

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
    padding-bottom 120px

a
  color #34495e
  text-decoration none

.player-holder
  padding 10px 20px
  box-shadow -5px -5px 5px -2px rgba(176,176,176,0.3)
  background-color white
  width 100%
  position fixed
  bottom 0
  left 0

.icon
  width 150px

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
  margin 0 auto
  position relative

.fade-enter-active, .fade-leave-active
  transition all .2s ease

.fade-enter, .fade-leave-active
  opacity 0

@media (max-width 660px)
  .header .inner-mobile
    flex-direction column
    .site-name
      margin auto
    .search-bar
      justify-content center
      margin 15px auto!important
      margin 15px
      margin-left 0
      width 90%
    .pull-right
      display flex
      align-items center
      justify-content space-between
      max-width 300px
      width 100%
      margin-top 15px
@media (max-width 660px)
  .main-app
    margin-top 7rem

@media (max-width 700px)
  .header .inner
    .site-name
      font-size 28px!important

@media (max-width 860px)
  .header .inner
    padding 15px 30px
    .pull-right
      display flex
      align-items center
  .header .inner-mobile
    padding 15px 30px
  .header .profile-img
    max-height 35px!important

@media (max-width 600px)
  body
    font-size 14px
  .header
    min-height 80px
    .inner
      padding 15px
    .inner-mobile
      padding 15px
    a
      margin-right 1em
    .github
      display none

  .beta-msg
    margin-bottom 20px

  .container-fluid
    padding-right: 0
    padding-left: 0
</style>
