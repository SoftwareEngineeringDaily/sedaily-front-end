<template>
  <div class="activity-header">
    <slot />
  </div>
</template>

<style lang="stylus" scoped>
.activity-header
  position relative
  font-size 20px
  padding 2rem 0 0.8rem
  margin-bottom 1.2rem
  font-weight 600

  &:before
    content ''
    position absolute
    left 0
    bottom 0
    height 4px
    width 36px
    background-color #222
</style>
