<template>
  <div>
    <div v-for="comment in comments">
      <comment-view :comment='comment'></comment-view>
      <!-- Replies -->
      <comment-reply v-if="isLoggedIn"
      :isReply='true' :parentComment='comment'></comment-reply>
      <div class='replies'>
        <div v-for="replyComment in comment.replies">
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
import CommentView from './CommentView.vue'
import CommentReply from './CommentReply.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'comments-list',
  props: ['comments'],
  components: {CommentView, CommentReply},
  computed: {
    ...mapGetters(['isLoggedIn'])
  }
}
</script>

<style scoped>
.replies {
  margin-top: 20px;
  margin-left: 50px;
  border-left: 1px solid #ccc;
}
</style>
