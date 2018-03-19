<template>
  <div class='forum-summary-container'>
    <div class='forum-summary-title'>
      <router-link :to="'/forum/' + forumThread._id"> {{forumThread.title}} </router-link>
    </div>
    <div class='forum-summary-misc'>
      by <span>{{forumThread.author.name}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForumThreadSummary',
  props: {
    forumThread: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  }
}
</script>

<style scoped lang="stylus">
.forum-summary-container
  padding 1rem
  .forum-summary-title a
    font-weight 300
    font-size 1.5rem
    color #591f94
.forum-summary-misc
  font-size 1em
  color darkgrey
</style>
