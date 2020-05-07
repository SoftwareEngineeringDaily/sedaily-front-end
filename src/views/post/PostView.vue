<template>
  <div v-if="post && post._id" class="row top-space">
    <div class="post-view col-8">
      <post-topics :post="post" />
      <post-title :post="post" />

      <post-meta
        :post="post"
        :showDuration="false" />

      <post-author :post="post" />

      <div class="twitter-users" v-if="post.relatedTweetUsers">
        <span v-for="user in post.relatedTweetUsers" :key="user.id_str">
          <a :href="`https://twitter.com/${user.screen_name}`" target="_blank">@{{user.screen_name}}</a>
        </span>
      </div>

      <post-action-buttons :post="post" />
      <div
        v-if="showPostContent"
        class="post-content">
        <highlightable
          :contentUrl="contentUrl"
          :forumThreadId="forumThreadId"
          :socialShareUsers="relatedTweetUsers"
          @highlight="onHighlight">
          <div class="post-transcript" v-html="highlightedContent" />
        </highlightable>
      </div>

      <highlightable
        :contentUrl="contentUrl"
        :forumThreadId="forumThreadId"
        :socialShareUsers="relatedTweetUsers"
        @highlight="onHighlight">
        <post-transcript :transcript="highlightedTranscript" />
      </highlightable>

      <div class="post-content">
        <post-sponsors :post="post" />
      </div>

      <comments-list
        :initialComment="comment"
        :post="post"
        :forumThreadId="forumThreadId"
        :rootEntityType="'forumthread'"
        :commentCount="commentCount"
        :comments="comments" />

      <subscription-box />

      <post-social-share
        :post="post"
        :postContent="postContent"/>
    </div>

    <div class="post-sidebar col-4">
      <div class="popular-feed">
        <related-episode-list
          :post="post"
          :relatedEpisodes="relatedEpisodes"
          @onChange="onAddRelatedEpisode"/>

        <related-link-list
          :headline="'Related Links'"
          :isTruncated="true"
          :related-links="relatedLinks"
          :is-logged-in="isLoggedIn">
          <related-link-compose
            v-if="isLoggedIn"
            :headline="'Add New Link'" />
        </related-link-list>

        <related-link-list
          v-if="relatedQuestions.length"
          :headline="'Related Questions'"
          :isTruncated="false"
          :related-links="relatedQuestions"
          :is-logged-in="isLoggedIn" />

        <comments-list
          :filter="'highlight'"
          :initialComment="comment"
          :post="post"
          :isPreview="true"
          :forumThreadId="forumThreadId"
          :rootEntityType="'forumthread'"
          :commentCount="highlightCount"
          :comments="comments" />
      </div>
    </div>

    <post-highlights
      :highlight="highlight"
      :comments="comments"
      :socialShareUsers="relatedTweetUsers"
      :commentCount="highlightCount"
      :post="post" />
  </div>
</template>

<script>
import clone from 'lodash/clone'
import isArray from 'lodash/isArray'
import CommentsList from '@/components/comment/CommentsList'
import RelatedEpisodeList from '@/components/related/RelatedEpisodeList'
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
  SubscriptionBox,
  PostActionButtons,
  PostSocialShare,
  PostTranscript,
  PostHighlights,
} from '@/components/post'
import Highlightable from '@/components/Highlightable'
import store from '@/store'
import { mapState, mapActions, mapGetters } from 'vuex'
import { PlayerState } from '@/utils/playerState'
import { parseIdsIntoComments } from '@/utils/comment.utils'
import { isMobile } from '@/utils/post.utils'
import FeedPopular from '@/components/feed/FeedPopular'
import { FETCH_POST, FETCH_COMMENTS } from '@/store/actions.type'

