<template>
  <header class="header">
    <nav class="inner">
      <router-link to="/" exact>
        <img class="logo" src="./../assets/sedaily-logo.png" alt="logo">
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

      <router-link to="/premium" name="subscribe-nav-link"
      style='float:right;margin-right: 1em;' v-if='!isLoggedIn'
        class="call-to-action"
      >
        Subscribe
      </router-link>

      <span v-if='isLoggedIn' style='float:right;'>
        <router-link to="/premium" name="top-nav-link"
        class="call-to-action"
        >Subscribe</router-link>

        <a href='/'   name="logouts-nav-link"  @click.prevent='logoutHandler'>Logout</a>
        <router-link to="/profile" name="top-nav-link">Profile</router-link>
      </span>
    </nav>
  </header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'navigation-bar',

  computed: {
    ...mapGetters(['isLoggedIn'])
  },

  methods: {
    ...mapActions(['logout']),
    logoutHandler () {
      this.logout()
      this.$router.replace('/')
    }
  }
}
</script>
