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

      <audio ref="player" @play="onPlay"
        @pause="onPause"
        @timeupdate="onTimeUpdate"
        @volumechange="onVolumeChange"
        @canplay="onCanPlay">
        <source :src="music.url" type="audio/mpeg" />
      </audio>
    </div>
  </div>
  <div class="progress-slider">
    <vue-slider v-bind="progressOptions"
      v-model="sliderProgress"
      @callback="onSliderChange" />
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
    },
    paused: {
      type: Boolean,
      required: false,
      default: false
    },
    playing: {
      type: Boolean,
      required: false,
      default: false
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
      doubleSpeed: false,
      progress: 0,
      progressOptions: {
        min: 0,
        max: 100,
        width: '100%',
        height: 8,
        clickable: true,
        show: true,
        tooltip: 'hover',
        padding: 0,
        dotSize: 10,
        interval: 0.1,
        formatter (value) {
          const secondToTime = (second) => {
            if (isNaN(second)) {
              return '00:00'
            }

            const add0 = (num) => {
              return num < 10 ? '0' + num : '' + num
            }

            const min = parseInt(second / 60)
            const sec = parseInt(second - min * 60)
            const hours = parseInt(min / 60)
            const minAdjust = parseInt((second / 60) - (60 * parseInt((second / 60) / 60)))
            return second >= 3600 ? add0(hours) + ':' + add0(minAdjust) + ':' + add0(sec) : add0(min) + ':' + add0(sec)
          }

          return secondToTime(value) + ' / ' + secondToTime(this.max)
        },
        processStyle: {
          backgroundColor: '#856AFF'
        },
        tooltipStyle: {
          backgroundColor: '#856AFF',
          fontSize: '0.7em'
        },
        bgStyle: {
          padding: 0
        }
      }
    }
  },
  watch: {
    music (newValue) {
      if (newValue.url) {
        this.$refs.player.load()
      }
    },
    paused (newValue) {
      if (newValue) {
        this.pause()
      }
    },
    playing (newValue) {
      if (newValue) {
        this.play()
      }
    }
  },
  computed: {
    imageStyle () {
      return `background: url('${this.music.pic}') center center / cover no-repeat`
    },
    sliderProgress: {
      get () { return this.progress },
      set (value) { this.progress = value }
    }
  },
  methods: {
    onSliderChange (value) {
      this.$refs.player.currentTime = value
    },
    onCanPlay () {
      this.progressOptions.max = this.$refs.player.duration
      this.progress = this.$refs.player.currentTime
      this.$refs.player.play()
    },
    onPause () {
      this.isPaused = true
      this.isPlaying = false

      this.$emit('update:paused', true)
      this.$emit('update:playing', false)
    },
    onVolumeChange () {
      this.isMuted = this.$refs.player.muted
    },
    onPlay () {
      this.isPlaying = true
      this.isPaused = false

      this.$emit('update:paused', false)
      this.$emit('update:playing', true)
    },
    onTimeUpdate () {
      this.progress = this.$refs.player.currentTime
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
.progress-slider
  margin-top 5px
  .vue-slider-component
    padding 0
</style>
