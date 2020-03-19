<template>
  <topic-page-template>
    <template v-slot:content>
      <spinner :show="loading"/>
      
      <div class="topicpage-header">
        <h1 class="header-title">{{topicData.name}}</h1>
        <img :src="topicPageData.logo" />         
      </div>
      
      <topic-page-maintainer :user="topicData.maintainer" />
      
      <!-- <div class="topicpage-content" v-html="topicPageData.content"></div> -->

      <div class="post-content">
      <highlightable
        :contentUrl="contentUrl"
        :forumThreadId="topicPageData._id"
        :rootEntityType="'topic'"
        @highlight="onHighlight">
        <div v-html="highlightedContent" />
      </highlightable>
      </div>
      
      <comments-list
        v-if="topicPageData._id"
        :initialComment="''"
        :post="{}"
        :forumThreadId="topicPageData._id"
        :rootEntityType="'topic'"
        :commentCount="commentCount"
        :comments="comments" />
    </template>

    <template v-slot:side>
      <related-link-list
        :headline="'Related Episodes'"
        :related-links="relatedEpisodes"
        :is-logged-in="isLoggedIn">
        <related-link-compose
          v-if="isLoggedIn"
          :headline="'Add New Episode'"
          :rootEntityType="'topic'"
          :type="'episode'" />
      </related-link-list>
      <related-link-list
        :headline="'Related Links'"
        :related-links="relatedLinks"
        :is-logged-in="isLoggedIn">
        <related-link-compose
          v-if="isLoggedIn"
          :rootEntityType="'topic'"
          :headline="'Add New Link'" />
      </related-link-list>
      <comments-list
        :filter="'highlight'"
        :initialComment="''"
        :post="{}"
        :forumThreadId="topicPageData._id"
        :rootEntityType="'topic'"
        :commentCount="highlightCount"
        :comments="comments" />
    </template>
  </topic-page-template>    
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import isArray from 'lodash/isArray'
import marked from 'marked'
import Spinner from '@/components/Spinner';
import { TopicPageTemplate, TopicPageMaintainer } from '@/views/topic';
import Avatar from '@/components/Avatar'
import CommentsList from '@/components/comment/CommentsList'
import { parseIdsIntoComments } from '@/utils/comment.utils'
import RelatedLinkList from '@/components/related/RelatedLinkList'
import RelatedLinkCompose from '@/components/related/RelatedLinkCompose'
import Highlightable from '@/components/Highlightable'

export default {
  name: 'topicpage-content',
  components: {
    Spinner,
    TopicPageMaintainer,
    TopicPageTemplate,
    Avatar,
    CommentsList,
    RelatedLinkList,
    RelatedLinkCompose,
    Highlightable
  },
  beforeMount () {
     marked.setOptions({
      breaks: true
    })
    this.loadTopic()
    this.loadRelatedLinks()
  },
  data () {
    return {
      loading: false,
      topicData: {},
      topicPageData: {},
      highlight: '',
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'metaTag']),
    ...mapState({      
      commentsMap (state) {
        return state.comments
      },

      entityComments (state) {
        return state.entityComments
      },

      postRelatedLinks (state) {
        return state.postRelatedLinks
      }
    }),
    
    contentUrl () {
      return window.location.href
    },

    comments () {
      if (!this.entityComments || !this.entityComments[this.topicPageData._id]) return []
      const parentCommentIds = this.entityComments[this.topicPageData._id] || []
      return parseIdsIntoComments({
        entityParentCommentIds: parentCommentIds,
        commentsMap: this.commentsMap
      })
    },

    commentCount () {
      if (!this.comments) {
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

    relatedLinks () {
      return (this.postRelatedLinks[this.$route.params.slug] || [])
        .filter(p => (p.type !== 'episode'))
    },

    relatedEpisodes () {
      return (this.postRelatedLinks[this.$route.params.slug] || [])
        .filter(p => (
          p.url &&
          p.url.search(/softwaredaily\.com/g) >= 0 &&
          p.type === 'episode'
        ))
    },

    highlightedContent () {
      const content = this.topicPageData.content || ''
      return this.highlightContent(content)
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
  },
  methods: {
    ...mapActions(['getTopicPage', 'commentsFetch', 'relatedLinksFetch']),

    loadTopic () {
      this.loading = true
      this.getTopicPage(this.$route.params.slug).then((data) => {
        this.topicData = data.topic
        this.topicPageData = this.convertMarkdown(data.topicPage)
        this.loadComments()
      }).catch((e) => {
        this.$toasted.error((e.response) ? e.response.data : e, { duration : 0 })
      }).finally(() => {
        this.loading = false
      })
    },

    loadComments () {
      this.commentsFetch({ entityId: this.topicPageData._id }).then((data) => {
        
      }).catch((e) => {
        this.$toasted.error((e.response) ? e.response.data : e, { duration : 0 })
      })
    },

    loadRelatedLinks () {
      this.relatedLinksFetch({ topicSlug: this.$route.params.slug })
    },

    convertMarkdown (topicPage) {
      if (topicPage.content) {       
        const htmlMarkdown = marked(topicPage.content);
        topicPage.content = this.updateLinkToOpenTab(htmlMarkdown);
      }
      return topicPage
    },

    updateLinkToOpenTab(html) {
      const regExLink = /\<a href=/gi;
      const updatedLink = '<a target="_blank" href=';
      return html.replace(regExLink, updatedLink);
    },

    onHighlight (highlight = '') {
      this.$set(this, 'highlight', highlight)
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
  },

  metaInfo() {
    if (!this.topicData || !this.topicData.name) {
      return {}
    }

    const title = `${this.topicData.name} | Software Daily`
    const featuredImage = this.topicPageData.logo || ''

    return {
      title,
      meta: [
        this.metaTag('og:title', title),
        this.metaTag('og:url', location.href),
        // this.metaTag('og:description', metaDescription),
        // this.metaTag('description', metaDescription),

        // links must use https
        this.metaTag('og:image', featuredImage.replace('http://','https://'))
      ]
    }
  }
}
</script>

<style scoped lang="stylus">
  .topic-page
    margin-top 5px
    
    .spinner
      margin: 0 auto;
      display block
   
  >>> mark
    cursor pointer
    font-weight 700
    color #fff
    background-color: #a591ff
    opacity 0.7
    &::selection
      background-color: #a591ff
    &:hover
      opacity 1.0
    
</style>
