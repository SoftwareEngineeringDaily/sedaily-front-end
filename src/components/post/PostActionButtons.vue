<template>
  <div class="post-action-btns">
    <span
      v-if="post.mp3"
      class="player-controls">
      <button v-if="canPlay" class="btn-default" @click="play">Listen to Podcast</button>
      <button v-if="canPause" class="btn-default" @click="pause">Pause Episode</button>
    </span>
    <span
      v-else
      class="player-controls">
      <span
        class="fa fa-2x fa-file-text-o player-control text-only"
        title="Text-only" />
    </span>
    <div class="download-area" v-if="post.mp3">
       <a v-bind:href="post.mp3"  title="Download" rel="nofollow" download=""><button class="btn-default">Download Episode</button></a>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { PlayerState } from '@/utils/playerState'
import moment from 'moment'

export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      activePlayerPost (state) {
        return state.activePlayerPost
      }
    }),
    postContent () {
      if (this.post.cleanedContent) {
        return this.post.cleanedContent
      } else {
        return this.post.content.rendered
      }
    },
    publicationDate () {
      if (this.post) {
        return moment(this.post.date).format('dddd, MMMM Do YYYY')
      }
    },
    isActiveEpisode () {
      return this.activePlayerPost && this.activePlayerPost._id === this.post._id
    },
    canPause () {
      return this.isActiveEpisode && this.playerState === PlayerState.PLAYING
    },
    canPlay () {
      return !this.isActiveEpisode || this.playerState !== PlayerState.PLAYING
    }
  },
  methods: {
    ...mapActions([
      'playEpisode',
      'updatePlayerState'
    ]),
    play () {
      if (this.isActiveEpisode) {
        this.updatePlayerState(PlayerState.PLAYING)
      } else {
        this.playEpisode(this.post)
      }
    },
    pause () {
      if (this.isActiveEpisode) {
        this.updatePlayerState(PlayerState.PAUSED)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../css/variables'

.post-action-btns
  display flex
  margin 40px 0 15px 0
  .btn-default 
    padding 5px 20px
    border-radius 3px
    font-size 1.03rem
    color #fff
    background-color primary-color
    text-transform uppercase
    text-decoration none !important
    margin-right 25px
    font-weight 500

</style>
