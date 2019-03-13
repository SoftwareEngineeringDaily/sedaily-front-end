<template>
  <header class="header" id="header">
    <nav class="inner">
      <a href='/'
      class="site-name">
        <img class="logo-img" src="../assets/sedaily-logo.png" />
        Software Daily
      </a>
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
        <span v-else class='register'>
          <router-link
          to="/login">Login</router-link>

          <router-link
          to="/register"
          class="register-nav-link">Register</router-link>
        </span>
      </span>
    </nav>
    <nav class="inner-mobile">
      <a
      href="/"
      class="site-name">
        <img class="logo-img" src="../assets/sedaily-logo.png" />
        Software Daily
      </a>
      <span class="pull-right">
        <span v-on:click="onSearchActive"><img class="search-img" src="../assets/icons/search.svg"/></span>
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
      <SearchBar v-if="searchActive" />
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
    searchActive: false,
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
    },
    onSearchActive () {
      !this.searchActive ? this.searchActive = true : this.searchActive = false;
    }
  }
}
$(function(){
  var lastScrollTop = 0, delta = 5, last = 'up', foo = 99999999, state = 'fixed', lastpos;
  $(window).scroll(function(event){
     var st = $(this).scrollTop();

     // if(Math.abs(lastScrollTop - st) <= delta) return;

     if (st > lastScrollTop){
         // scrolling down
         if(last == 'up') {
            if (state == 'fixed') {
                lastpos = (document.documentElement.scrollTop - 1);
                $("#header").css({'position': 'absolute', 'top': lastpos});
                state = 'absolute';
            }
            last = 'down';
         }
     } else {
         // scrolling up
         let posnow = document.documentElement.scrollTop
         if ((posnow - lastpos) > 50 || (posnow - lastpos) < 0) {
             if (last == 'down') {
                 foo = posnow - 51;
                 $("#header").css({'position': 'absolute', 'top': '0'});

             } else {
                if (foo > st) {
                    $("#header").css({'position': 'fixed', 'top': '0'});
                    state = 'fixed'
                }
             }
        }
        last = 'up';
     }
     lastScrollTop = st;

  });
});
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
  .register
    display flex
    align-items center
    margin-right 15px
  .logo-img
    max-height 40px
    margin-right 15px
  .profile-img
    max-height 45px
    border-radius 50%
  .search-img
    max-height 35px
    width 35px
  .inner
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
@media (max-width 659px)
  .inner
    display none!important
  .inner-mobile
    .search-bar
      justify-content center
      margin 15px auto!important
      margin 15px
      margin-left 0
      width 90%
@media (min-width 660px)
  .inner-mobile
    display none!important

</style>
