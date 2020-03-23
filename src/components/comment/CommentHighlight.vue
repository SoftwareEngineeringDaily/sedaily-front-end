<template>
  <div class="comment-highlight">
    <div v-if="isLoggedIn">
      <comment-quote :highlight="highlight" />
      <div class="comment-compose">
        <comment-compose
          :highlight="highlight"
          :entityId="forumThreadId"
          :rootEntityType="rootEntityType"
          :onSubmit="onSubmit" />
      </div>
    </div>
    <div v-else class="guest-message">
      <p>Please <router-link to="/login">log in</router-link> to leave a comment</p>
    </div>
  </div>
</template>

<script>
import CommentQuote from '@/components/comment/CommentQuote'
import CommentCompose from '@/components/comment/CommentCompose'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  props: {
    post: {
      type: Object,
    },
    rootEntityType: {
      type: String,
      default: 'forumthread'
    },
    top: {
      type: Number,
    },
    left: {
      type: Number,
    },
    forumThreadId: {
      type: String,
    },
    highlight: {
      type: String,
    },
    onSubmit: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    CommentCompose,
    CommentQuote,
  },
  computed: {
    ...mapGetters([
      'isLoggedIn',
    ]),
  }
}
</script>

<style lang="stylus" scoped>
.quote-scroll
  overflow auto
  max-height 156px

.quote
  display: inline;
  font-size 1.2rem;
  color #fff;
  background-color: #a591ff;

.comment-compose
  margin-top 1rem
</style>
