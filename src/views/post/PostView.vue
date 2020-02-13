<template>
  <div v-if="post && post._id" class="row top-space">
    <div class="post-view col-lg-7">
      <post-topics :post="post" />
      <post-title :post="post" />
      <post-meta :post="post" :showDuration="false"/>
      <post-author :post="post" />
      <post-action-buttons :post="post" />
      <post-subscribe-feed :post="post" />

      <div
        v-if="showPostContent"
        class="post-content">
        <h6 class="section-title">About the Episode</h6>
        <highlightable
          :contentUrl="contentUrl"
          :forumThreadId="forumThreadId"
          @highlight="onHighlight">
          <div class="post-transcript" v-html="highlightedContent" />
        </highlightable>
      </div>

      <highlightable
        :contentUrl="contentUrl"
        :forumThreadId="forumThreadId"
        @highlight="onHighlight">
        <post-transcript :transcript="highlightedTranscript" />
      </highlightable>

      <div class="post-content">
        <post-sponsors :post="post" />
      </div>

      <comment-box
        :initialComment="comment"
        :post="post"
        :forumThreadId="forumThreadId"
        :comments="comments" />

      <post-subscribe />
    </div>

    <div class="view-top col-lg-1">
      <post-social-share
        :post="post"
        :postContent="postContent"/>
    </div>

    <div class="view-top col-lg-4">
      <div class="popular-feed">
        <post-related
          :post="post" />
        <related-link-list
          :related-links="relatedLinks"
          :is-logged-in="isLoggedIn" />
        <!-- <feed-popular
          :showImg="false"
          :showDuration="false"
          sectionTitle="Popular Stories" /> -->
        <div id="comment-box">
        <comment-box
          :filter="'highlight'"
          :initialComment="comment"
          :post="post"
          :forumThreadId="forumThreadId"
          :comments="comments" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommentBox from '@/components/comment/CommentBox'
import RelatedLinkList from '@/components/related/RelatedLinkList'
import RelatedLinkCompose from '@/components/related/RelatedLinkCompose'
import VotingArrows from '@/components/VotingArrows'
import {
  PostSidebar,
  PostTitle,
  PostMeta,
  PostAuthor,
  PostTopics,
  PostSponsors,
  PostSubscribeFeed,
  PostSubscribe,
  PostActionButtons,
  PostSocialShare,
  PostTranscript,
  PostRelated
} from '@/components/post'
import Highlightable from '@/components/Highlightable'
import store from '@/store'
import { mapState, mapActions, mapGetters } from 'vuex'
import { PlayerState } from '@/utils/playerState'
import { parseIdsIntoComments } from '@/utils/comment.utils'
import FeedPopular from '@/components/feed/FeedPopular'
import { FETCH_POST, FETCH_COMMENTS } from '@/store/actions.type'

