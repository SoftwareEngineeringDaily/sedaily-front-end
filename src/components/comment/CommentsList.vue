<template>
  <div class="comments-list">
    <div v-if="!filter" class="comment-item text-center">
      <!-- <svg class="comment-chevron" viewBox="0 0 320 512" data-ember-extension="1">
        <path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
      </svg> -->
      <div class="title">
        {{commentCount}} {{commentCount == 1 ? 'comment' : 'comments'}}
      </div>
      <div class="title" v-if="!post.thread">
        0 comments
      </div>
    </div>

    <div v-if="isLoggedIn && !filter" class="comment-item">
      <comment-compose
        :initialComment="initialComment"
        :entityId="forumThreadId"
        :rootEntityType='"forumthread"' />
    </div>
    <div v-else-if="!isLoggedIn" class="comment-item guest-message">
      <p>Please <router-link to="/login">log in</router-link> to leave a comment</p>
    </div>

    <div v-if="loading" class="spinner-holder">
      <spinner :show="loading" />
    </div>

    <div :id="comment._id" class="comment comment-item" v-else v-for="comment in filteredComments" :key="comment._id">
      <comment-view
        :rootEntityType="rootEntityType"
        :comment="comment"
        :isParentComment="true" />
      <div class="replies" v-if="comment.replies.filter(r => !r.deleted).length">
        <div v-for="replyComment in comment.replies" :key="replyComment._id">
          <comment-view
            :rootEntityType="rootEntityType"
            :comment="replyComment" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CommentView from '@/components/comment/CommentView'
import CommentCompose from '@/components/comment/CommentCompose'
import Spinner from '@/components/Spinner'

export default {
  name: 'comments-list',
  props: {
    post: {
      type: Object
    },
    forumThreadId: {
      type: String
    },
    initialComment: {
      type: String
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Array,
      default: () => [],
      required: true,
    },
    filter: {
      type: String,
    },
    rootEntityType: {
      type: String,
      required: false
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    },
  },

  beforeMount () {},

  components: {
    CommentView,
    CommentCompose,
    Spinner,
  },

  computed: {
    ...mapGetters([ 'isLoggedIn' ]),

    emptyComments () {
      return (!this.comments || !this.comments.length)
    },

    filteredComments () {
      if (this.filter) {
        return this.comments.filter(c => !!(c[this.filter]))
      }

      // Default is general discussion without highlights
      return this.comments.filter(c => !(c.highlight))
    },
  },
}
</script>

<style scoped lang="stylus">
.comments-list
  position relative
  margin-top 1rem
  min-height 20px

.comment
  margin-bottom 18px
  padding-bottom 8px

.comment-item
  position relative
  margin-bottom 20px
  padding 10px 15px
  background-color #f8f9fa
  &.text-center
    text-align center

.comment-chevron
  position absolute
  top 50%
  left 20px
  height 15px
  color #a591ff
  transform translateY(-50%)
  & + .title
    text-align center
.guest-message
  height 100%
  text-align center
  padding 25px 0 5px 0
  a
    color #222
    text-decoration underline

.replies
  position relative
  margin-top 10px
  margin-left 5px
  padding-left 20px
  border-left 1px solid #000
  &:before
    content ''
    position absolute
    top 14px
    left 0
    width 10px
    border-top 1px solid #000

.no-comments
  padding-top 20px
  color #ccc

.spinner-holder
  width 100%

</style>
