<template>
  <header class="header" id="header">
    <nav class="inner">
      <div class="navbar-centered">
        <div @click="resetApp" class="navbar-logo navbar-centered">
          <img class="logo-img site-logo" src="../../assets/sedaily-logo.png">
          <span class="site-name">Software Daily</span>
        </div>
        <div class="top-menu">
          <router-link to="/write">
            Write
          </router-link>
          <router-link to="/jobs">
            Jobs
          </router-link>
        </div>
      </div>
      <span class="pull-right">
        <search-bar />

        <span v-if="!isLoggedIn" class="register">
          <button @click="signIn" name="submit-button" class="btn-sign-in">Sign In</button>
        </span>

        <router-link v-if="!alreadySubscribed" to="/premium" class="button-submit call-to-action-secondary">
          <i class="fa fa-rss" />
          <span class="button-submit-label">Subscribe</span>
        </router-link>

        <notification v-if="isLoggedIn"></notification>

        <span class="active-without-border" v-if="isLoggedIn">
          <div>
            <b-dropdown variant="link" class="user" right size="lg" no-caret>
              <template slot="button-content">
                <div class="crop-image" v-if="isLoggedIn">
                  <img class="profile-img" :src="errorImg || avatarUrl" @error="imgOnError">
                </div>
              </template>
              <b-dropdown-item to="/profile" exact>
                <div class="arrow"></div>
                Profile
              </b-dropdown-item>
              <b-dropdown-item v-if="alreadySubscribed" to="/subscribe">
                Subscription
              </b-dropdown-item>
              <b-dropdown-item to="/bookmarks">
                Bookmarks
              </b-dropdown-item>
              <b-dropdown-item @click.prevent="logoutHandler">
                Logout
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </span>
      </span>
    </nav>
    <NavMobile/>
  </header>
</template>

<script>
import { Dropdown } from 'bootstrap-vue/esm/components/dropdown'
import { mapGetters, mapState } from 'vuex'
import SearchBar from '@/components/search/SearchBar'
import NavMobile from './NavBarMobile'
import Notification from '@/components/notification/Notification'

export default {
  name: "navigation-bar",
  components: {
    SearchBar,
    NavMobile,
    Notification
  },
  props: {
    userData: {
      type: Object,
      default: function() {
        return {
          avatarUrl: ""
        };
      }
    },
    ownProfile: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    searchTerm() {
      this.makeSearch();
    }
  },
  data: () => ({
    showDropdown: false,
    clickedDropdown: false,
    searchTerm: null,
    showFilteringElements: true,
    searchActive: false,
    errorImg: ''

  }),
  computed: {
    ...mapGetters(["isLoggedIn"]),
    ...mapState({
      alreadySubscribed(state) {
        if (!this.isLoggedIn) return false;
        if (state.me && state.me.subscription && state.me.subscription.active) {
          return true;
        } else {
          return false;
        }
      },
      avatarUrl(state) {
          return state.me.avatarUrl || state.placeholderAvatar;
        }
    })
  },
  methods: {
    signIn() {
      this.$router.push({ path: `/login` })
    },

    logoutHandler() {
      this.$auth.logout()

      if (this.$router.history.current.path !== '/') {
        this.$router.push('/')
      }
    },

    mouseOverDropdown() {
      if (!this.showDropdown) this.showDropdown = true;
    },
    mouseLeaveDropdown() {
      if (this.showDropdown && !this.clickedDropdown) this.showDropdown = false;
    },
    onClickPodcastButton() {
      this.clickedDropdown = !this.clickedDropdown;
      this.clickedDropdown
        ? (this.showDropdown = true)
        : (this.showDropdown = false);
    },
    onClickDropdownMenu() {
      this.clickedDropdown = false;
      this.showDropdown = false;
    },
    onSearchActive() {
      !this.searchActive
        ? (this.searchActive = true)
        : (this.searchActive = false);
    },
    resetApp() {
      this.$store.commit('setSearchTerm', { searchTerm: null })
      this.$router.push({ path: `/` }).catch(err => {})
    },
    imgOnError() {
        this.errorImg = 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/profile-icon-9.png'
      }
  }
}
</script>

<style lang="stylus">
@import '../../css/variables'

.header
  position sticky
  top 0

  .dropdown-menu .dropdown-item
    border-bottom none
    text-transform capitalize
    width 100%
    padding 8px 10px

    &:hover
      color primary-color

    &:active,
    &.router-link-active
      font-weight bold
      color #fff
      background-color primary-color
      border-color white

    &.router-link-active
      pointer-events none

</style>

<style scoped lang="stylus">
@import '../../css/variables'

@keyframes dropdown
  0%
    display none

  100%
    display block

.btn-sign-in,
.btn-secondary
  white-space nowrap
  text-transform uppercase

