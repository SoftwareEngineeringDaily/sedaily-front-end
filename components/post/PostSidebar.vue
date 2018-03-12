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
@import '../../assets/stylus/variables'

.sidenav
  background-color primary-color
  color white
  height 100%
  width 75px
  display flex
  flex-direction column
  top 100px
  overflow-x hidden
  overflow-y hidden
  .related-links
    flex-basis 300px
    background-color rgb(102, 102, 115)
    p
      margin-top 200px
      text-align center
      font-size 2em
      font-weight 200
    .rotated
      width 200px
      transform translateX(-30%) translateY(250%) rotate(90deg)
  .comments
    flex-basis auto
    background primary-color
    p
      margin-bottom 50px
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
