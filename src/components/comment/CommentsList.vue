<template>
  <div class="comments-list" :class="{ 'is-preview': preview }" @click="openHighlights">
    <div v-if="!filter" class="comment-item text-center">
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

    <div
      v-else
      :id="comment._id"
      :key="comment._id"
      :data-selector="`c${comment._id}`"
      class="comment comment-item"
      v-for="comment in filteredComments">

      <comment-view
        :rootEntityType="rootEntityType"
        :comment="comment"
        :onChange="onChange"
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
    preview: {
      type: Boolean,
      default: false,
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
    onChange: {
      type: Function,
      default: () => {},
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
      return this.comments.filter(c => !(c && c.highlight))
    },
  },

  methods: {
    openHighlights (evt) {
      if (!this.preview) {
        return
      }

      const query = {
        thread_id: this.forumThreadId,
        comment_id: evt.target.getAttribute('id'),
      }

      this.$router.push({ query })
    }
  }
}
</script>

<style lang="stylus">
.comments-list.is-preview
  cursor pointer

  .replies,
  .content-area,
  .misc-detail
    display none

</style>

<style scoped lang="stylus">
.comments-list
  position relative
  margin-top 1rem
  min-height 20px

  &.is-preview
    cursor pointer

    .replies,
    .content-area,
    .misc-detail
      display none

    .comment *
      pointer-events none

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
