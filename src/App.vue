<template>
  <v-app>
    <navigation-bar></navigation-bar>
    
    <v-container fluid class="mt-3">
      <v-layout row>
        <v-flex xs12 class="text-xs-center" v-if="showBeta">
          Welcome! We are in early beta, checkout the open source project on <a href="https://github.com/SoftwareEngineeringDaily" target="_blank"> Github </a>.
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
          <transition name="fade" mode="out-in">
            <router-view />
          </transition>
        </v-flex>
      </v-layout>
    </v-container>
    
    <transition name="fade" mode="out-in">
      <div class="player-holder" v-show="isPlayerActive">
        <sticky-player ></sticky-player>
      </div>
    </transition>
  </v-app>
</template>

<script>
import StickyPlayer from './components/StickyPlayer.vue'
import NavigationBar from './components/NavigationBar.vue'

export default {
  name: 'app',
  components: {
    StickyPlayer,
    NavigationBar
  },
  computed: {
    isPlayerActive () {
      return this.$store.state.activePlayerPost.mp3
    },
    showBeta () {
      return this.$route.path === '/'
    }
  }
}
</script>
