<template>
  <router-link :to="postPrettyUrl" class="news-post" :class="{ 'is-preview': isPreview }">
    <div class="img-container" v-if="showImg">
      <img :src="post.featuredImage"/>
    </div>
    <div class="body-container">
      <post-preview-copy
        :post="post"
        :isPreview="isPreview"
        :showGuest="showGuest"
        :showTags="showTags"
        :showCopy="showCopy" />
    </div>
  </router-link>
</template>

<script>
import PostPreviewCopy from './PostPreviewCopy'
import { postPrettyUrl } from '@/utils/post.utils'

export default {
  name: "post-preview",
  components: { PostPreviewCopy },
  props: {
    post: {
      type: Object
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
.news-post
  display flex
  flex-direction column
  position relative
  max-width 525px
  margin 15px 16% 40px
  background #e9ecef
  &.is-preview
    margin 0 0 40px
    max-width 100%
  &.inverse
    background #222
  .img-container
    height 200px
    background #fff
    overflow hidden
    img
      width 100%
      height 100%
      object-fit cover
      transition all .2s
  @media (max-width: 750px)
    width 100%
    margin 15px auto

</style>
