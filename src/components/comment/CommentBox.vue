<template>
  <div class="comment-box">
    <div class="title">{{post.thread.commentsCount}} {{post.thread.commentsCount >1 ?'comments':'comment'}}</div>
    <div
      v-if="isLoggedIn">
      <hr>
      <div class="col-md-12">
        <comment-compose
          v-if="forumThreadId"
          :entityId="forumThreadId"
          :rootEntityType='"forumthread"' />
      </div>
    </div>
    <div class="row comments">
      <div class="col-md-12">
        <comments-list :comments="comments" />
      </div>
    </div>
  </div>
</template>

<script>
import CommentsList from '@/components/comment/CommentsList'
import CommentCompose from '@/components/comment/CommentCompose'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  props: {
    post: {
      type: Object
    },
    forumThreadId: {
      type: String
    },
    comments: {
      type: Array
    }
  },
  components: { CommentCompose, CommentsList },
  computed: {
     ...mapGetters(['isLoggedIn'])
  }
}
</script>

<style lang="stylus" scoped>
.comment-box
  background-color #f8f9fa
  padding 10px 20px
  margin-top 100px
  @media (max-width 800px)
    margin-top 300px
  .title
    text-align center
    padding 10px 0
    border-bottom 1px solid #dee2e6
  
</style>








