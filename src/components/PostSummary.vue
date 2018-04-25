<template>
  <div class="news-post">
    <div class="post-summary">
      <div class="voting-arrows"  v-if="!hideVoting">
        <voting-arrows
          :upvoted="post.upvoted"
          :downvoted="post.downvoted"
          :upvote-handler="upvoteHandler"
          :downvote-handler="downvoteHandler"
          :score="post.score" />
      </div>
      <div class="image-holder">
        <div
          :style="imageStyle"
          class="image">
        </div>
      </div>
      <div class="title">
        <template v-if="post.url">
          <a
            :href="post.url"
            target="_blank">{{ post.title.rendered | decodeString }}</a>
          <span class="host"> ({{ post.url | host }})</span>
        </template>
        <template v-else>
          <router-link :to="postPrettyUrl">{{ post.title.rendered | decodeString }}</router-link>
        </template>
      </div>
    </div>

    <div class="news-content">
      <div class="player">
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
            class="fa fa-2x fa-file-text-o text-only"
            title="Text-only" />
        </span>
      </div>
      <div class="time">{{ date }}</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import VotingArrows from 'components/VotingArrows'
import { postPrettyUrl } from './../utils/post.utils'
import { PlayerState } from './../utils/playerState'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'PostSummary',
  props: {
    hideVoting: {
      type: Boolean,
      deault: false
    },
    post: {
      type: Object,
      required: true
    }
  },
  components: { VotingArrows },
  computed: {
    ...mapState(['activePlayerPost', 'playerState']),
    postPrettyUrl () {
      return postPrettyUrl(this.post)
    },

    featuredImage () {
      return this.post.featuredImage
        ? this.post.featuredImage
        : 'https://softwareengineeringdaily.com/wp-content/uploads/2015/08/sed_logo_updated.png'
    },

    date () {
      return moment(this.post.date).format('MMMM Do, YYYY')
    },

    imageStyle () {
      return `background: url('${this.featuredImage}') center center / cover no-repeat`
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
    ...mapActions(['playEpisode', 'updatePlayerState']),
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
    },
    upvoteHandler () {
      // TODO: Fix this action, it will error if it's being called
      // and there is no episode stored for this id in the store, which
      // can happen if rendered from forum:
      console.log(this.post)
      this.$store.dispatch('upvote', {
        id: this.post._id
      })
    },
    downvoteHandler () {
      this.$store.dispatch('downvote', {
        id: this.post._id
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import './../css/variables'

.news-post
  display inline-flex
  flex-direction column
  background-color #fff
  border-bottom 2px solid #eee
  border-left 2px solid #eee
  padding 15px
  width 50%

.post-summary
  display flex
  flex-direction row
  justify-content center
  align-items center
  .voting-arrows
    flex 10%
  .image-holder
    flex 20%
    .image
      border-radius 76px
      height 76px
      width 76px
      margin 7px
  .title
    flex 70%
    a
      font-size 1.1em
      color primary-color
      &:hover
        text-decoration underline
        font-weight bold

.news-content
  margin-top 10px
  display flex
  flex-direction row
  justify-content center
  align-items center
  color #999
  background idle-background
  &:hover
    color white
    background primary-color

  .player
    flex 10%
    padding 10px
    .player-controls
      .player-control
        width 25px
        margin 0 10px
        cursor pointer
        &.text-only
          cursor default

      a
        color white
    a
      color idle-foreground
  .time
    flex 90%

@media (max-width 576px)
  .news-post
    width 100%

    .news-content
      margin-top 8%
</style>
