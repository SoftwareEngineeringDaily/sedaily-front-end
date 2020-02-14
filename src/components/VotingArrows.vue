<template>
<div class='voting'>
  <div class="score" :class="[inverse ? 'inverse' : '']">
    <div
      v-if="upvoteHandler"
      :class="{ active: upvoted }"
      class='arrow upvote'
      @click='upvoteHandler'>
      <svg viewBox="0 0 448 512"><path fill="currentColor" d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"/></svg>         
    </div>
    <div class='score-text'>{{ score || 0}}</div>
    <div
      v-if="downvoteHandler"
      :class="{ active: downvoted }"
      class="arrow downvote"
      @click='downvoteHandler'>
      <!-- <img v-if="downvoted" src="@/assets/icons/downvote.svg" />
      <img v-else src="@/assets/icons/downvote-thin.svg" /> -->
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
    },
    inverse: {
      type: Boolean
    },
  }
}
</script>

<style scoped lang="stylus">
@import './../css/variables'

@keyframes bounce {
  0%,
  50%,
  75%,
  to {
       transform: translateY(-20%)
  }
  40% {
      transform: translateY(-10%)
  }
  60% {
      transform: translateY(-30%)
  }
}

.score
  margin-top: 10px
  display flex
  align-items center
  width 1.5em
  &:hover
    cursor pointer
    color #888
    svg
      animation: bounce 1.2s ease infinite
  .active
    color #856aff !important
    font-weight 700
  .arrow
    &.active
      color #856aff !important
    svg 
      width: 1rem
      color #222
  .score-text
    color #222
    padding-left 10px
  &.inverse
    svg
      color #fff
    .score-text
      color #fff
</style>

<style lang="stylus">
// The default is global for weak css priority, override with scoped on parent.
.voting
  display inline-block
</style>
