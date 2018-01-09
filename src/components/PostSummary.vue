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
      <img class="hero-img" :src="featuredImage" />
      <span class="play-button" @click='setActivePostInPlayer(post)'>
        <img class="play-icon" src="../assets/play.png" alt="play">
      </span>

      <div class="title">
        <template v-if="post.url">
          <a :href="post.url" target="_blank">{{ post.title.rendered | decodeString }}</a>
          <span class="host"> ({{ post.url | host }})</span>
        </template>
        <template v-else>
          <router-link :to="'/post/' + post._id">{{ post.title.rendered | decodeString }}</router-link>
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
import VueAplayer from 'vue-aplayer'
import VotingArrows from './VotingArrows'
export default {
  name: 'PostSummary',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  components: { VotingArrows, 'a-player': VueAplayer },
  computed: {

    featuredImage () {
      return this.post.featuredImage ? this.post.featuredImage : 'https://softwareengineeringdaily.com/wp-content/uploads/2015/08/sed_logo_updated.png'
    },

    date () {
      return moment(this.post.date).format('MMMM Do, YYYY')
    }
  },
  methods: {
    setActivePostInPlayer (post:any) {
      this.$store.commit('setActivePostInPlayer', { post })
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

  .hero-img
    width 100px

  .play-button
    width 80px
    height 80px
    position absolute
    top 40px
    left 70px
    cursor pointer

    .play-icon
      width 80px
  .title
    padding-top 10px

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
