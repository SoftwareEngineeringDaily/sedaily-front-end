<template>
  <div>
    <div v-for="comment in comments" :key="comment._id">
      <comment-view :comment='comment'></comment-view>
      
      <comment-reply v-if="isLoggedIn"
        :isReply='true'
        :parentComment='comment' />

      <div class='replies'>
        <div v-for="replyComment in comment.replies" :key="replyComment._id">
          <comment-view :comment='replyComment'></comment-view>          
        </div>
      </div>      
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
  props: {
    comments: {
      type: Array,
      required: true
    }
  },
  components: {
    CommentView,
    CommentReply
  },
  computed: {
    ...mapGetters(['isLoggedIn'])
  }
}
</script>

<style lang="stylus" scoped>
.replies
  margin-top 20px
  margin-left 50px
  border-left 1px solid #ccc
</style>