export default {
  name: 'post-view',
  components: {
    RelatedLinkList,
    RelatedLinkCompose,
    PostSidebar,
    PostTopics,
    PostMeta,
    PostTitle,
    PostAuthor,
    PostSponsors,
    PostSubscribeFeed,
    PostSubscribe,
    PostActionButtons,
    PostSocialShare,
    PostTranscript,
    PostRelated,
    CommentBox,
    VotingArrows,
    FeedPopular,
    Highlightable
  },
  data () {
    return {
      showPostContent: true,
      showRelatedLinks: false,
      showComments: false,
      comment: '',
      highlight: '',
      isLoadingComments: false,
      loading: false,
    }
  },
  watch: {
    $route(to, from) {
      if (from.params.id !== to.params.id) {
        this._fetchArticle()
      }
    },
  },
  computed: {
    forumThreadId () {
      if (!this.isLoggedIn) return '' // Expects a string
      if (!(this.post && this.post.thread)) return '' // Expects a string
      return this.post.thread._id
    },

    contentUrl () {
      return window.location.href
    },

    postContent () {
      let content

      if (this.post.cleanedContent) {
       content = this.post.cleanedContent
       return content
      }
      else if (this.post.content && this.post.content.rendered) {
       return this.post.content.rendered
      } else {
       return ""
      }
    },

    highlightedContent () {
      let content = this.postContent || ''
      return this.highlightContent(content)
    },

    highlightedTranscript () {
      let content = (this.post && this.post.transcript) ? this.post.transcript : ''
      return this.highlightContent(content)
    },

    post () {
      return this.$store.state.post
    },

    metaDescription () {
      if (!this.post.content) {
        return ''
      }
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

    ...mapGetters(['isLoggedIn', 'metaTag']),
    ...mapState({
      postId (state) {
        return state.route.params.id
      },

      post (state) {
        return state.post
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
  methods: {
    ...mapActions([
      'upvote',
      'relatedLinksFetch',
      'downvote',
      'fetchArticle',
      'commentsFetch'
    ]),

    _fetchArticle () {
      this.fetchArticle({
        id: this.postId
      }).then(({ post }) => {
        this.loading = false
        this.isLoadingComments = true

        if (!post.thread) {
          return
        }

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

    highlightContent (content = '') {
      let comments = (this.comments || [])
        .filter(c => !!(c.highlight))

      comments.forEach(c => {
        content = content.replace(c.highlight, h => {
          return `<mark
            data-entity-id="${c.rootEntity}"
            data-parent-comment-id="${c._id}">${h}</mark>`
        })
      })

      return content
    },

    onForum (text) {
      this.$router.push({ name: 'NewThread', params: {initialContent:text }})
    },

    onHighlight (highlight = '') {
      this.$set(this, 'highlight', highlight)
    },

    onComment (text) {
      this.$set(this, 'comment', text)
      const container = this.$el.querySelector("#comment-box")
      container.scrollIntoView({
        behavior: "smooth",
        block: "end"
      })
    },
  },

  beforeMount () {
    this._fetchArticle()
  },

  beforeRouteUpdate(to, from, next) {
    store.dispatch('fetchArticle', { id: to.params.id })
      .then(({ post }) => {
        store.dispatch('commentsFetch', { entityId: post.thread._id})
          .then(() => {

            store.dispatch('relatedLinksFetch', { postId: to.params.id })

            next();
          }).catch((error) => {
            next(error);
          })
      })
  },

  metaInfo() {
    // wait for post before updating meta
    if (!this.post || !this.post.title) {
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

.sponsors-content
  p
    a
      margin 0 2px
  h2
    margin-top 15px
  .col-12,col-md-6
    align-items center
    margin 15px 0
    display flex
    justify-content center
  a
    margin-left 20px
.top-space
  padding-top 25px
.post-content p .size-full
  max-width 175px!important
  max-height 175px!important
.section-title
  margin-top: 30px;
  text-transform: uppercase;
  font-size: 0.7rem;
  font-weight: 800;
.post-content a .size-full
  max-width 90vw!important
  max-height none!important
.post-content
  img, figure
    margin 15px 0
    display block
    width 100%
    max-width  90vw
    height auto
  .comments
    margin 0 5px
  .section-title
    margin-top 30px
    text-transform uppercase
    font-size .7rem
    font-weight 800
  a
    color #a591ff
    font-weight 600
    span
      font-weight 600 !important

.post-transcript
  font-size 1rem
  figure
    width 98%
  p > img
    display none
  p,.imageCaption
    margin 30px 0
  .size-large
    width 100%
    height 100%
  .row .row,
  .powerpress_player
      display none
.voting-arrows-container
  width 10%
  margin 0 20px
  align-self flex-end

.post-view
  padding-bottom 100px

.comment-children
  list-style-type none
  padding 0
  margin 0
.view-top
  padding 3rem 2rem
  background-color white

.transcript
  font-size: 16px;
  font-weight: normal;
  color: #856aff;
  opacity: 0.7;

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

mark
  cursor pointer
  font-weight 700
  color #fff
  background-color: #a591ff
  opacity 0.7
  &::selection
    background-color: #a591ff
  &:hover
    opacity 1.0

@media (max-width 600px)
  .container-fluid
    overflow hidden
  .post-view-header
    h1
      font-size 1.25em
  .post-content a[href="mailto:sponsor@softwaredaily.com"],
  .post-content a[href="mailto:sponsor@softwareengineeringdaily.com"]
    display block
    word-break break-all
.view-top
  padding 1.5rem 2rem
.post-view
  padding-bottom 5px
</style>
