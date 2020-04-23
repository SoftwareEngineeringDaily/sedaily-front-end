<template>
  <topic-page-template>
    <template v-slot:content>
      <spinner :show="loading"/>
      
      <div class="topicpage-header">
        <h1 class="header-title">
          {{topicData.name}}
          <router-link
            v-if="isMaintainer"
            :to="{name: 'TopicPageEdit', params: $route.params.slug}"
            class="edit-link">
            Edit
          </router-link>
        </h1>
      </div>
            
      <topic-page-maintainer :user="topicData.maintainer" />
      
      <img :src="topicPageData.logo" width="100%" class="topic-logo" />

      <div class="content-block">
        <highlightable
          :contentUrl="contentUrl"
          :forumThreadId="topicPageData._id"
          :rootEntityType="'topic'"
          :socialShareUsers="[topicData.maintainer]"
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
        :showCount="false"
        :comments="comments" />
    </template>

    <template v-if="topicPageData._id" v-slot:side>
      <div class="related-container">
        <h6>related episodes</h6>
        <spinner :show="loadingEpisodes"/>
        <router-link 
          class="episode-link"
          v-for="episode in relatedEpisodes" 
          :key="episode._id" 
          :to="{ name: 'Post', params: { id: episode._id, postTitle: episode.slug} }" >
          {{episode.title.rendered}}
        </router-link>
        <div v-if="relatedEpisodes.length < relatedEpisodesTotal" class="total">
          <router-link 
          class="episode-see-all-link"
          :to="`/posts/${$route.params.slug}`">
            See all {{relatedEpisodesTotal}}
          </router-link>
        </div>
        <div v-if="!relatedEpisodesTotal && !loadingEpisodes" class="no-episodes">
          0 Episodes
        </div>
      </div>

      <comments-list
        :filter="'highlight'"
        :initialComment="''"
        :post="{}"
        :forumThreadId="topicPageData._id"
        :rootEntityType="'topic'"
        :commentCount="highlightCount"
        :comments="comments" />

      <post-highlights
        :highlight="highlight"
        :comments="comments"
        :commentCount="highlightCount"
        :rootEntityType="'topic'"
        :post="{}" />
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
import Highlightable from '@/components/Highlightable'
import { PostHighlights } from '@/components/post'

export default {
  name: 'topicpage-content',
  components: {
    Spinner,
    TopicPageMaintainer,
    TopicPageTemplate,
    Avatar,
    CommentsList,
    Highlightable,
    PostHighlights
  },
  beforeMount () {
     marked.setOptions({
      breaks: true
    })
    this.loadTopic()
  },
  data () {
    return {
      loading: false,
      loadingEpisodes: false,
      topicData: {},
      topicPageData: {},
      highlight: '',
      relatedEpisodes: [],
      relatedEpisodesTotal: 0
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'metaTag']),
    ...mapState({    
      me (state) {
        return state.me
      },

      commentsMap (state) {
        return state.comments
      },

      entityComments (state) {
        return state.entityComments
      }
    }),
    
    contentUrl () {
      return window.location.href
    },

    isMaintainer () {
      return (
        this.topicData && 
        this.me &&
        this.topicData.maintainer &&
        this.topicData.maintainer._id === this.me._id
      )
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
    ...mapActions(['getTopicPage', 'commentsFetch', 'getTopicEpisodes']),

    loadTopic () {
      this.loading = true
      this.getTopicPage(this.$route.params.slug).then((data) => {
        if (
          data && data.topic && 
          (!data.topicPage.published) || (!data.topic.maintainer)
        ) {
          return this.redirectToPosts()
        }
        this.topicData = data.topic
        this.topicPageData = this.convertMarkdown(data.topicPage)
        this.loadComments()
        this.loadEpisodes()
      }).catch((e) => {
        if (e.response && e.response.status === 404) {
          return this.redirectToPosts()
        }
        this.$toasted.error((e.response) ? e.response.data : e, { duration : 0 })
      }).finally(() => {
        this.loading = false
      })
    },

    redirectToPosts () {
      this.$router.replace(`/posts/${this.$route.params.slug}`)
    },

    loadComments () {
      this.commentsFetch({ entityId: this.topicPageData._id }).then((data) => {
        
      }).catch((e) => {
        this.$toasted.error((e.response) ? e.response.data : e, { duration : 0 })
      })
    },

    loadEpisodes () {
      this.loadingEpisodes = true
      this.getTopicEpisodes(this.$route.params.slug).then((data) => {
        if (data && data.episodes) {
          this.relatedEpisodes = data.episodes
          this.relatedEpisodesTotal = data.total
        }
      }).catch((e) => {
        if (e.response && e.response.status === 404) {
          this.relatedEpisodes = 0
          this.relatedEpisodesTotal = 0
          return
        }
        this.$toasted.error((e.response) ? e.response.data : e, { duration : 0 })
      }).finally(() => {
        this.loadingEpisodes = false
      })
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
      margin 0 auto
      display block

    .edit-link
      border 1px solid #222
      padding 7px 10px
      font-size 12px
      font-weight normal
      color #222
      border-radius 30px
      margin-left 10px

      &:hover
        text-decoration none

    .related-container
      margin 0 0 20px
      padding 1.5rem
      background #e9ecef

      h6
        margin-top 0 0 10px
        text-transform uppercase
        font-size 0.8rem
        font-weight 800
      
      .episode-link
        display block
        margin 10px 0
        font-size 14px
        font-weight normal
        color #1a0dab
      
      .total
        text-align center

        .episode-see-all-link
          color #9b9b9b
      
      .no-episodes
        color #9b9b9b
        text-align center
        margin-top 20px
   
  >>> mark
    cursor pointer
    font-weight 700
    color #fff
    background-color #a591ff
    opacity 0.7
    &::selection
      background-color #a591ff
    &:hover
      opacity 1.0
    
</style>
