<template>
  <header class="header">
    <nav class="inner">
      <router-link
        to="/"
        class="site-name"
        exact>
        Software Daily
      </router-link>

      <router-link to="/jobs">Jobs Board</router-link>

      <!-- We are disabling the feed for now
      <router-link to="/feed"
        name="feed-nav-link"
        exact
        >Feed</router-link>
      -->

      <router-link to="/forum"
      name="feed-nav-link"
      exact
      >Forum</router-link>

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
          <router-link
            to="/contributors"
            class="dropdown-item"
            name="feed-nav-link"
            exact
            >Contributors</router-link>
        </div>
      </span>

      <span class="pull-right">
        <router-link
          v-if="alreadySubscribed"
          to="/premium"
          class="subscribed">Subscribed</router-link>

        <router-link
          v-else
          to="/subscribe"
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
import { mapActions, mapGetters, mapState } from 'vuex'

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

  beforeMount () {
    if (this.isLoggedIn) {
      this.fetchMyProfileData()
        .then((myData) => {
        })
        .catch((error) => {
          console.log('Error loading my data', error)
        })
    }
  },

  methods: {
    ...mapActions([
      'logout',
      'fetchMyProfileData'
    ]),
    logoutHandler () {
      this.logout()
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
    &.router-link-active
      text-decoration none
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

</style>
