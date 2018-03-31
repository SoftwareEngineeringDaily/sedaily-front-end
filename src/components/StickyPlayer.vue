<template>
  <div id='sticky-player'>
    <a-player :music="music"
      @finished="onFinished"
      :playing.sync="isPlaying"
      :paused.sync="isPaused"
      :playEvent.sync="playEvent" />
  </div>
</template>

<script>
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
      isPlaying: false,
      playEvent: {}
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
      'playEpisode',
      'playEpisodeEvent'
    ]),
    onFinished () {
      const nextEpisode = this.getNextEpisode(this.activePlayerPost)
      if (nextEpisode) {
        this.playEpisode(nextEpisode)
      }
    }
  },
  watch: {
    isPlaying (newValue) {
      if (newValue) {
        this.updatePlayerState(PlayerState.PLAYING)
      }
    },
    isPaused (newValue) {
      if (newValue) {
        this.updatePlayerState(PlayerState.PAUSED)
      }
    },
    playEvent (newValue) {
      if (newValue) {
        this.playEpisodeEvent({
          minutesPlayed: newValue.minutesPlayed,
          minutesRemaining: newValue.minutesRemaining,
          episodeName: this.activePlayerPost.title.rendered
        })
      }
    },
    playerState (newValue) {
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
