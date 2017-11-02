<template>
  <div>
    <div v-for="comment in comments">
      <comment-view :comment='comment'></comment-view>
      <!-- Replies -->
      <span class='replies'>
        <div v-for="reply in comment.replies">
          <comment-view :comment='reply'></comment-view>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
/* @flow */
import CommentView from './CommentView.vue'
export default {
  name: 'comments-list',
  props: ['comments'],
  components: [CommentView]
}
</script>

<style scoped>
.replies {
  padding-left: 50px;
}
</style>
