<template>
  <v-card class="ma-2">
    <v-card-media :src="featuredImage" height="200px">      
      <span class="play-button" @click.prevent='clickHandler'>
        <img class="play-icon" src="../assets/play.png" alt="play">
      </span>
    </v-card-media>
    <v-card-title>
      <div class="score">
        <span class='arrow' v-bind:class="{ active: post.upvoted }"
        @click.prevent="upvoteHandler">▲</span>
        <div>{{ post.score || 0 }}</div>
        <span class='arrow' v-bind:class="{ active: post.downvoted }"
        @click.prevent="downvoteHandler">▼</span>
      </div>
      <div class="news-content">    
        <div class="news-title">
          <template v-if="post.url">
            <a :href="post.url" target="_blank" rel="noopener" >{{ post.title.rendered | decodeString }}</a>
            <span class="host"> ({{ post.url | host }})</span>
          </template>
          <template v-else>
            <router-link :to="'/post/' + post._id">{{ post.title.rendered | decodeString }}</router-link>
          </template>
        </div>

        <div class="meta">         
          <span class="time">{{date}}</span>        
        </div>      
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
/* @flow */
import moment from 'moment'
import VueAplayer from 'vue-aplayer'
import { mapActions } from 'vuex'

export default {
  name: 'PostSummary',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  components: {
    'a-player': VueAplayer
  },
  computed: {
    featuredImage () {
      return this.post.featuredImage
        ? this.post.featuredImage
        : 'https://softwareengineeringdaily.com/wp-content/uploads/2015/08/sed_logo_updated.png'
    },
    date () {
      return moment(this.post.date).format('MMMM Do, YYYY')
    }
  },
  methods: {
    ...mapActions([
      'upvote',
      'downvote',
      'setActivePostInPlayer'
    ]),
    clickHandler () {
      this.setActivePostInPlayer(this.post)
    },
    upvoteHandler () {
      this.upvote({
        id: this.post._id
      })
    },
    downvoteHandler () {
      this.downvote({
        id: this.post._id
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.news-content
  display inline-flex
  flex-direction column
  justify-content center
  width 80%
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
  width 100%
  height 100%
  padding 0
  margin 0
  cursor pointer
  display flex
  justify-content center
  align-items center

  .play-icon    
    height 80px
    width 80px
.news-title
  padding-top 10px
  font-size 1.1em
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
