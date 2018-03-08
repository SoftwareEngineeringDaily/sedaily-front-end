<template>
  <div
    v-if="post"
    class="post-view container-fluid">
    <template v-if="post">
      <post-sidebar />

      <div class="row primary-post-header">
        <div class="col-md-11">
          <h1 class="header-title" >{{ post.title.rendered }}</h1>
        </div>
        <div class="col-md-1 voting-arrows-container">
          <voting-arrows
            :upvoted="post.upvoted"
            :downvoted="post.downvoted"
            :upvote-handler="upvoteHandler"
            :downvote-handler="downvoteHandler"
            :score="post.score" />
        </div>
      </div>
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
              <span class="publication-date">Published on {{ post.date }}</span>
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

      <div class="row">
        <div class="post-view-comments col-md-12">
          <div class="selection-icons">
            <span @click="selectPostContent">
              <img
                :class="{ active: showPostContent }"
                class="icon"
                src="~assets/icons/post.png"
                alt="Post Content">
            </span>

            <span @click="selectRelatedLinks">
              <img
                :class="{ active: showRelatedLinks}"
                class="icon"
                src="~assets/icons/relatedlinks.png"
                alt="Related Links">
            </span>

            <span @click="selectComments">
              <img
                :class="{ active: showComments}"
                class="icon"
                src="~assets/icons/comments.png"
                alt="Comments">
            </span>
          </div>


          <div v-if="showPostContent">
            <div
              class="post-transcript"
              v-html="postContent" />

            <div class="row">
              <div class="col-md-12">
                <comment-compose v-if="isLoggedIn" />
              </div>
            </div>
            <br>
            <br>
            <div class="row">
              <div class="col-md-7">
                <h3 class="section-title"> Comments </h3>
                <comments-list :comments="comments" />
              </div>

              <div class="col-md-4">
                <related-link-list :related-links="relatedLinks" />
                <related-link-compose v-if="isLoggedIn" />
              </div>
            </div>
          </div>

          <div
            v-if="showRelatedLinks"
            class="related-links-container">
            <related-link-list :related-links="relatedLinks" />
            <related-link-compose v-if="isLoggedIn" />
          </div>

          <div v-if="showComments">
            <comment-compose v-if="isLoggedIn" />
            <br>
            <h3 class="section-title"> Comments </h3>
            <comments-list :comments="comments" />
          </div>

        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Spinner from '~/components/Spinner'
import CommentsList from '~/components/CommentsList'
import CommentCompose from '~/components/CommentCompose'
import PostSidebar from '~/components/PostSidebar'
import RelatedLinkList from '~/components/RelatedLinkList'
import RelatedLinkCompose from '~/components/RelatedLinkCompose'
import VotingArrows from '~/components/VotingArrows'
import { mapState, mapActions, mapGetters } from 'vuex'
import { PlayerState } from '~/utils/playerState'

export default {
  components: {
    Spinner,
    CommentsList,
    CommentCompose,
    RelatedLinkList,
    RelatedLinkCompose,
    PostSidebar,
    VotingArrows
  },
  data () {
    return {
      showPostContent: true,
      showRelatedLinks: false,
      showComments: false
    }
  },
  computed: {
    postId () {
      return this.$route.params.id
    },
    postContent () {
      if (this.post.cleanedContent) {
        return this.post.cleanedContent
      } else {
        return this.post.content.rendered
      }
    },
    post () {
      return this.posts[this.postId]
    },
    relatedLinks () {
      return this.postRelatedLinks[this.postId] || []
    },
    comments () {
      return this.postComments[this.postId] || []
    },
    isActiveEpisode () {
      return this.activePlayerPost && this.activePlayerPost._id === this.post._id
    },
    canPause () {
      return this.isActiveEpisode && this.playerState === PlayerState.PLAYING
    },
    canPlay () {
      return !this.isActiveEpisode || this.playerState !== PlayerState.PLAYING
    },
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      activePlayerPost (state) {
        return state.activePlayerPost
      },
      playerState (state) {
        return state.playerState
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

  fetch ({ store, params }) {
    store.dispatch('commentsFetch', {
      postId: params.id
    })

    store.dispatch('relatedLinksFetch', {
      postId: params.id
    })

    return store.dispatch('fetchArticle', {
      id: params.id
    })
  },

  methods: {
    ...mapActions(['commentsCreate', 'upvote', 'relatedLinksFetch',
      'downvote', 'fetchArticle', 'commentsFetch', 'playEpisode', 'updatePlayerState']),
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

<style scoped lang="stylus">
@import '../../../assets/stylus/variables'
.voting-arrows-container
  align-self flex-end

.primary-post-header
  padding-top 2rem

.player-controls
  color white
  .player-control
    width 25px
    cursor pointer
    &.text-only
      cursor default

.selection-icons
  margin-bottom 30px
  .icon
    padding-right 20px
    cursor pointer
    max-width 55px
    opacity 0.4
    &.active
      opacity 1

.header-title
  margin-top 15px
  font-weight 500
  font-size 4.5rem

.post-view-header
  background primary-color
  color white
  margin-top 20px
  box-shadow 0 1px 2px rgba(0,0,0,.1)
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

.comment-children
  list-style-type none
  padding 0
  margin 0

@media (max-width 600px)
  .post-view-header
    h1
      font-size 1.25em
</style>
