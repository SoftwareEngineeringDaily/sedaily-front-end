<template>
  <div id="sticky-player">
    <a-player
      :music="music"
      :playing.sync="isPlaying"
      :paused.sync="isPaused"
      @finished="onFinished" />
  </div>
</template>

<script>
import AudioPlayer from '~/components/AudioPlayer.vue'
import { PlayerState } from '~/utils/playerState'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
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
    playerState (newValue) {
      if (newValue === PlayerState.PLAYING && !this.isPlaying) {
        this.isPlaying = true
        this.isPaused = false
      } else if (newValue === PlayerState.PAUSED && !this.isPaused) {
        this.isPaused = true
        this.isPlaying = false
      }
    }
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
  }
}
</script>
