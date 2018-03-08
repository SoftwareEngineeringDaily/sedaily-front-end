<template>
  <div class="sidenav">
    <div class="inset" />
    <div class="related-links">
      <p class="rotated">Related Links</p>
      <p>300</p>
    </div>
    <div class="comments">
      <p>30</p>
      <p class="rotated">Comments</p>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
@import '../../assets/stylus/variables'

.inset
  position fixed
  width 10px
  height 100%
  top 200px
  right 65px
  background-color #ccc

.sidenav
  background-color rgb(236, 236, 238)
  color white
  height 100%
  width 75px
  position fixed
  display flex
  flex-direction column
  z-index 1
  top 100px
  right 0
  overflow-x hidden
  overflow-y hidden
  .related-links
    flex-basis 300px
    background-color rgb(102, 102, 115)
    p
      margin-left 13px
      text-align center
      font-size 2em
      font-weight 200
    .rotated
      width 200px
      transform translateX(-33%) translateY(250%) rotate(90deg)
  .comments
    flex-basis auto
    background primary-color
    p
      margin-left 13px
      text-align center
      font-size 2em
      font-weight 200
    .rotated
      width 200px
      transform translateX(-33%) translateY(75%) rotate(90deg)
</style>
