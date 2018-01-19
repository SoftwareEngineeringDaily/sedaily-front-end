<template>
  <div id='sticky-player'>
    <a-player :music="music"
      @finished="onFinished"
      :playing.sync="isPlaying"
      :paused.sync="isPaused" />
  </div>
</template>

<script>
// @flow

import AudioPlayer from 'components/AudioPlayer.vue'
import { PlayerState } from './../utils/playerState'
import { mapActions, mapState, mapGetters } from 'vuex'

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
    ...mapState([
      'activePlayerPost',
      'playerState'
    ]),
    music () {
      return {
        title: this.activePlayerPost.title.rendered || ' ',
        url: this.activePlayerPost.mp3 || ' ',
        pic: this.activePlayerPost.featuredImage || ' '
      }
    },
    ...mapGetters(['getNextEpisode'])
  },
  methods: {
    ...mapActions([
      'updatePlayerState',
      'playEpisode'
    ]),
    onFinished () {
      const nextEpisode = this.getNextEpisode(this.activePlayerPost)
      if (nextEpisode) {
        this.playEpisode(nextEpisode)
      }
    }
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
