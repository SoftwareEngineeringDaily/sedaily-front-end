<template>
  <div>
    <div v-for="comment in comments">
      <comment-view :comment='comment'></comment-view>
      <!-- Replies -->
      <div class='replies'>

        <compose-comment v-if="isLoggedIn" :isReply='true' :comment='comment'></compose-comment>
        <div v-for="reply in comment.replies">
          <comment-view :comment='reply'></comment-view>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
/* @flow */
import CommentView from './CommentView.vue'
import ComposeComment from './ComposeComment.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'comments-list',
  props: ['comments'],
  components: {CommentView, ComposeComment},
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
