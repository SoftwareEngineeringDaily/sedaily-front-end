<template>
<div>
  <div class="audio-player-container" v-if="music">
    <div class="image" :style="imageStyle">
      <div class="player-controls">
        <span class="fa fa-2x fa-play player-control" title="play" @click="play" v-if="isPaused" />
        <span class="fa fa-2x fa-pause player-control" title="pause" @click="pause" v-if="isPlaying && !isPaused" />
      </div>
    </div>
    <div class="player-container">
      <div class="volume-controls">
        <span class="speed" title="1.5x" v-if="!doubleSpeed" @click="toggleDoubleSpeed" >1.5x</span>
        <span class="speed" title="1x" v-if="doubleSpeed" @click="toggleDoubleSpeed" >1x</span>
        <span class="fa fa-volume-off player-control mute" title="mute" @click="mute" v-if="!isMuted" />
        <span class="fa fa-volume-up player-control mute" title="unmute" @click="unMute" v-if="isMuted" />
      </div>

      <div class="music-description" v-html="music.title" />
      
      <audio ref="player" @play="onPlay" @pause="onPause" @timeupdate="onTimeUpdate" @volumechange="onVolumeChange" @canplay="onCanPlay">
        <source :src="music.url" type="audio/mpeg" />
      </audio>      
    </div>
  </div>
  <div class="progress">
    <vue-slider v-bind="progressOptions" v-model="progressOptions.value"></vue-slider>
  </div>
</div>
</template>

<script>
import vueSlider from 'vue-slider-component'

export default {
  props: {
    music: {
      type: Object,
      required: true
    }
  },
  components: {
    vueSlider
  },
  data () {
    return {
      isPlaying: false,
      isPaused: false,
      isMuted: false,
      duration: 0,
      doubleSpeed: false,
      progressOptions: {
        min: 0,
        max: 100,
        width: '100%',
        height: 10,
        show: true,
        dotSize: 8,
        interval: 0.1,
        bgStyle: {
          color: '#856AFF'
        },
        value: 0
      }
    }
  },
  watch: {
    music (newValue) {
      if (newValue.url) {
        this.progressPct = 0
        this.$refs.player.load()
      }
    }
  },
  computed: {
    imageStyle () {
      return `background: url('${this.music.pic}') center center / cover no-repeat`
    }
  },
  methods: {
    onCanPlay () {
      this.$refs.player.play()
    },
    onPause () {
      this.isPaused = true
      this.isPlaying = false
    },
    onVolumeChange () {
      this.isMuted = this.$refs.player.muted
    },
    onPlay () {
      this.isPlaying = true
      this.isPaused = false
    },
    onTimeUpdate () {
      this.progressOptions.value = Math.round((this.$refs.player.currentTime / this.$refs.player.duration) * 100, 1)
    },
    pause () {
      this.$refs.player.pause()
    },
    play () {
      this.$refs.player.play()
    },
    mute () {
      this.$refs.player.muted = true
    },
    unMute () {
      this.$refs.player.muted = false
    },
    toggleDoubleSpeed () {
      this.$refs.player.playbackRate = this.doubleSpeed ? 1 : 1.5
      this.doubleSpeed = !this.doubleSpeed
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './../css/variables'
 
.audio-player-container
  display flex
  flex-direction row
  align-items center
  .image
    display flex
    align-items center
    justify-content center
    height 48px
    width 96px
    margin-left 20px
    .player-controls
      color white
      margin 0 10px
      .player-control
        text-shadow 2px 2px #999
        width 25px
        margin 0 10px
        cursor pointer
  .player-container
    display flex
    flex-direction row
    justify-content center
    align-items center
    .volume-controls
      color #999
      display flex
      flex-direction column
      justify-content center
      align-items center     
      margin 0 10px
      .speed
        align-self flex-start
        cursor pointer
        text-align center
        min-width 30px
      .mute
        cursor pointer
        float left 
    .music-description
      color #999
      font-size: 0.9em
.progress
  margin-top 5px
</style>
