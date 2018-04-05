<template>
  <div
    v-if="post"
    class="post-view">
    <div class="post-header">
      <post-header
        :post="post"
        :downvote-handler="downvoteHandler"
        :upvote-handler="upvoteHandler" />
    </div>

    <div class="post-meta">
      <post-meta :post="post" />
    </div>

    <div class="post-selection-icons">
      <post-selection-icons
        :show-comments="showComments"
        :show-related-links="showRelatedLinks"
        :show-post-content="showPostContent"
        @selectPostContent="selectPostContent"
        @selectRelatedLinks="selectRelatedLinks"
        @selectComments="selectComments" />
    </div>

    <div
      v-if="showPostContent"
      class="post-content">
      <div
        class="post-transcript"
        v-html="postContent" />

      <div
        v-if="isLoggedIn">
        <hr>
        <div class="col-md-12">
          <comment-compose />
        </div>
      </div>

      <hr>

      <div class="row">
        <div class="col-md-8">
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
      class="related-links">
      <related-link-list :related-links="relatedLinks" />
      <related-link-compose v-if="isLoggedIn" />
    </div>

    <div
      v-if="showComments"
      class="comments">
      <comment-compose v-if="isLoggedIn" />
      <br>
      <h3 class="section-title"> Comments </h3>
      <comments-list :comments="comments" />
    </div>

    <div class="side-bar">
      <post-sidebar
        :comments="comments.length"
        :related-links="relatedLinks.length" />
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import CommentsList from '@/components/CommentsList.vue'
import CommentCompose from '@/components/CommentCompose.vue'
import RelatedLinkList from '@/components/RelatedLinkList.vue'
import RelatedLinkCompose from '@/components/RelatedLinkCompose.vue'
import PostSidebar from '@/components/post/PostSidebar'
import PostHeader from '@/components/post/PostHeader'
import PostSelectionIcons from '@/components/post/PostSelectionIcons'
import PostMeta from '@/components/post/PostMeta'
import { mapState, mapActions, mapGetters } from 'vuex'
import { PlayerState } from './../utils/playerState'
import { parseIdsIntoComments } from '@/utils/comment.utils'

export default {
  name: 'post-view',
  components: {
    Spinner,
    CommentsList,
    CommentCompose,
    RelatedLinkList,
    RelatedLinkCompose,
    PostSidebar,
    PostMeta,
    PostHeader,
    PostSelectionIcons
  },
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
    postSummary () {
      const el = document.createElement('template')
      el.innerHTML = this.post.content.rendered.trim()
      // use first span text as "summary"
      const summary = el.content.querySelector('span')
      return summary ? summary.innerText : ''
    },
    relatedLinks () {
      return this.postRelatedLinks[this.$route.params.id] || []
    },

    comments () {
      const parentCommentIds = this.entityComments[this.$route.params.id] || []
      return parseIdsIntoComments({
        entityParentCommentIds: parentCommentIds,
        commentsMap: this.commentsMap
      })
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

    ...mapGetters(['isLoggedIn', 'getMetaTag']),
    ...mapState({
      activePlayerPost (state) {
        return state.activePlayerPost
      },

      playerState (state) {
        return state.playerState
      },

      postId (state) {
        return state.route.params.id
      },

      posts (state) {
        return state.posts
      },

      postRelatedLinks (state) {
        return state.postRelatedLinks
      },

      commentsMap (state) {
        return state.comments
      },

      entityComments (state) {
        return state.entityComments
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
      entityId: this.postId
    })

    // Fetch relatedLinks
    this.relatedLinksFetch({
      postId: this.postId
    })
  },

  methods: {
    ...mapActions(['upvote', 'relatedLinksFetch',
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
  },
  metaInfo() {
    // wait for post before updating meta
    if (!this.post) {
      return {}
    }
    return {
      meta: [
        this.getMetaTag('og:title', this.post.title.rendered),
        this.getMetaTag('og:url', location.href),
        this.getMetaTag('og:description', this.postSummary),
        this.getMetaTag('og:image', this.post.featuredImage),
      ]
    }
  }
}
</script>

<style scoped lang="stylus">
@import './../css/variables'

.comment-children
  list-style-type none
  padding 0
  margin 0

.post-view
  display grid
  grid-row-gap 10px
  grid-column-gap 10px

.post-header
  grid-row 1
  grid-column 1

.post-meta
  grid-row 2
  grid-column 1

.post-selection-icons
  grid-row 3
  grid-column 1

.post-content,
.related-link,
.comments
  grid-row 4
  grid-column 1

.side-bar
  grid-row 1 / span 4
  grid-column 2

@media (max-width 600px)
  .post-view-header
    h1
      font-size 1.25em
</style>
