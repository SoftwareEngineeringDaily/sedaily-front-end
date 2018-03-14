<template>
  <div>
    <div
      v-for="comment in comments"
      :key="comment._id">
      <comment-view
        :comment="comment"
        @commentDeleted="$emit('commentDeleted')" />
      <!-- Replies -->
      <comment-reply
        v-if="isLoggedIn"
        :post-id="postId"
        :is-reply="true"
        :parent-comment="comment"
        @commentCreated="$emit('commentCreated')" />
      <div class="replies">
        <div
          v-for="replyComment in comment.replies"
          :key="replyComment._id">
          <comment-view
            :comment="replyComment"
            @commentDeleted="$emit('commentDeleted')" />
          <br>
        </div>
      </div>
      <br>
    </div>
  </div>
</template>

<script>
import CommentView from '~/components/CommentView.vue'
import CommentReply from '~/components/CommentReply.vue'
import { mapGetters} from 'vuex'

export default {
  components: {
    CommentView,
    CommentReply
  },
  props: {
    postId: {
      type: String,
      required: true
    },
    comments: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters([ 'isLoggedIn' ])
  }
}
</script>

<style scoped lang="stylus">
.replies
  margin-top 20px
  margin-left 50px
  border-left 1px solid #ccc
</style>
