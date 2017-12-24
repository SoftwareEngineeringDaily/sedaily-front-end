<template>
<v-layout row justify-space-between>
  <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
    <div class="post-view" v-if="post">
      <post-header :post="post" />

      <div class="post-view-comments">
        <button @click.prevent="toggleShowContent">{{contentButtonText}}</button>
        <div v-if="showContent"  v-html='post.content.rendered' />            
      </div>
          
      <comment-compose v-if="isLoggedIn"></comment-compose>
      <p class="ml-3" v-else>
        <router-link to="/login">Login</router-link> to comment
      </p>
      <comments-list :comments='comments'></comments-list>
    </div>
  </v-flex>
  <v-flex xs1 sm1 md2 lg3>
    <div class="ml-2">
      <related-link-list :relatedLinks='relatedLinks'></related-link-list>
      <related-link-compose v-if="isLoggedIn"></related-link-compose>
    </div>
  </v-flex>
</v-layout>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import CommentsList from '@/components/CommentsList.vue'
import PostHeader from '@/components/PostHeader.vue'
import CommentCompose from '@/components/CommentCompose.vue'
import RelatedLinkList from '@/components/RelatedLinkList.vue'
import RelatedLinkCompose from '@/components/RelatedLinkCompose.vue'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'post-view',
  components: {
    Spinner,
    CommentsList,
    CommentCompose,
    RelatedLinkList,
    RelatedLinkCompose,
    PostHeader
  },
  data () {
    return {
      showContent: true,
      loading: true
    }
  },
  computed: {
    layout () {
      const binding = {}

      if (this.$vuetify.breakpoint.mdAndUp) binding.column = true

      return binding
    },
    contentButtonText () {
      return this.showContent ? '-' : '+'
    },
    post () {
      return this.posts[this.$route.params.id]
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
    ...mapActions([
      'commentsCreate',
      'relatedLinksFetch',
      'fetchArticle',
      'commentsFetch'
    ]),
    toggleShowContent () {
      this.showContent = !this.showContent
    }
  }
}
</script>

<style lang="stylus" scoped>
.post-view-comments
  background-color #fff
  margin-top 10px
  padding 1em 2em .5em

  .row, h2
    display: none

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

.related-links-container
  padding-top 30px

.comment-children
  list-style-type none
  padding 0
  margin 0

@media (max-width 600px)
  .post-view-header
    h1
      font-size 1.25em
</style>
