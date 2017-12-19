<template>
  <div class="post-view" v-if="post">
    <template v-if="post">
      <div class="post-view-header row">

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
                      :description="postContent"
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

      <div class="row">
        <div class="post-view-comments col-md-8">
          <button @click="toggleShowContent">{{contentButtonText}}</button>
          <div v-if="showContent"  v-html='postContent'>
          </div>
        </div>
        <div class="col-md-4 related-links-container">
          <related-link-list :relatedLinks='relatedLinks'></related-link-list>
          <related-link-compose v-if="isLoggedIn"></related-link-compose>
        </div>
      </div>
      <br />
      <br />
      <comment-compose v-if="isLoggedIn"></comment-compose>
      <br />
      <comments-list :comments='comments'></comments-list>
    </template>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import CommentsList from '@/components/CommentsList.vue'
import CommentCompose from '@/components/CommentCompose.vue'
import RelatedLinkList from '@/components/RelatedLinkList.vue'
import RelatedLinkCompose from '@/components/RelatedLinkCompose.vue'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'post-view',
  components: { Spinner, CommentsList, CommentCompose, RelatedLinkList, RelatedLinkCompose },
  data () {
    return {
      showContent: true,
      loading: true
    }
  },
  computed: {
    postContent () {
      if (this.post.cleanedContent) {
        return this.post.cleanedContent
      } else {
        return this.post.content.rendered
      }
    }
    contentButtonText () {
      return this.showContent ? '-' : '+'
    },
    post () {
      return this.$store.state.posts[this.$route.params.id]
    },

    relatedLinks () {
      return this.postRelatedLinks[this.$route.params.id] || []
    },

    comments () {
      return this.postComments[this.$route.params.id] || []
    },
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      postId (state) {
        return state.route.params.id
      },

      posts (state) {
        return state.posts
      },

      postRelatedLinks (state) {
        return state.postRelatedLinks
      },

      postComments (state) {
        return state.postComments
      }
    })
  },

  beforeMount () {
    this.fetchArticle({
      id: this.postId
    }).then(() => {
      this.loading = false
    })
    // Fetch comments
    this.commentsFetch({
      postId: this.postId
    })

    // Fetch relatedLinks
    this.relatedLinksFetch({
      postId: this.postId
    })
  },

  methods: {
    ...mapActions(['commentsCreate', 'upvote', 'relatedLinksFetch',
      'downvote', 'fetchArticle', 'commentsFetch']),
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
    &:hover
      cursor pointer
      color #3F58AF

    &.active
      color #3F58AF !important
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
.related-links-container{
  padding-top: 30px;
}
.comment-children
  list-style-type none
  padding 0
  margin 0

@media (max-width 600px)
  .post-view-header
    h1
      font-size 1.25em
</style>
