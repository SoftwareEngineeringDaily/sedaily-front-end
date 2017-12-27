<template>
  <v-toolbar app dark color="primary">   
    <v-container fluid>
      <v-layout row> 
        <v-flex xs8 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
          <v-toolbar-items>              
            <v-btn class="mr-3" icon to="/">
              <img class="logo" src="./../assets/sedaily-logo.png" alt="logo">
            </v-btn>
            <v-btn class="mx-3" icon to="/feed">
              <img class="feed-icon" src="./../assets/feed-icon.png" alt="feed-icon">
            </v-btn>
            <v-btn class="mx-3" icon to="/new">
              <img class="new-icon" src="./../assets/new-icon.png" alt="new">
            </v-btn>
            <v-btn class="mx-3" icon to="/top">
              <img class="trophy-icon" src="./../assets/trophy-icon.png" alt="top">
            </v-btn>
            <v-btn class="mx-3" icon to="/recommendations">
              <img class="like-icon" src="./../assets/like-icon.png" alt="recommendations">
            </v-btn>
          </v-toolbar-items>
          </v-flex>
          <v-flex xs4>  
            <v-toolbar-items>              
            <v-btn v-if="!isLoggedIn" flat color="white" to="/login">Login</v-btn>
            <v-btn icon to="/register" v-if="!isLoggedIn">
              <img class="registration-icon" src="./../assets/registration-icon.png" alt="registration-icon">
            </v-btn>
            <v-btn flat color="white" @click.prevent='logoutHandler' v-if="isLoggedIn">Logout</v-btn>
            <v-btn flat color="white" to="/profile" v-if="isLoggedIn">Profile</v-btn>        
          </v-toolbar-items>  
        </v-flex>      
      </v-layout>
    </v-container>                    
  </v-toolbar>
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
    logoutHandler: function () {
      this.logout()
      this.$router.replace('/')
    }
  }
}
</script>

<style lang="stylus" scoped>
.logo
.feed-icon
.new-icon
.trophy-icon
.like-icon
.registration-icon
  height 30px
  width 30px

.btn--active .btn__content:before, 
.btn:hover .btn__content:before, 
.btn:focus .btn__content:before
  background-color inherit

</style>

