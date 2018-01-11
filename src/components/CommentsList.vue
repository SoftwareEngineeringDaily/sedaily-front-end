<template>
  <div>
    <div v-for="comment in comments" :key="comment._id">
      <comment-view :comment='comment'></comment-view>
      <!-- Replies -->
      <comment-reply v-if="isLoggedIn"
      :isReply='true' :parentComment='comment'></comment-reply>
      <div class='replies'>
        <div v-for="replyComment in comment.replies" :key="replyComment._id">
          <comment-view :comment='replyComment'></comment-view>
          <br />
        </div>
      </div>
      <br />
    </div>
  </div>
</template>

<script>
/* @flow */
import CommentView from 'components/CommentView.vue'
import CommentReply from 'components/CommentReply.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'comments-list',
  props: {
    comments: {
      type: Array,
      required: true
    }
  },
  components: { CommentView, CommentReply },
  computed: {
    ...mapGetters(['isLoggedIn'])
  }
}
</script>

<style scoped lang="stylus">
.replies
  margin-top 20px
  margin-left 50px
  border-left 1px solid #ccc
</style>
