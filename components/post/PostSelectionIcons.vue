<template>
  <div class="post-view-comments">
    <div class="selection-icons">
      <span @click="$emit('selectPostContent')">
        <img
          :class="{ active: showPostContent }"
          class="icon"
          src="~assets/icons/post.png"
          alt="Post Content">
      </span>

      <span @click="$emit('selectRelatedLinks')">
        <img
          :class="{ active: showRelatedLinks }"
          class="icon"
          src="~assets/icons/relatedlinks.png"
          alt="Related Links">
      </span>

      <span @click="$emit('selectComments')">
        <img
          :class="{ active: showComments }"
          class="icon"
          src="~assets/icons/comments.png"
          alt="Comments">
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showComments: {
      type: Boolean,
      required: true
    },
    showRelatedLinks: {
      type: Boolean,
      required: true
    },
    showPostContent: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/stylus/variables'

.selection-icons
  margin-bottom 30px
  .icon
    padding-right 20px
    cursor pointer
    max-width 55px
    opacity 0.4
    &.active
      opacity 1

.post-view-comments
  background-color #fff
  margin-top 10px
  padding 1em 2em .5em

.post-view-comments-header
  margin 0
  font-size 1.1em
  padding 1em 0
  position relative
  .spinner
    position absolute
    top 0
    right 0
    bottom auto
</style>
