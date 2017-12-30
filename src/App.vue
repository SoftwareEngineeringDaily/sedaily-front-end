<template>
  <v-app>
    <navigation-bar></navigation-bar>
    
    <v-container fluid class="mt-3">
      <v-layout row>
        <v-flex xs12 class="beta-msg text-xs-center" v-if="showBeta">
          Welcome! We are in early beta, checkout the open source project on <a href="https://github.com/SoftwareEngineeringDaily" rel="noopener" target="_blank"> Github </a>.
        </v-flex>
      </v-layout>
      <v-layout row>        
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </v-layout>
    </v-container>
    
    <transition name="fade" mode="out-in">
      <div class="player-holder" v-show="isPlayerActive">
        <sticky-player ></sticky-player>
      </div>
    </transition>

    <error-message-dialog />
  </v-app>
</template>

<script>
import StickyPlayer from './components/StickyPlayer.vue'
import NavigationBar from './components/NavigationBar.vue'
import ErrorMessageDialog from './dialogs/ErrorMessageDialog.vue'
import { mapState } from 'vuex'

export default {
  name: 'app',
  components: {
    StickyPlayer,
    NavigationBar,
    ErrorMessageDialog
  },
  computed: {
    ...mapState({
      isPlayerActive (state) {
        return !!(state.activePlayerPost && state.activePlayerPost.mp3)
      }
    }),
    showBeta () {
      return this.$route.path === '/'
    }
  }
}
</script>

<style lang="stylus" scoped>
.player-holder
  padding 10px 20px
  box-shadow: -5px -5px 5px -2px rgba(176,176,176,0.3)
  background-color white
  width 100%
  position fixed
  bottom 0
  left 0
</style>
