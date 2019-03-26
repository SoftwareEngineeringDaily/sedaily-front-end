<template>
  <div class="row">
    <div
    v-if="post"
    class="post-view col-md-9">
      <div class="post-header">
        <post-topics
        :post="post"
        />
        <post-header
        :post="post"
        />
      </div>
        <div class="post-meta">
          <post-meta :post="post" />
        </div>

        <!--<div class="post-selection-icons">
          <post-selection-icons
          :show-comments="showComments"
          :show-related-links="showRelatedLinks"
          :show-post-content="showPostContent"
          @selectPostContent="selectPostContent"
          @selectRelatedLinks="selectRelatedLinks"
          @selectComments="selectComments" />
        </div>-->

        <div
        v-if="showPostContent"
        class="post-content">
        <div
        class="post-transcript"
        v-html="postContent" />

        <div class="voting-arrows-container">
          <voting-arrows
          :upvoted="post.upvoted"
          :downvoted="post.downvoted"
          :upvote-handler="upvoteHandler"
          :downvote-handler="downvoteHandler"
          :score="post.score" />
        </div>
        <div
        v-if="isLoggedIn">
        <hr>
        <div class="col-md-12">
          <comment-compose
          v-if="forumThreadId"
          :entityId="forumThreadId"
          :rootEntityType='"forumthread"' />
        </div>
      </div>

      <hr>
      <div class="row comments">
        <div class="col-md-8">
          <h3 class="section-title"> Comments </h3>
          <comments-list :comments="comments" />
        </div>
      </div>
    </div>



    <div
    v-if="showComments"
    class="comments">
    <comment-compose v-if="forumThreadId"
    :entityId="forumThreadId"
    :rootEntityType='"forumthread"' />
    <br>
    <h3 class="section-title"> Comments </h3>
    <comments-list
    :comments='comments'
    :rootEntityType='"forumthread"'
    :loading="isLoadingComments"
    />
    </div>
    </div>
    <div class="view-top col-md-3">
      <div class="related-links">
        <h4 class='section-title'> Related Links </h4>
        <span v-if=" post && post.transcriptURL">
          <a :href="post.transcriptURL" target="_blank" class="transcript">Transcript</a>
        </span>
        <span v-else-if="post && post.transcriptUrl">
          <a :href="post.transcriptUrl" target="_blank" class="transcript">Transcript</a>
        </span>
        <span v-else></span>
        <related-link-list :related-links="relatedLinks" />
        <related-link-compose v-if="isLoggedIn" />
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import CommentsList from '@/components/CommentsList.vue'
import CommentCompose from '@/components/CommentCompose.vue'
import RelatedLinkList from '@/components/RelatedLinkList.vue'
import VotingArrows from '@/components/VotingArrows.vue'
import RelatedLinkCompose from '@/components/RelatedLinkCompose.vue'
import PostSidebar from '@/components/post/PostSidebar'
import PostHeader from '@/components/post/PostHeader'
import PostSelectionIcons from '@/components/post/PostSelectionIcons'
import PostMeta from '@/components/post/PostMeta'
import PostTopics from '@/components/post/PostTopics'
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
    PostTopics,
    PostMeta,
    PostHeader,
    PostSelectionIcons,
    VotingArrows
  },
  data () {
    return {
      showPostContent: true,
      showRelatedLinks: false,
      showComments: false,
      isLoadingComments: false,
      loading: true
    }
  },
  computed: {
    forumThreadId () {
      if (!this.isLoggedIn) return false
      if (!(this.post && this.post.thread)) return false
      return this.post.thread._id
    },

   postContent () {
     if (this.post.cleanedContent) {
       return this.post.cleanedContent.split('<h2>Sponsors</h2>')[0]
     }
     else if (this.post.content.rendered) {
       return this.post.content.rendered.split('<h2>Sponsors</h2>')[0]
     } else {
       return ""
     }
   },
    post () {
      return this.$store.state.posts[this.$route.params.id]
    },
    metaDescription () {
      const maxLength = 400;
      const el = document.createElement('template')
      el.innerHTML = this.post.content.rendered.trim()
      // spans contain text to extract "summary"
      const paras = el.content.querySelectorAll('span')
      let description = '';
      for (let para of paras) {
        description += para.innerText + ' ';
        if (description.length >= maxLength) {
          break;
        }
      }
      if (description.length > maxLength) {
        return description.substr(0, maxLength-3) + '...'
      }
      return description;
    },
    relatedLinks () {
      return this.postRelatedLinks[this.$route.params.id] || []
    },

    comments () {
      if (!(this.post && this.post.thread)) return []
      const parentCommentIds = this.entityComments[this.post.thread._id] || []
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

    ...mapGetters(['isLoggedIn', 'metaTag']),
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
    }).then(({ post }) => {
      this.loading = false

      this.isLoadingComments = true
      // Fetch comments
      this.commentsFetch({
        entityId: post.thread._id
      }).then(() => {
        this.isLoadingComments = false
      }).catch(() => {
        this.isLoadingComments = false
      })
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
    const title = `${this.post.title.rendered} | Software Daily`
    const { metaDescription } = this
    return {
      title,
      meta: [
        this.metaTag('og:title', title),
        this.metaTag('og:url', location.href),
        this.metaTag('og:description', metaDescription),
        this.metaTag('description', metaDescription),
        // links must use https
        this.metaTag('og:image', this.post.featuredImage.replace('http://','https://'))
      ]
    }
  }
}
</script>

<style lang="stylus">
.post-content p .size-full
  max-width 175px!important
  max-height 175px!important
.post-content a .size-full
  max-width 90vw!important
  max-height none!important
.post-content
  img, figure
    width 100%
    max-width  90vw
    height auto
  .comments
    margin 0 5px

.post-transcript
  h2,h3,h4,table
    margin 30px 20px
  p
    text-align justify
    font-size 14px
    margin 30px 20px
  .size-large
    width 100%
    height 100%
  .row
    .row
      display none
.voting-arrows-container
  width 10%
  margin 0 20px
  align-self flex-end
.post-view
  background-color white
  padding-bottom 100px
  box-shadow 0 1px 2px rgba(0,0,0,.1)

.comment-children
  list-style-type none
  padding 0
  margin 0
.view-top
  padding 3rem 2rem
  background-color white
  box-shadow 0 1px 2px rgba(0,0,0,.1)

.post-header
  grid-row 1
  grid-column 1
  padding-top 2rem

.transcript
  font-size: 16px;
  font-weight: normal;
  color: #856aff;
  opacity: 0.7;

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

.comment-container[data-v-3476be63] {
    width: 100% !important;
}


@media (max-width 600px)
  .post-view-header
    h1
      font-size 1.25em
.view-top
  padding 1.5rem 2rem
.post-view
  padding-bottom 5px
</style>
