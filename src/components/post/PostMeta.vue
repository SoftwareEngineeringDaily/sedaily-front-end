<template>
  <div class="post-view-header">
    <div
      class="post-header-details"
      style="display:inline-block">
      <a
        :href="post.url"
        target="_blank" />

      <span
        v-if="post.url"
        class="host">
        ({{ post.url | host }})
      </span>

      <div class="meta">
        <span class="player-controls-span">
          <span
            v-if="post.mp3"
            class="player-controls">
            <span
              v-if="canPlay"
              class="fa fa-2x fa-play player-control"
              title="play"
              @click="play" />
            <span
              v-if="canPause"
              class="fa fa-2x fa-pause player-control"
              title="pause"
              @click="pause" />
          </span>
          <span
            v-else
            class="player-controls">
            <span
              class="fa fa-2x fa-file-text-o player-control text-only"
              title="Text-only" />
          </span>
          <div class="download-area" v-if="post.mp3">
            <a v-bind:href="post.mp3" class="powerpress_link_d" title="Download" rel="nofollow" download="">  <i class="fa fa-download" /></a>
          </div>
          <!--<span class="publication-date">Published on {{ publicationDate }}</span>-->
        </span>


        <span class="details-about-post">
          <social-sharing
            :url="post.url"
            :title="post.title.rendered"
            :description="postContent"
            twitter-user="software_daily"
            inline-template>
            <div class="sharing">
              <network network="facebook">
                <i class="fa fa-facebook" />
              </network>
              <network network="linkedin">
                <i class="fa fa-linkedin" />
              </network>
              <network network="twitter">
                <i class="fa fa-twitter" />
              </network>
            </div>
          </social-sharing>
        </span>
      </div>
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
i.fa
  cursor pointer
  font-size 25px
  padding 0 15px
  color #c4c4c4
.post-view-header
  margin-top 20px
  .player-control
    cursor pointer
  .player-controls-span
    display flex
    align-items center
  .post-header-details
    width 100%
    .meta
      margin 10px 20px
      display flex
      align-items center
      color primary-color
      justify-content space-between
      .sharing
        cursor pointer
        font-size 22px
        color #c4c4c4
        display flex
        max-width 200px
        min-width 80px
        justify-content space-between
      .publication-date
        margin-left 15px
        justify-content center
      .details-about-post
        text-align right
        align-self flex-end
  .host, .meta, .meta a
    color white
    font-weight 200
  .meta a
    text-decoration underline
</style>
