<template>
<div class='voting'>
  <div class="score">
    <div
      v-if="upvoteHandler"
      :class="{ active: upvoted }"
      class='arrow'
      @click='upvoteHandler'>
      <img v-if="upvoted" src="@/assets/icons/upvote.svg" />
      <img v-else src="@/assets/icons/upvote-thin.svg" />
    </div>
    <div class='score-text'>{{ score || 0}}</div>
    <div
      v-if="downvoteHandler"
      :class="{ active: downvoted }"
      class="arrow"
      @click='downvoteHandler'>
      <img v-if="downvoted" src="@/assets/icons/downvote.svg" />
      <img v-else src="@/assets/icons/downvote-thin.svg" />
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'voting-arrows',
  props: {
    score: {
      type: Number,
      required: false,
      default: 0
    },
    upvoteHandler: {
      type: Function,
      required: false
    },
    downvoteHandler: {
      type: Function,
      required: false
    },
    upvoted: {
      type: Boolean,
      required: false
    },
    downvoted: {
      type: Boolean,
      required: false
    }
  }
}
</script>

<style scoped lang="stylus">
@import './../css/variables'

.score-text
  font-weight bold

.score
    text-align center
    color #999
    font-size 1.1em
    font-weight 700
    width 1.5em

.active
    color #999 !important

.arrow
  color very-light-grey
  &:hover
    cursor pointer
    color #999

  &.active
    color #999 !important
    &:hover
      cursor pointer
      color #888

</style>

<style lang="stylus">
// The default is global for weak css priority, override with scoped on parent.
.voting
  display inline-block
  height 100%
  margin 0 1rem
</style>
