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
        @selectPostContent="select('postContent')"
        @selectRelatedLinks="select('relatedLinks')"
        @selectComments="select('comments')" />
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
          <h3 class="section-title">Comments</h3>
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
      <h3 class="section-title">Comments</h3>
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
      show: {
        postContent: true,
        relatedLinks: false,
        comments: false
      },
      loading: true
    }
  },
  beforeMount () {
    this.fetchArticle({ id: this.postId })
      .then(() => { this.loading = false })
    this.commentsFetch({ entityId: this.postId })
    this.relatedLinksFetch({ postId: this.postId })
  },
  computed: {
    ...mapGetters([
      'isLoggedIn',
      'metaTag'
    ]),
    ...mapState({
      activePlayerPost: 'activePlayerPost',
      playerState: 'playerState',
      posts: 'posts',
      postRelatedLinks: 'postRelatedLinks',
      entityComments: 'entityComments',
      commentsMap: state => state.comments
    }),

    postContent () {
      return this.post.cleanedContent || this.post.content.rendered
    },
    postId () {
      return this.$route.params.id
    },
    post () {
      return this.posts[this.postId]
    },
    postSummary () {
      const maxLength = 400;
      const el = document.createElement('template')
      el.innerHTML = this.post.content.rendered.trim()
      // spans contain text to extract "summary"
      const paras = el.content.querySelectorAll('span')
      let summary = '';
      for (let para of paras) {
        summary += para.innerText + ' ';
        if (summary.length >= maxLength) break
      }
      if (summary.length > maxLength) {
        return summary.substr(0, maxLength-3) + '...'
      }
      return summary
    },
    relatedLinks () {
      return this.postRelatedLinks[this.postId] || []
    },
    comments () {
      const parentCommentIds = this.entityComments[this.postId] || []
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
    }
  },
  methods: {
    ...mapActions([
      'upvote',
      'relatedLinksFetch',
      'downvote',
      'fetchArticle',
      'commentsFetch',
      'playEpisode',
      'updatePlayerState'
    ]),
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
    select (property) {
      Object.keys(this.show)
        .filter(key => key !== property)
        .forEach(key => this.show[key] = false)
      this.show[property] = true
    },
    upvoteHandler () {
      this.upvote({ id: this.postId })
    },
    downvoteHandler () {
      this.downvote({ id: this.postId })
    }
  },
  metaInfo() {
    // wait for post before updating meta
    return !this.post
      ? {}
      : {
          meta: [
            this.metaTag('og:title', this.post.title.rendered),
            this.metaTag('og:url', location.href),
            this.metaTag('og:description', this.postSummary),
            // links must use https
            this.metaTag('og:image', this.post.featuredImage.replace('http://','https://'))
          ]
        }
  }
}
</script>

<style lang="stylus">
  .post-transcript
    .row
      .row
        display none
</style>

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
