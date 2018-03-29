<template>
  <div>
    <div v-if="emptyComments" class='no-comments'>
      There are no comments.
    </div>
    <div v-for="comment in comments" :key="comment._id">
      <div class='row'>
        <div class='col-md-12'>
          <comment-view
          :rootEntityType='rootEntityType'
          :comment='comment'
          :allowsReplies="true" ></comment-view>
        </div>
      </div>
      <div class='row'>
        <div class='replies offset-md-1'>
          <div v-for="replyComment in comment.replies" :key="replyComment._id">
            <comment-view :comment='replyComment'></comment-view>
            <br />
          </div>
        </div>
      </div>
      <br />
    </div>
  </div>
</template>

<script>
import CommentView from 'components/CommentView.vue'

export default {
  name: 'comments-list',
  props: {
    comments: {
      type: Array,
      required: true
    },
    rootEntityType: {
      type: String,
      required: false
    }
  },
  beforeMount () {
    console.log('rootEntityType--list', this.rootEntityType)
  },

  components: { CommentView },
  computed: {
    emptyComments () {
      if (!this.comments || this.comments.length === 0) {
        return true
      }
      return false
    }
  }
}
</script>

<style scoped lang="stylus">
.replies
  margin-top 35px
.no-comments
  padding-top 20px
  color #ccc

</style>
