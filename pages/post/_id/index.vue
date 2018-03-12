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
import Spinner from '~/components/Spinner'
import CommentsList from '~/components/CommentsList'
import CommentCompose from '~/components/CommentCompose'
import PostSidebar from '~/components/post/PostSidebar'
import PostHeader from '~/components/post/PostHeader'
import PostSelectionIcons from '~/components/post/PostSelectionIcons'
import PostMeta from '~/components/post/PostMeta'
import RelatedLinkList from '~/components/RelatedLinkList'
import RelatedLinkCompose from '~/components/RelatedLinkCompose'
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
    PostMeta,
    PostHeader,
    PostSelectionIcons
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
