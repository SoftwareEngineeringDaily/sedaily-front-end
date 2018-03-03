<template>
  <div>
    <div
      v-for="comment in comments"
      :key="comment._id">
      <comment-view :comment="comment" />
      <!-- Replies -->
      <comment-reply
        v-if="isLoggedIn"
        :is-reply="true"
        :parent-comment="comment" />
      <div class="replies">
        <div
          v-for="replyComment in comment.replies"
          :key="replyComment._id">
          <comment-view :comment="replyComment" />
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
