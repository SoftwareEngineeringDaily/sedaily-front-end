<template>
  <div class="news-post">
    <voting-arrows
      :upvoted="post.upvoted"
      :downvoted="post.downvoted"
      :upvoteHandler="upvoteHandler"
      :downvoteHandler="downvoteHandler"
      :score="post.score">
    </voting-arrows>
    <div class="news-content" style="width: 80%;">
      <div class="image" :style="imageStyle">
        <div class="player-controls">
          <span class="fa fa-2x fa-play player-control" title="play" @click="play" v-if="canPlay" />
          <span class="fa fa-2x fa-pause player-control" title="pause" @click="pause" v-if="canPause" />
        </div>
      </div>

      <div class="title">
        <!-- <img class="play-icon" src="../assets/play.png" alt="play">-->
        <template v-if="post.url">
          <a :href="post.url" target="_blank">{{ post.title.rendered | decodeString }}</a>
          <span class="host"> ({{ post.url | host }})</span>
        </template>
        <template v-else>
          <router-link :to="'/post/' + post._id + '/' + postUrlTitle ">{{ post.title.rendered | decodeString }}</router-link>
        </template>
      </div>

      <div class="meta">
          <!-- <span v-if="post.type !== 'job'" class="by">
          by <router-link :to="'/user/' + post.by">{{ post.by }}</router-link>
        </span> -->
        <span class="time">
          <!-- {{ post.time | timeAgo }} ago -->
          {{date}}
        </span>
        <!-- <span v-if="post.type !== 'job'" class="comments-link">
        | <router-link :to="'/post/' + post._id">{{ post.descendants }} comments</router-link>
      </span> -->
      </div>

      <!-- <span class="label" v-if="post.type !== 'story'">{{ post.type }}</span> -->
    </div>
  </div>
</template>

<script>
/* @flow */
import moment from 'moment'
import VotingArrows from 'components/VotingArrows'
import { PlayerState } from './../utils/playerState'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'PostSummary',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  components: { VotingArrows },
  computed: {
    ...mapState(['activePlayerPost', 'playerState']),
    postUrlTitle () {
      try {
        const originalTitle = this.post.title.rendered
        if (originalTitle) {
          let title = originalTitle.replace(/[^\w\s]/gi, '')
          // Ghetto way to replace strings, should use regex:
          title = title.split(' ').join('-')
          return title
        } else {
          return ''
        }
      } catch (e) {
        console.log('e', e)
        return ''
      }
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
  flex-direction row
  background-color #fff
  border-bottom 1px solid #eee
  border-left 1px solid #eee
  position relative
  line-height 20px
  height 220px
  width 50%

  .news-content
    display inline-flex
    flex-direction column
    justify-content center
    max-width 100%

  .image
    display flex
    align-items center
    justify-content center
    height 96px
    width 192px
    .player-controls
      color white
      margin 0 10px
      .player-control
        text-shadow 2px 2px #999
        width 25px
        margin 0 10px
        cursor pointer

  .play-button
    width 80px
    height 80px
    position absolute
    top 30px
    left 70px
    cursor pointer

    .play-icon
      width 80px
  .title
    border-radius 3px
    padding 10px
    background idle-background
    &:hover
      background primary-color
      a
        color white
    a
      color idle-foreground


  .meta, .host
    font-size .85em
    color #999
    margin-top 5px
    a
      color #999
      text-decoration underline
      &:hover
        color #3F58AF

.voting
  display inline-flex
  flex-direction column
  justify-content center
  align-items center

@media (max-width 576px)
  .news-post
    width 100%

    .news-content
      margin-top 8%
</style>