export default {
  name: 'post-view',
  components: {
    RelatedEpisodeList,
    RelatedLinkList,
    RelatedLinkCompose,
    PostSidebar,
    PostTopics,
    PostMeta,
    PostTitle,
    PostAuthor,
    PostSponsors,
    SubscriptionBox,
    PostActionButtons,
    PostSocialShare,
    PostTranscript,
    PostHighlights,
    CommentsList,
    VotingArrows,
    FeedPopular,
    Highlightable
  },

  data () {
    return {
      showPostContent: true,
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
      const content = this.postContent || ''
      return this.highlightContent(content)
    },

    highlightedTranscript () {
      const content = (this.post && this.post.transcript) ? this.post.transcript : ''
      return this.highlightContent(content)
    },

    relatedTweetUsers () {
      if (!this.post || !this.post.relatedTweetUsers || !this.post.relatedTweetUsers.length) return null

      return this.post.relatedTweetUsers.map(user => ({
        twitter: user.screen_name
      }))
    },

    relatedQuestions () {
      if (!this.post || (this.post && !isArray(this.post.questions))) {
        return []
      }

      return this.post.questions.map(question => ({
        ...question,
        title: question.content,
        url: `${window.location.origin}/topic/${question.entityId}/question/${question._id}`,
        target: '_self',
      }))
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
      return (this.postRelatedLinks[this.$route.params.id] || [])
        .filter(p => (p.type !== 'episode'))
    },

    relatedEpisodes () {
      return this.postRelatedEpisodes || []
    },

    comments () {
      if (!(this.post && this.post.thread)) {
        return []
      }

      const parentCommentIds = this.entityComments[this.post.thread._id] || []

      return parseIdsIntoComments({
        entityParentCommentIds: parentCommentIds,
        commentsMap: this.commentsMap
      })
    },

    commentTotal () {
      if (!this.comments || !isArray(this.comments)) {
        return 0
      }

      let commentCount = this.comments.length

      this.comments.forEach(c => {
        commentCount += (c.replies || [])
          .filter(c => !c.deleted)
          .length
      })

      return commentCount
    },

    commentCount () {
      if (!this.comments || !isArray(this.comments)) {
        return 0
      }

      let comments = this.comments.filter(c => !(c.highlight))
      let commentCount = comments.length

      comments.forEach(c => {
        commentCount += (c.replies || [])
          .filter(c => !c.deleted)
          .length
      })

      return commentCount
    },

    highlightCount () {
      if (!this.comments || !isArray(this.comments)) {
        return 0
      }

      let comments = this.comments.filter(c => !!(c.highlight))
      let commentCount = comments.length

      comments.forEach(c => {
        commentCount += (c.replies || [])
          .filter(c => !c.deleted)
          .length
      })

      return commentCount
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

      postRelatedEpisodes (state) {
        return state.postRelatedEpisodes
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
      'fetchRelatedEpisodes',
      'getTopicsInSearch',
      'downvote',
      'fetchArticle',
      'commentsFetch',
    ]),

    clearData () {
      const { commit } = this.$store
      commit('setPosts', { posts: [] })
      commit('setPost', { post: {}})
      commit('setRelatedEpisodes', [])
    },

    async _fetchArticle () {
      this.clearData()
      const { post } = await this.fetchArticle({ id: this.postId })
      const post_keys = Object.keys(this.$store.state.posts)

      this.loading = false

      // Fetch comments
      if (post.thread) {
        this.isLoadingComments = true
        await this.commentsFetch({ entityId: post.thread._id })
        this.isLoadingComments = false
      }

      // Fetch relatedEpisodes
      await this.fetchRelatedEpisodes({ postId: this.postId })

      // Fetch relatedLinks
      await this.relatedLinksFetch({ postId: this.postId })

      if (post_keys.length) {
        return
      }

      const { posts } = await this.getTopicsInSearch({})

      this.$store.commit('setPosts', { posts })
    },

    async onAddRelatedEpisode () {
      await this.fetchRelatedEpisodes({ postId: this.postId })
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

    onForum (initialContent) {
      this.$router.push({ name: 'NewThread', params: { initialContent }})
    },

    onHighlight (highlight = '') {
      this.$set(this, 'highlight', highlight)
    },
  },

  mounted () {
    if (typeof window === 'undefined') {
      return
    }

    document.documentElement.classList.add(isMobile ? 'is-mobile' : 'is-desktop')
  },

  beforeMount () {
    this._fetchArticle()
  },

  metaInfo() {
    // wait for post before updating meta
    if (!this.post || !this.post.title) {
      return {}
    }

    const title = `${this.post.title.rendered} | Software Daily`
    const { post, metaDescription } = this
    const { featuredImage = '' } = post

    return {
      title,
      meta: [
        this.metaTag('og:title', title),
        this.metaTag('og:url', location.href),
        this.metaTag('og:description', metaDescription),
        this.metaTag('description', metaDescription),

        // links must use https
        this.metaTag('og:image', featuredImage.replace('http://','https://'))
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

.twitter-users
  margin 10px 0 25px 0

  span:not(:first-child)
    margin-left 10px

  a
    color #a591ff

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

  p,
  .imageCaption
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
  padding-left 0
  padding-bottom 220px

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

.is-desktop
  .main-app
    min-width 800px

  .row.top-space
    flex-wrap nowrap

.is-mobile
  .post-view,
  .post-sidebar
    flex: 0 0 100% !important;
    max-width: 100% !important;

@media (max-width 600px)
  .container-fluid
    overflow hidden

  .post-view
    padding-left 15px

  .post-view-header
    h1
      font-size 1.25em

  .post-content a[href="mailto:sponsor@softwaredaily.com"],
  .post-content a[href="mailto:sponsor@softwareengineeringdaily.com"]
    display block
    word-break break-all

.view-top
  padding 1.5rem 2rem

</style>
