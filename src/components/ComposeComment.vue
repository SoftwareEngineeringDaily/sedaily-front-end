
<template>
  <div>
    <input type='text' v-model='commentContent' />
    <button @click='submitComment'> Comment </button>
  </div>
</template>

<script>
export default {
  name: 'compose-comment',
  data () {
    return {
      commentContent: 'Your comment here'
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

<style>
</style>
