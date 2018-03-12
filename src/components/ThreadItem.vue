<template>
  <div class="forum-thread">
    <voting-arrows
      :score="thread.score">
    </voting-arrows>
    <div class="thread-summary">
      <div class="thread-title">
        <router-link :to="'/forum/' + thread._id + '/' + threadUrlTitle ">
          <h3>{{ thread.title.rendered | decodeString }}</h3>
        </router-link>
      </div>
      <div class="thread-meta">
        <div class="author meta-item">
          <span>by </span><router-link :to="'/users/' + thread.author._id + '/' + thread.author.username">{{ thread.author.name }}</router-link>
        </div>
        <div class="comment-count meta-item">
          {{ thread.comments.length }} comments
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VotingArrows from '@/components/VotingArrows.vue'

export default {
  name: 'thread-view',
  components: { VotingArrows },
  props: {
    thread: {
      type: Object,
      required: true
    }
  },
  computed: {
    threadUrlTitle () {
      try {
        const originalTitle = this.thread.title.rendered
        if (originalTitle) {
          let title = originalTitle.replace(/[^\w\s]/gi, '')
          // Ghetto way to replace strings, should use regex:
          title = title.split(' ').join('-')
          return title
        } else {
          return ''
        }
      } catch (e) {
        console.log('e', e)
        return ''
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.forum-thread
  margin 30px 0
  &:after
    clear both
    content ''
    display table

.voting
  float left

.thread-summary
  float left
  .thread-title
    color #706f6f
    a
      color #706f6f
      &:hover
        text-decoration none
        color #856aff
    h3
      font-size 1.1em
      font-weight normal
  .thread-meta
    font-size .85em
    color #999999
    a
      color  #999999
    .meta-item
      float left
      display block
      margin-right 10px
</style>