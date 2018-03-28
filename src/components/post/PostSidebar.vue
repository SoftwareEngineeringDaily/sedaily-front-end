<template>
  <div class="sidenav">
    <div class="related-links">
      <p class="rotated">Related Links</p>
      <p>{{ relatedLinks }}</p>
    </div>
    <div class="comments">
      <p>{{ comments }}</p>
      <p class="rotated">Comments</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    relatedLinks: {
      type: Number,
      required: false,
      default: 0
    },
    comments: {
      type: Number,
      required: false,
      default: 0
    }
  }
}
</script>


<style lang="stylus" scoped>
@import '../../css/variables'

.sidenav
  background-color primary-color
  color white
  height 100%
  min-height 680px
  width 75px
  display flex
  flex-direction column
  overflow-x hidden
  overflow-y hidden
  .related-links
    flex-basis 250px
    background-color rgb(102, 102, 115)
    p
      margin-top 150px
      text-align center
      font-size 2em
      font-weight 200
    .rotated
      width 200px
      transform translateX(-30%) translateY(150%) rotate(90deg)
  .comments
    flex-basis auto
    background primary-color
    p
      margin-top 20px
      margin-bottom 10px
      text-align center
      font-size 2em
      font-weight 200
    .rotated
      width 200px
      transform translateX(-30%) translateY(75%) rotate(90deg)

@media (max-width 600px)
  .sidenav
    width 50px
    .related-links
      flex-basis 50px
      p
        font-size 1.5em
      .rotated
        width 150px
        transform translateX(-32%) translateY(250%) rotate(90deg)
    .comments
      p
        font-size 1.5em
      .rotated
        width 150px
        transform translateX(-32%) translateY(250%) rotate(90deg)
</style>