.btn-sign-in
  font-size 14px
  font-weight 700
  line-height 16px
  border 0
  letter-spacing 1.05px
  padding 10px 20px

.button-submit
  min-width auto
  margin-left 15px
  font-weight 700

  .fa-rss
    display none

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

.dropdown-menu-activez
  .btn-secondary
    background-color white
    box-shadow 0 0 0 0.2rem rgba(108, 117, 125, 0.5)

    &.dropdown-toggle
      border-color white
      color white
      background-color primary-color

.dropdown-enter-active
  animation dropdown-in 0.2s

.dropdown-leave-active
  animation dropdown-in 0.1s reverse

.forum-nav-link
  margin-right 15px
  margin-left 15px

.feed-nav-link
  margin-right 15px

.header
  position sticky
  z-index 999
  top 0
  left 0
  right 0
  background-color white

  .navbar-logo
    cursor pointer
    white-space nowrap

  .navbar-centered
    text-transform uppercase
    display flex
    align-items center

    .site-name
      font-size 20px
      color #222
      line-height 25px
      letter-spacing normal
      font-weight bold

      &:hover
        text-decoration none
        color #222

      &.router-link-active
        text-decoration none
        border-bottom none

    .site-logo
      margin-right 0.75em

    .top-menu
      margin 0 20px
      white-space nowrap

      a
        padding 5px 10px
        font-weight normal
        text-transform capitalize
        border-radius 30px

        .fa
          font-size: 16px

        &:hover
          color #222
          text-decoration underline

        &.router-link-active
          border-bottom 0
          line-height 16px

  .register
    display flex
    align-items center
    margin-left 5px

  .logo-img
    max-height 30px
    margin-right 10px

  .profile-img
    width 35px
    height 35px
    border-radius 50%

  .search-img
    max-height 35px
    width 35px

  .inner
    text-transform uppercase
    max-width 1050px
    box-sizing border-box
    margin 0px auto
    padding 15px 15px
    display flex
    align-items center
    justify-content space-between

    .pull-right
      display flex
      align-items center

  .inner-mobile
    text-transform uppercase
    max-width 1200px
    box-sizing border-box
    margin 0px auto
    padding 15px 5px
    display flex
    align-items center
    justify-content space-between

    .pull-right
      display flex
      align-items center
      justify-content space-between
      width 100%

  .active-without-border
    a.router-link-active
      text-decoration none
      border none
  a
    font-size 14px
    line-height 16px
    transition color .15s ease
    color black
    display inline-block
    vertical-align middle
    letter-spacing .075em

    &:hover
      color #666
      text-decoration none

    &.router-link-active
      text-decoration none
      border-bottom 1.5px solid rgba(primary-color,1.0)

    &:nth-child(2)
      margin-right 0

  .dropdown-menu .dropdown-item
    border-bottom none
    text-transform capitalize
    width 100%
    padding 8px 10px

    &:hover
      color primary-color

    &:active
      font-weight bold
      color #fff
      border-color white
      padding-top 2px
      color primary-color
      background-color primary-color

  .github
    color #fff
    font-size .9em
    margin 0
    float right

  .call-to-action
    text-decoration none
    box-shadow 0 0px 0px rgba(#222, 0.3)
    line-height 25px
    color white
    background-color primary-color
    border-radius 4px
    padding-top 4px
    text-decoration none
    transition all .5s ease
    margin-right 1em

    &.router-link-active
      background #dcdcdd
      color #222
      border-bottom 0px solid rgba(0,0,0,0.5)

    &:hover
      color #fff
      background-color #a591ff
      box-shadow 0 5px 15px rgba(#222, 0.3)

  .call-to-action-secondary
    padding 10px 20px
    border-radius 2px
    color #fff !important

  .register-nav-link
    margin-right 1em

  .arrow
    &:before
      content: '';
      width: 10px;
      height: 10px;
      border-top: 0 solid #fff;
      border-left: 0 solid #fff;
      border-bottom: 0 solid #fff;
      border-right: 0 solid #fff;
      position: absolute;
      right: 18%;
      top: -5px;
      margin-left: -6px;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      background-color: #fff;
      -webkit-box-shadow: -1px -1px 0 0 rgba(0,0,0,0.1);
      box-shadow: -1px -1px 0 0 rgba(0,0,0,0.1);

@media (max-width 860px)
  .button-submit
    .button-submit-label
      display none

    .fa-rss
      display block
      font-size 16px

@media (max-width 659px)
  header .site-name
    font-size 20px

  .inner
    display none !important

  .inner-mobile
    .search-bar
      justify-content center
      margin 15px auto !important
      margin 15px
      margin-left 0
      width 90%

@media (min-width 660px)
  .inner-mobile
    display none !important

</style>
