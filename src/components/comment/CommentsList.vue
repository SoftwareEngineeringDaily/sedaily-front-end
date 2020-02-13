<template>
  <div>
    <div v-if="loading" class="spinner-holder">
      <spinner :show="loading" />
    </div>
    <div class="comment" v-else v-for="comment in filteredComments" :key="comment._id">
      <div class="row" :id="comment._id">
        <div class="col-md-12" >
          <comment-view
            :rootEntityType="rootEntityType"
            :comment="comment"
            :isParentComment="true" />
        </div>
      </div>
      <div class="replies" v-if="comment.replies.length">
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
import CommentView from '@/components/comment/CommentView'
import Spinner from '@/components/Spinner'

export default {
  name: 'comments-list',
  props: {
    comments: {
      type: Array,
      required: true
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
    Spinner,
  },
  computed: {
    emptyComments () {
      if (!this.comments || this.comments.length === 0) {
        return true
      }
      return false
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
.comment
  margin-bottom 18px
  padding-bottom 18px
  border-bottom 1px solid #ddd
  &:last-child
    margin-bottom 0
    padding-bottom 0
    border-bottom none
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
