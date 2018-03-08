<template>
  <div class="primary-post-header row">
    <div class="col-md-11">
      <h1 class="header-title" >{{ post.title.rendered }}</h1>
    </div>
    <div class="col-md-1 voting-arrows-container">
      <voting-arrows
        :upvoted="post.upvoted"
        :downvoted="post.downvoted"
        :upvote-handler="upvoteHandler"
        :downvote-handler="downvoteHandler"
        :score="post.score" />
    </div>
  </div>
</template>

<script>
import VotingArrows from '~/components/VotingArrows'

export default {
  components: {
    VotingArrows
  },
  props: {
    post: {
      type: Object,
      required: true
    },
    downvoteHandler: {
      type: Function,
      required: true
    },
    upvoteHandler: {
      type: Function,
      required: true
    }
  }
}
</script>

<style lang="stylus" scoped>
.voting-arrows-container
  align-self flex-end

.primary-post-header
  padding-top 2rem

.header-title
  margin-top 15px
  font-weight 500
  font-size 4.5rem

.player-controls
  color white
  .player-control
    width 25px
    cursor pointer
    &.text-only
      cursor default
</style>
