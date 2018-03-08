<template>
  <div class="post-view-header row">
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
        <span>
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
          <span class="publication-date">Published on {{ publicationDate }}</span>
        </span>


        <span class="details-about-post">
          {{ post.score || 0 }} points
          {{ post.date | timeAgo }} ago
          <social-sharing
            :url="post.url"
            :title="post.title.rendered"
            :description="postContent"
            twitter-user="software_daily"
            inline-template>
            <div class="sharing">
              <network network="facebook">
                <i class="fa fa-facebook" /> Facebook
              </network>
              <network network="linkedin">
                <i class="fa fa-linkedin" /> LinkedIn
              </network>
              <network network="twitter">
                <i class="fa fa-twitter" /> Twitter
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
import { PlayerState } from '~/utils/playerState'
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
@import '../../assets/stylus/variables'

.post-view-header
  background primary-color
  color white
  margin-top 20px
  box-shadow 0 1px 2px rgba(0,0,0,.1)
  .player-control
    cursor pointer
  .post-header-details
    width 100%
    .meta
      margin 10px 20px
      display flex
      align-items center
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

i.fa
  cursor pointer
</style>
