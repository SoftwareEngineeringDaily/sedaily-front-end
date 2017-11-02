<template>
  <div>
    <div v-for="comment in comments">
      <comment-view :comment='comment'></comment-view>
      <!-- Replies -->
      <div class='replies'>
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
export default {
  name: 'comments-list',
  props: ['comments'],
  components: {CommentView}
}
</script>

<style scoped>
.replies {
  margin-top: 20px;
  margin-left: 50px;
  border-left: 1px solid black;
}
</style>
