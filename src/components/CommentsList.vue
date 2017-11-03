<template>
  <div>
    <div v-for="comment in comments">
      <comment-view :comment='comment'></comment-view>
      <!-- Replies -->
      <comment-reply v-if="isLoggedIn" :isReply='true' :comment='comment'></comment-reply>
      <div class='replies'>
        <div v-for="reply in comment.replies">
          <comment-view :comment='reply'></comment-view>
        </div>
      </div>
      <hr />
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
  border-left: 1px solid black;
}
</style>
