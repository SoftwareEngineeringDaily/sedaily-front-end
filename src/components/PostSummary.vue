<template>
  <div class="news-post">
    <div class="score">
      <span class='arrow' v-bind:class="{ active: post.upvoted }"
      @click='upvote(post)'>▲</span>
      <div>{{ post.score || 0 }}</div>
      <span class='arrow' v-bind:class="{ active: post.downvoted }"
      @click='downvote(post)'>▼</span>
    </div>
    <div class="news-content" style="width: 80%;">
      <img class="hero-img":src="featuredImage" />
      <span class="play-button" @click='setActivePostInPlayer(post)'>
        <img class="play-icon" src="../assets/play.png" alt="play">
      </span>

      <div class="title">
        <template v-if="post.url">
          <a :href="post.url" target="_blank">{{ post.title.rendered }}</a>
          <span class="host"> ({{ post.url | host }})</span>
        </template>
        <template v-else>
          <router-link :to="'/post/' + post._id">{{ post.title.rendered }}</router-link>
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
</div>
</template>

<script>
/* @flow */
import moment from 'moment'
import VueAplayer from 'vue-aplayer'
export default {
  name: 'PostSummary',
  props: ['post'],
  components: {
    'a-player': VueAplayer
  },
  computed: {

    featuredImage () {
      return this.post.featuredImage ? this.post.featuredImage : 'https://softwareengineeringdaily.com/wp-content/uploads/2015/08/sed_logo_updated.png'
    },

    date () {
      return moment(this.post.date).format('MMM Do YY')
    }
  },
  methods: {
    setActivePostInPlayer: function (post:any) {
      this.$store.commit('setActivePostInPlayer', { post })
    },
    upvote: function (post:any) {
      console.log(post)
      this.$store.dispatch('upvote', {
        id: post._id
      })
    },
    downvote: function (post:any) {
      this.$store.dispatch('downvote', {
        id: post._id
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
    margin-top 12.5%
    max-width 100%

  .hero-img
    width 100px

  .arrow
    color #888
    &:hover
      cursor pointer
      color #3F58AF

    &.active
      color #3F58AF !important
      &:hover
        cursor pointer
        color #888

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
  .score
    display flex
    flex-direction column
    align-posts center
    justify-content center
    color #3F58AF
    font-size 1.1em
    font-weight 700
    width 15%
    text-align: center

  .meta, .host
    font-size .85em
    color #999
    margin-top 5px
    a
      color #999
      text-decoration underline
      &:hover
        color #3F58AF

@media (max-width 576px)
  .news-post
    width 100%

    .news-content
      margin-top 8%
</style>
