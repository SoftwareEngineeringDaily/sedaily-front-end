<template>
  <div class="transcript-section" v-if="transcript" :class="[ isCollapsed ? 'collapsed' : '' ]" v-on:click="openTranscript">
    <h6 class="section-title">Transcript</h6>
    <div class="transcript-embed" v-html="transcript" />
  </div>
</template>

<script>
export default {
  name: "post-transcript",
  props: {
    transcript: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isCollapsed: true
    }
  },
  methods: {
    openTranscript() {
      this.isCollapsed = false
    }
  },
  watch: {
    $route(to, from) {
      this.isCollapsed = true
    },
  }
}
</script>

<style lang="stylus" scoped>
.transcript-section
  font-size 1rem
  color #222
  position relative
  margin-bottom 55px
  display flex
  flex-direction column

  p
    margin-bottom 25px
    .transcript-header
      font-size 15px
      display block
      margin-bottom 10px
      font-weight bold

      .transcript-time
        font-weight 400
        font-size .9rem
        background-color #dee2e6
        border-radius 2px
        margin-right 10px
        color #222
        cursor pointer
        padding 3px 6px

  &.collapsed
    cursor pointer
    height 400px
    overflow hidden

    &:after
      background-image linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0) 0%,
          rgb(255, 255, 255) 100%
      )
      bottom -20px
      content ""
      height 400px
      left -20px
      position absolute
      width calc(100% + 40px)
      cursor pointer

    &:hover
      &:before
        background-color #a591ff
        transform scale(1.02)

    &:before
      content "View Transcript"
      align-self center
      position absolute
      z-index 1
      bottom 24px
      padding 10px 20px
      font-size 15px
      font-weight 500
      text-align center
      text-transform uppercase
      color #fff
      background-color #222
      border-radius 3px
      transition all .2s

</style>
