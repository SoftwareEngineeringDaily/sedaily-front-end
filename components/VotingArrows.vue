<template>
  <div class="voting">
    <div class="score">
      <div
        v-if="upvoteHandler"
        :class="{ active: upvoted }"
        class="arrow"
        @click="upvoteHandler">▲</div>
      <div
        v-if="downvoteHandler"
        :class="{ active: downvoted }"
        class="arrow"
        @click="downvoteHandler">▼</div>

      <div class="score-text">{{ score || 0 }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    score: {
      type: Number,
      required: false,
      default: 0
    },
    upvoteHandler: {
      type: Function,
      required: false,
      default: null
    },
    downvoteHandler: {
      type: Function,
      required: false,
      default: null
    },
    upvoted: {
      type: Boolean,
      required: false,
      default: false
    },
    downvoted: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style scoped lang="stylus">
@import '../assets/stylus/variables'

.score-text
  font-weight 400

.score
    text-align center
    color #3F58AF
    font-size 1.1em
    font-weight 700
    width 1.1em

.arrow
  color very-light-grey
  font-fize 30px
  &:hover
    cursor pointer
    color #3F58AF

  &.active
    color #3F58AF !important
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
