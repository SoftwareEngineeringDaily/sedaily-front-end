<template>
  <div class="comment-box">
    <svg class="comment-chevron" viewBox="0 0 320 512" data-ember-extension="1">
      <path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
    </svg>
    <div class="title">
      {{commentCount}} {{commentCount == 1 ? 'comment' : 'comments'}}
    </div>
    <div class="title" v-if="!post.thread">
      0 comments
    </div>
    <div v-if="isLoggedIn && !filter">
      <comment-compose
        :initialComment="initialComment"
        :entityId="forumThreadId"
        :rootEntityType='"forumthread"' />
    </div>
    <div v-else-if="!isLoggedIn" class="guest-message">
      <p>Please <router-link to="/login">log in</router-link> to leave a comment</p>
    </div>
    <div class="row comments">
      <div class="col-md-12">
        <comments-list
          :comments="comments"
          :filter="filter" />
      </div>
    </div>
  </div>
</template>

<script>
import isArray from 'lodash/isArray'
import CommentsList from '@/components/comment/CommentsList'
import CommentCompose from '@/components/comment/CommentCompose'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  props: {
    post: {
      type: Object
    },
    forumThreadId: {
      type: String
    },
    filter: {
      type: String
    },
    initialComment: {
      type: String
    },
    comments: {
      type: Array
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },

  components: {
    CommentCompose,
    CommentsList,
  },

  computed: {
    ...mapGetters([ 'isLoggedIn' ]),
  },
}
</script>

<style lang="stylus" scoped>
.comment-box
  background-color #f8f9fa
  padding 10px 20px
  margin-top 40px
  position relative
  @media (max-width 1000px)
    margin-bottom 100px
  .comment-chevron
    position absolute
    top 23px
    left 20px
    height 15px
    color #a591ff
  .title
    text-align center
    padding 10px 0
    border-bottom 1px solid #dee2e6
  .comments
    margin-top 1rem
    min-height 20px
  .guest-message
    height 100%
    text-align center
    padding 25px 0 5px 0
    a
      color #222
      text-decoration underline

</style>
