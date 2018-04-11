<template>
  <div class="primary-post-header">
    <div class="header-title">
      <h1>{{ post.title.rendered }}</h1>
    </div>
    <div class="voting-arrows-container">
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
import VotingArrows from 'components/VotingArrows'

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
  width 10%
  align-self flex-end

.primary-post-header
  display flex
  padding-top 2rem

.header-title
  width 90%
  h1
    margin-top 15px
    font-weight 500
    font-size 4.5rem

@media (max-width 600px)
  .header-title
    h1
      font-size 2rem
</style>
