<template>
  <div id='sticky-player'>
    <a-player :music="music"
      :playing.sync="isPlaying"
      :paused.sync="isPaused" />
  </div>
</template>

<script>
// @flow

import AudioPlayer from 'components/AudioPlayer.vue'
import { PlayerState } from './../utils/playerState'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'sticky-player',
  components: {
    'a-player': AudioPlayer
  },
  data () {
    return {
      isPaused: false,
      isPlaying: false
    }
  },
  computed: {
    ...mapState({
      music ({ activePlayerPost }) {
        return {
          title: activePlayerPost.title.rendered || ' ',
          url: activePlayerPost.mp3 || ' ',
          pic: activePlayerPost.featuredImage || ' '
        }
      },
      playerState (state) {
        return state.playerState
      }
    })
  },
  methods: {
    ...mapActions(['updatePlayerState'])
  },
  watch: {
    isPlaying (newValue: boolean) {
      if (newValue) {
        this.updatePlayerState(PlayerState.PLAYING)
      }
    },
    isPaused (newValue: boolean) {
      if (newValue) {
        this.updatePlayerState(PlayerState.PAUSED)
      }
    },
    playerState (newValue: PlayerState) {
      if (newValue === PlayerState.PLAYING && !this.isPlaying) {
        this.isPlaying = true
        this.isPaused = false
      } else if (newValue === PlayerState.PAUSED && !this.isPaused) {
        this.isPaused = true
        this.isPlaying = false
      }
    }
  }
}
</script>
