<template>
  <header class="header">
    <nav class="inner">
      <router-link
      to="/"
      class="site-name"
      exact>
        <img class="logo-img" src="../assets/sedaily-logo.png" />
        Software Daily
      </router-link>
      <SearchBar />
      <span class="pull-right">
        <router-link
        v-if="alreadySubscribed"
        to="/subscribe"
        class="subscribed">Subscribed</router-link>

        <router-link
        v-else
        to="/premium"
        class="call-to-action-secondary">Subscribe</router-link>

        <span class="active-without-border" v-if="isLoggedIn">
          <router-link
          to="/profile"><img class="profile-img" :src="avatarUrl" /></router-link>
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
import SearchBar from './SearchBar.vue'

export default {
  name: 'navigation-bar',
  components: {
    SearchBar
  },
  props: {
    userData: {
      type: Object,
      default: function () {
        return {
          avatarUrl: '',
        }
      }
    },
    ownProfile: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    searchTerm () {
      this.makeSearch()
    }
  },
  data: () => ({
    showDropdown: false,
    clickedDropdown: false,
    searchTerm: null,
    showFilteringElements: true,
  }),
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
      },
      avatarUrl (state) {
        return this.userData.avatarUrl || state.placeholderAvatar
      }
    })
  },

  methods: {
    mouseOverDropdown () {
      if (!this.showDropdown) this.showDropdown = true;
    },
    mouseLeaveDropdown () {
      if (this.showDropdown && !this.clickedDropdown) this.showDropdown = false;
    },
    onClickPodcastButton () {
      this.clickedDropdown = !this.clickedDropdown;
      this.clickedDropdown ? this.showDropdown = true : this.showDropdown = false;
    },
    onClickDropdownMenu () {
      this.clickedDropdown = false;
      this.showDropdown = false;
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

.dropdown-menu-active
  .btn-secondary
    background-color white
    box-shadow 0 0 0 0.2rem rgba(108, 117, 125, 0.5)
    &.dropdown-toggle
      border-color white
      color white
      background-color primary-color

.dropdown-menu
  display block
  transform translate3d(0px, 15px, 0px)
  .dropdown-menu
    opacity 0
    position absolute
    top 0px
    left 0px
    will-change transform

.dropdown-enter-active
  animation dropdown-in 0.2s

.dropdown-leave-active
  animation dropdown-in 0.1s reverse

@keyframes dropdown
  0%
    display none
  100%
    display block

.forum-nav-link
  margin-right 15px
  margin-left 15px

.feed-nav-link
  margin-right 15px

.header
  z-index 999
  top 0
  left 0
  right 0
  position fixed
  background-color white
  border-bottom 2px solid #eee
  .logo-img
    max-height 40px
    margin-right 15px
  .profile-img
    max-height 50px
  .inner
    text-transform uppercase
    max-width 1200px
    box-sizing border-box
    margin 0px auto
    padding 15px 5px
    display flex
    align-items center
    justify-content space-between
  .active-without-border
    a.router-link-active
      text-decoration none
      border none
      line-height 25px
  a
    font-size 14px
    line-height 16px
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
    &:nth-child(2)
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
    line-height 25px
    letter-spacing normal
    font-weight bold
    display flex
    align-items center
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
  .call-to-action-secondary
    color primary-color
  .register-nav-link
    margin-right 1em
  @media (max-width 690px)
    .header
      .input
        flex-wrap wrap
</style>
