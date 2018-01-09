<template>
  <div class="post-view container" v-if="post">
    <template v-if="post">

      <div class="row primary-post-header">
        <div class="col-md-1">
          <voting-arrows
          :upvoted="post.upvoted"
          :downvoted="post.downvoted"
          :upvoteHandler="upvoteHandler"
          :downvoteHandler="downvoteHandler"
          :score="post.score"></voting-arrows>
        </div>

        <div class="col-md-10">
          <h1 class="header-title" >{{ post.title.rendered | decodeString }}</h1>
        </div>
      </div>
      <div class="post-view-header row">
        <div class='post-header-details' style='display:inline-block'>
          <a :href="post.url" target="_blank">

          </a>
          <span v-if="post.url" class="host">
            ({{ post.url | host }})
          </span>

          <p class="meta">

            <span class="play-button" @click='setActivePostInPlayer(post)'>
              <img class="play-icon" src="../assets/play.png" alt="play">
            </span>
            <span class='details-about-post'>
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
          </span>
          </p>
        </div>
      </div>

      <div class="row">
        <div class="post-view-comments col-md-12">
          <div class="selection-icons">
            <span @click="selectPostContent">
              <img class="icon" src="../assets/icons/post.png"
              :class="{ active: showPostContent }"
              alt="Post Content">
            </span>

            <span @click="selectRelatedLinks">
              <img class="icon" src="../assets/icons/relatedlinks.png"
              :class="{ active: showRelatedLinks}"
              alt="Related Links">
            </span>

            <span @click="selectComments">
              <img class="icon" src="../assets/icons/comments.png"
              :class="{ active: showComments}"
              alt="Comments">
            </span>
          </div>


          <div v-if="showPostContent">
            <div v-html='postContent' class='post-transcript'></div>


            <div class="row">
              <div class="col-md-12">
                <comment-compose v-if="isLoggedIn"></comment-compose>
              </div>
            </div>
            <br />
            <br />
            <div class="row">
              <div class="col-md-7">
                <h3 class='section-title'> Comments </h3>
                <comments-list :comments='comments'></comments-list>
              </div>

              <div class="col-md-4">
                <related-link-list :relatedLinks='relatedLinks'></related-link-list>
                <related-link-compose v-if="isLoggedIn"></related-link-compose>
              </div>
            </div>
          </div>

          <div class="related-links-container" v-if="showRelatedLinks">
            <related-link-list :relatedLinks='relatedLinks'></related-link-list>
            <related-link-compose v-if="isLoggedIn"></related-link-compose>
          </div>

          <div v-if="showComments">
            <comment-compose v-if="isLoggedIn"></comment-compose>
            <br />
            <h3 class='section-title'> Comments </h3>
            <comments-list :comments='comments'></comments-list>
          </div>

        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import CommentsList from '@/components/CommentsList.vue'
import CommentCompose from '@/components/CommentCompose.vue'
import RelatedLinkList from '@/components/RelatedLinkList.vue'
import RelatedLinkCompose from '@/components/RelatedLinkCompose.vue'
import VotingArrows from '@/components/VotingArrows.vue'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'post-view',
  components: { Spinner, CommentsList, CommentCompose, RelatedLinkList, RelatedLinkCompose, VotingArrows },
  data () {
    return {
      showPostContent: true,
      showRelatedLinks: false,
      showComments: false,
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

    setActivePostInPlayer: function (post:any) {
      this.$store.commit('setActivePostInPlayer', { post })
    },
    selectPostContent () {
      this.showRelatedLinks = false
      this.showComments = false
      this.showPostContent = false
      this.showPostContent = true
    },

    selectComments () {
      this.showRelatedLinks = false
      this.showComments = false
      this.showPostContent = false
      this.showComments = true
    },

    selectRelatedLinks () {
      this.showRelatedLinks = false
      this.showComments = false
      this.showPostContent = false
      this.showRelatedLinks = true
    },
    upvoteHandler () {
      this.upvote({
        id: this.postId
      })
    },
    downvoteHandler () {
      this.downvote({
        id: this.postId
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

primary-color = #856AFF
secondary-color = #FF8B6A

.post-transcript {
}

.play-button

  height 80px
  top 40px
  left 70px
  cursor pointer

  .play-icon
    width 80px
.details-about-post {
  margin-top: 20px;
  display: inline-block;
}

.selection-icons {
  margin-bottom: 30px;
  .icon {
    padding-right: 20px
    cursor: pointer
    opacity 0.4

    &.active {
      opacity 1
    }
  }
}

.header-title
  margin-top 15px
  font-weight 200

.post-view-header
  background primary-color
  color white
  margin-top 20px
  box-shadow 0 1px 2px rgba(0,0,0,.1)

  .host, .meta, .meta a
    color white
    font-weight 200
  .meta a
    text-decoration underline

.post-view-comments
  background-color #fff
  margin-top 10px
  padding 1em 2em .5em

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
