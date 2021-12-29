<template>
  <div :class="`layout-${layout}`">
    <answer-preview
       v-if="post.type && post.type === 'answer'"
      :answer="post" />

    <div
      v-if="post && post.type !== 'answer'"
      class="news-post"
      :class="{ 'is-preview': isPreview }">
      <router-link :to="postPrettyUrl" v-if="showImg" class="img-container">
        <img :src="post.featuredImage"/>
      </router-link>
      <div class="body-container">
        <post-preview-copy
          :post="post"
          :displayedPosts="displayedPosts"
          :isPreview="isPreview"
          :showGuest="showGuest"
          :showTags="showTags"
          :showCopy="showCopy" />
      </div>
    </div>
  </div>
</template>

<script>
import PostPreviewCopy from './PostPreviewCopy'
import AnswerPreview from '@/components/qa/AnswerPreview'
import { NewsTitle } from '@/components/typography'
import { postPrettyUrl } from '@/utils/post.utils'

export default {
  name: 'post-preview',

  components: {
    PostPreviewCopy,
    AnswerPreview,
  },

  props: {
    post: {
      type: Object
    },
    layout: {
      type: String,
      default: 'stack',
      validator: function (prop = 'stack') {
        const oneOf = ['stack', 'line']
        return (oneOf.indexOf(prop) !== -1)
      },
    },
    displayedPosts: {
      type: Array,
    },
    inverse: {
      type: Boolean
    },
    isPreview: {
      type: Boolean
    },
    showImg: {
      type: Boolean,
      default: true
    },
    showTags: {
      type: Boolean,
      default: true
    },
    showGuest: {
      type: Boolean,
      default: true
    },
    showCopy: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    postPrettyUrl () {
      return postPrettyUrl(this.post)
    }
  }
}
</script>

<style lang="stylus" scoped>
a
  text-decoration none !important
  cursor pointer

.answer-post
  padding 1rem

.news-post
  .body
    padding-right 0
    padding-left 0

.news-post,
.answer-post
  display flex
  flex-direction column
  position relative
  margin 0 0 2rem

  &.is-preview
    margin 0 0 40px
    max-width 100%

  &.inverse
    background #222

  .img-container
    overflow hidden
    height 400px
    background #fff
    border 2px solid #e9ecef

    img
      width 100%
      height 100%
      object-fit contain 
      transition all .2s

  @media (max-width: 750px)
    width 100%
    margin 15px auto 40px
    border none

@media (min-width 751px)
  .layout-line
    .news-post
      align-items flex-start
      flex-direction row

    .img-container
      flex-grow 1
      max-width 25%
      height auto
      margin-top 2rem
      margin-right 1rem

    .body-container
      flex-grow 3

</style>
