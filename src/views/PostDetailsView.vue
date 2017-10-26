<template>
  <div class="post-view" v-if="post">
    <template v-if="post">
      <div class="post-view-header">

        <div class='voting' style='display:inline-block; height: 100%;'>
          <span class="score">
            <span class='arrow' v-bind:class="{ active: post.upvoted }" style='margin-left: 1px;' @click='upvoteHandler'>▲</span>
            <br>
            {{ post.score || 0}}
            <br>
            <span class='arrow' v-bind:class="{ active: post.downvoted }" style='margin-left: -4px;' @click='downvoteHandler'>▼</span>
          </span>
        </div>

        <div class='post-header-details' style='display:inline-block'>
          <a :href="post.url" target="_blank">
            <h1>{{ post.title.rendered }}</h1>
          </a>
          <span v-if="post.url" class="host">
            ({{ post.url | host }})
          </span>

          <p class="meta">
            {{ post.score || 0 }} points
            <!-- | by <router-link :to="'/user/' + post.by">{{ post.by }}</router-link> -->
            {{ post.date | timeAgo }} ago
          </p>
        </div>
      </div>

      <div class="post-view-comments">
        <button @click="toggleShowContent">{{contentButtonText}}</button>
        <div v-if="showContent"  v-html='post.content.rendered'>
        </div>
      </div>
      <br />
      <compose-comment></compose-comment>
      <br />
      <comments-list :comments='comments'></comments-list>
    </template>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import CommentsList from '@/components/CommentsList.vue'
import ComposeComment from '@/components/ComposeComment.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'post-view',
  components: { Spinner, CommentsList, ComposeComment },
  data () {
    return {
      showContent: true,
      loading: true
    }
  },
  computed: {
    contentButtonText () {
      return this.showContent ? '-' : '+'
    },
    post () {
      return this.$store.state.posts[this.$route.params.id]
    },

    comments () {
      return this.postComments[this.$route.params.id] || []
    },
    ...mapState({
      postId (state) {
        return state.route.params.id
      },

      posts (state) {
        return state.posts
      },
      postComments (state) {
        return state.postComments
      }
    })
  },

  beforeMount () {
    this.$store.dispatch('fetchArticle', {
      id: this.postId
    }).then(() => {
      this.loading = false
    })
    // Fetch comments
    this.$store.dispatch('commentsFetch', {
      postId: this.postId
    })
  },
  methods: {
    ...mapActions(['commentsCreate', 'upvote', 'downvote']),
    toggleShowContent () {
      this.showContent = !this.showContent
    },

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

<style lang="stylus">
.post-view-header
  background-color #fff
  padding 1.8em 2em 1em
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
    &:hover
      cursor pointer
      color #ff6600

    &.active
      color #ff6600 !important
      &:hover
        cursor pointer
        color #888

.post-view-comments
  background-color #fff
  margin-top 10px
  padding 1em 2em .5em

  .row, h2
    display: none

.post-view-comments-header
  margin 0
  font-size 1.1em
  padding 1em 0
  position relative
  .spinner
    position absolute
    top 0
    right 0
    bottom auto

.comment-children
  list-style-type none
  padding 0
  margin 0

@media (max-width 600px)
  .post-view-header
    h1
      font-size 1.25em
</style>
