<template>
  <div id="app">
    <header class="header">
      <nav class="inner">
        <router-link to="/" exact>
          <img class="logo" src="./assets/sedaily-logo.png" alt="logo">
        </router-link>
        <router-link to="/feed"  name="feed-nav-link" exact   v-if='isLoggedIn'>
          Feed
        </router-link>
        <router-link to="/new" name="new-nav-link">
          New
        </router-link>
        <router-link to="/top" name="top-nav-link">
          Top
        </router-link>
        <router-link to="/recommendations" name="recommendations-nav-link">
          Recommended
        </router-link>

        <router-link to="/login" name="login-nav-link" style='float:right;' v-if='!isLoggedIn'>Login</router-link>

        <router-link to="/register" name="register-nav-link" style='float:right;margin-right: 1em;' v-if='!isLoggedIn'>
          Register
        </router-link>


        <router-link to="/premium" name="register-nav-link" style='float:right;margin-right: 1em;' v-if='!isLoggedIn'>
          Subscribe
        </router-link>



        <span v-if='isLoggedIn' style='float:right;'>

          <router-link to="/premium" name="top-nav-link">Subscribe</router-link>
          <a href='/'   name="logouts-nav-link"  @click.prevent='logout()'>Logout</a>
          <router-link to="/profile" name="top-nav-link">Profile</router-link>
        </span>
      </nav>
    </header>
    <div class='container'>
      <div class="row">
        <div class="col-md-8 col-centered text-center" v-if="showBeta">
          Welcome! We are in early beta, checkout the open source project on <a href="https://github.com/SoftwareEngineeringDaily" target="_blank"> Github</a>.
        </div>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>

    <transition name="fade" mode="out-in">
      <div class="player-holder" v-show="isPlayerActive">
        <sticky-player ></sticky-player>
      </div>
    </transition>

  </div>
</template>

<script>
import StickyPlayer from './components/StickyPlayer.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  components: {
    StickyPlayer
  },

  computed: {
    isPlayerActive () {
      return this.$store.state.activePlayerPost.mp3
    },
    showBeta () {
      return this.$route.path === '/'
    },
    ...mapGetters(['isLoggedIn'])
  },

  methods: {
    logout: function () {
      this.$store.commit('logout')
      this.$router.go('/')
    }
  }
}
</script>

<style lang="stylus">

primary-color = #856AFF
secondary-color = #FF8B6A

.button-submit {
  background: primary-color
  color: white
  padding 10px 20px
  cursor: pointer
}

.section-title {
  font-weight: 300;
}

.col-centered{
    float: none;
    margin: 0 auto;
}

body
  font-family -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-size 14px
  background-color white
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
    max-width 800px
    box-sizing border-box
    margin 0px auto
    padding 15px 5px
  a
    font-size 14px
    color primary-color
    line-height 24px
    transition color .15s ease
    display inline-block
    vertical-align middle
    font-weight 300
    letter-spacing .075em
    margin-right 1.8em
    &:hover
      color secondary-color
      text-decoration none
    &.router-link-active
      color primary-color
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
  box-shadow: -5px -5px 5px -2px rgba(176,176,176,0.3)

  background-color white
  width 100%
  position fixed
  bottom 0
  left 0
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
  max-width 800px
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
