<template>
  <div>
    <router-link :to="'/forum/' + forumThread._id"> {{forumThread.title}} </router-link>
    <div>
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

</style>
