<template>
<div class='voting'>
  <div class="score">
    <div
      v-if="upvoteHandler"
      :class="{ active: upvoted }"
      class='arrow'
      @click='upvoteHandler'>
      <!-- <img v-if="upvoted" src="@/assets/icons/upvote.svg" />
      <img v-else src="@/assets/icons/upvote-thin.svg" /> -->
      <p>Upvote</p>
    </div>
    <div class='score-text'>{{ score + 1 || 0}}</div>
    <!-- <div
      v-if="downvoteHandler"
      :class="{ active: downvoted }"
      class="arrow"
      @click='downvoteHandler'>
      <img v-if="downvoted" src="@/assets/icons/downvote.svg" />
      <img v-else src="@/assets/icons/downvote-thin.svg" />
    </div> -->
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
  padding-left 10px

.score
    margin-top: 10px
    display flex
    align-items center
    color #856aff
    width 1.5em

.active
    color #856aff !important
    font-weight 700

.arrow
  color: #9B9B9B;
  img
    margin-left 5px
  p
    margin 0
  &:hover
    cursor pointer
    color #856aff

  &.active
    color #856aff !important
    &:hover
      cursor pointer
      color #888

</style>

<style lang="stylus">
// The default is global for weak css priority, override with scoped on parent.
.voting
  display inline-block
</style>
