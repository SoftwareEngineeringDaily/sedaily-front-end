<template>
  <div class="post-view-header">
    <div class='voting'>
      <span class="score">
        <span class='arrow' v-bind:class="{ active: post.upvoted }" @click='upvoteHandler'>▲</span>
        <br>
        {{ post.score || 0}}
        <br>
        <span class='arrow' v-bind:class="{ active: post.downvoted }" @click='downvoteHandler'>▼</span>
      </span>
    </div>

    <div class='post-header-details' style='display:inline-block'>
      <a :href="post.url" target="_blank" rel="noopener" >
        <h1>{{ post.title.rendered | decodeString }}</h1>
      </a>
      <span v-if="post.url" class="host">
        ({{ post.url | host }})
      </span>

      <p class="meta">
        {{ post.score || 0 }} points
        <!-- | by <router-link :to="'/user/' + post.by">{{ post.by }}</router-link> -->
        {{ post.date | timeAgo }} ago
        <social-sharing :url="post.url"
                  :title="post.title.rendered"
                  :description="post.content.rendered"
                  twitter-user="software_daily"
                  inline-template>
          <div class="sharing">
            <network network="facebook">
              <i class="fa fa-facebook"></i> Facebook
            </network>
            <network network="linkedin">
              <i class="fa fa-linkedin"></i> LinkedIn
            </network>
            <network network="twitter">
              <i class="fa fa-twitter"></i> Twitter
            </network>
          </div>
        </social-sharing>
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions([
      'upvote',
      'downvote'
    ]),
    upvoteHandler: function () {
      this.upvote({
        id: this.postId
      })
    },
    downvoteHandler: function () {
      this.downvote({
        id: this.postId
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.voting
  display inline-block
  height 100%
  
.post-view-header
  background-color #fff
  padding 1.8em 2em 1em
  margin-top 20px
  box-shadow 0 1px 2px rgba(0,0,0,.1)

  h1
    display inline
    font-size 1.5em
    margin 0
    margin-right .5em
  .host, .meta, .meta a
    color #999
  .meta a
    text-decoration underline

  .arrow
    color #888
    margin-left -3px
    &:hover
      cursor pointer
      color #3F58AF

    &.active
      color #3F58AF !important
      &:hover
        cursor pointer
        color #888
</style>
