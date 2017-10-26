<template>
  <div>
    <update-profile> </update-profile>
    <textarea placeholder='Your comment here...'
    class='comment-box'
    type='text'
    v-model='commentContent' />
    <button class='btn-success' @click='submitComment'>
      Comment
    </button>
  </div>
</template>

<script>
/* @flow */
import UpdateProfile from './UpdateProfile.vue'
export default {
  name: 'compose-comment',
  components: {
    UpdateProfile
  },
  data () {
    return {
      commentContent: ''
    }
  },
  computed: {
    postId () {
      return this.$store.state.route.params.id
    }
  },
  methods: {
    submitComment () {
      this.$store.dispatch('commentsCreate', {
        postId: this.postId,
        content: this.commentContent
      })
    }
  }
}
</script>

<style scoped>
  .comment-box {
    width: 100%;
    padding: 20px 10px;
    margin-bottom: 12px;
    border-radius: 7px;
    border-color: #c5c5c5;
  }
</style>
