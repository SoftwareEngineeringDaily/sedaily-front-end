<template>
  <div class='forum-summary-container'>
    <div class='forum-summary-title'>
      <router-link :to="'/forum/' + forumThread._id"> {{forumThread.title}} </router-link>
    </div>
    <div class='forum-summary-misc'>
      by <span>{{forumThread.author.name}}</span>
      <span class='misc-detail' >{{creationDate}} </span>
      <span class='comments-count misc-detail'> {{forumThread.commentCount}} comments</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
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
  },
  computed: {
    creationDate () {
      if (this.forumThread) {
        return moment(this.forumThread.dateCreated)
          .startOf('hour').fromNow()
      }
    }
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
.misc-detail
  padding-left 1rem
</style>
