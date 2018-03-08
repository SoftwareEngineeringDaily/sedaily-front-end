<template>
  <header class="header">
    <nav class="inner">
      <nuxt-link
        to="/"
        class="site-name"
        exact>
        Software Daily
      </nuxt-link>

      <nuxt-link to="/jobs">Jobs Board</nuxt-link>

      <nuxt-link
        to="/feed"
        exact>Feed</nuxt-link>

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
          <nuxt-link
            to="/new"
            class="dropdown-item"
            exact>New</nuxt-link>
          <nuxt-link
            to="/top"
            class="dropdown-item"
            exact>Top</nuxt-link>
          <nuxt-link
            to="/recommendations"
            class="dropdown-item"
            exact>Recommended</nuxt-link>
        </div>
      </span>

      <span class="pull-right">
        <nuxt-link
          v-if="alreadySubscribed"
          to="/premium"
          class="subscribed">Subscribed</nuxt-link>

        <nuxt-link
          v-else
          to="/subscribe"
          class="call-to-action">Subscribe</nuxt-link>

        <span v-if="isLoggedIn">
          <a
            href="/"
            name="logouts-nav-link"
            @click.prevent="logoutHandler">Logout</a>
          <nuxt-link
            to="/profile">Profile</nuxt-link>
        </span>
        <span v-else>
          <nuxt-link
            to="/login">Login</nuxt-link>

          <nuxt-link
            to="/register"
            class="register-nav-link">Register</nuxt-link>
        </span>
      </span>
    </nav>
  </header>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters([ 'isLoggedIn' ]),
    ...mapState({
      me({ auth }) {
        return auth ? auth.user : null
      },
      alreadySubscribed (state) {
        if (!this.isLoggedIn) return false
        if (this.me && this.me.subscription && this.me.subscription.active) {
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
      this.$axios.setHeader('Authorization', null)
      this.$router.replace('/')
    }
  }
}
</script>

<style scoped lang="stylus">
@import '../assets/stylus/variables'

.btn-secondary
  font-size 14px
  margin-top 8px
  box-shadow none
  &:hover
    border-color white
    color white
    background-color primary-color
  &:focus
    box-shadow none

.show
  .btn-secondary
    &.dropdown-toggle
      border-color white
      color white
      background-color primary-color

.header
  .site-name
    text-transform uppercase
    font-size 32px
    color #000
    padding-top 0
    line-height 32px
    letter-spacing normal
    font-weight bold
    &:hover
      text-decoration none
      color #000
  .call-to-action
    color white
    background-color primary-color
    margin-top 8px
    border-radius 20px
    padding-top 4px
    text-decoration none
    margin-right 1em
  .register-nav-link
    margin-right 1em
  a.nuxt-link-active
    text-decoration none
</style>
