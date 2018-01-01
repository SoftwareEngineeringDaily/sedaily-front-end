<template>
<div class='voting'>
  <div class="score">
    <div v-if="upvoteHandler" class='arrow' :class="{ active: upvoted }"
         @click='upvoteHandler'>▲</div>
    <div>{{ score || 0}}</div>
    <div v-if="downvoteHandler" class="arrow" :class="{ active: downvoted }"
         @click='downvoteHandler'>▼</div>
  </div>
</div>
</template>

<script>
export default {
  name: 'voting-arrows',
  props: ['score', 'upvoteHandler', 'downvoteHandler', 'upvoted', 'downvoted']
}
</script>

<style scoped lang="stylus">
.score
    text-align center
    color #3F58AF
    font-size 1.1em
    font-weight 700
    width 1.1em

.arrow
  color #888
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
  margin: 0 1rem;
</style>
