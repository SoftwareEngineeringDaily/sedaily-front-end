<template>
  <header class="header">
    <nav class="inner">
      <router-link
        to="/"
        class="site-name"
        exact>
        Software Daily
      </router-link>

      <span class="dropdown">
        <button
          id="podcastMenuButton"
          class="btn btn-secondary dropdown-toggle"
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false">
          Podcast
        </button>
        <div
          class="dropdown-menu"
          aria-labelledby="podcastMenuButton">
          <router-link
            to="/new"
            class="dropdown-item"
            exact>New</router-link>
          <router-link
            to="/top"
            class="dropdown-item"
            exact>Top</router-link>
          <router-link to="/recommendations"
            class="dropdown-item"
            name="feed-nav-link"
            exact
            >Recommended</router-link>
        </div>
      </span>

      <router-link
        to="/forum"
        class="feed-nav-link"
        exact
      >Forum</router-link>

      <router-link to="/jobs">Jobs</router-link>

      <!-- We are disabling the feed for now
      <router-link to="/feed"
        name="feed-nav-link"
        exact
        >Feed</router-link>
      -->

      <span class="pull-right">
        <router-link
          v-if="alreadySubscribed"
          to="/subscribe"
          class="subscribed">Subscribed</router-link>

        <router-link
          v-else
          to="/premium"
          class="call-to-action">Subscribe</router-link>

        <span v-if="isLoggedIn">
          <a
            href="/"
            name="logouts-nav-link"
            @click.prevent="logoutHandler">Logout</a>
          <router-link
            to="/profile">Profile</router-link>
        </span>
        <span v-else>
          <router-link
            to="/login">Login</router-link>

          <router-link
            to="/register"
            class="register-nav-link">Register</router-link>
        </span>
      </span>
    </nav>
  </header>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'navigation-bar',

  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      alreadySubscribed (state) {
        if (!this.isLoggedIn) return false
        if (state.me && state.me.subscription && state.me.subscription.active) {
          return true
        } else {
          return false
        }
      }
    })
  },

  methods: {
    logoutHandler () {
      this.$auth.logout()
      this.$router.replace('/')
    }
  }
}
</script>

<style scoped lang="stylus">
@import './../css/variables'

.btn-secondary
  font-size 14px
  margin-top 8px
  box-shadow none
  background-color white
  color black
  &:hover
    border-color white
    color white
    background-color primary-color
  &:focus
    box-shadow none

.show
  .btn-secondary
    background-color white
    &.dropdown-toggle
      border-color white
      color white
      background-color primary-color

.feed-nav-link
  margin-left 15px
  margin-right 15px

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
    color black
    display inline-block
    vertical-align middle
    letter-spacing .075em
    margin-right 0.75em
    &:hover
      color #666
      text-decoration none
    &.router-link-active
      text-decoration none
      border-bottom 1.5px solid rgba(primary-color,1.0)
      line-height 25px
    &:nth-child(6)
      margin-right 0
  .dropdown-menu a
    border-bottom none
    &:hover
      color primary-color
    &.router-link-active
      font-weight bold
      background-color primary-color
      border-color white
      padding-top 2px
      color #fff
    &:active
      color #fff
  .github
    color #fff
    font-size .9em
    margin 0
    float right
  .site-name
    text-transform uppercase
    font-size 32px
    color #000
    padding-top 10px
    line-height 25px
    letter-spacing normal
    font-weight bold
    &:hover
      text-decoration none
      color #000
    &.router-link-active
      text-decoration none
      border-bottom none
  .call-to-action
    text-decoration none
    box-shadow 0 0px 0px rgba(#000, 0.3)
    line-height 25px
    color white
    background-color primary-color
    margin-top 8px
    border-radius 20px
    padding-top 4px
    text-decoration none
    transition all .5s ease
    margin-right 1em
    &.router-link-active
      background #dcdcdd
      color #000
      border-bottom 0px solid rgba(0,0,0,0.5)
    &:hover
      color #fff
      background-color #a591ff
      box-shadow 0 5px 15px rgba(#000, 0.3)
  .register-nav-link
    margin-right 1em

</style>
