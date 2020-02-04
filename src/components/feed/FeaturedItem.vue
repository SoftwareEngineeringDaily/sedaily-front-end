<template>
  <div class="featured-section">
    <h5>Featured News</h5>
    <router-link :to="postPrettyUrl">
      <div class="featured-post">
        <div class="img-container">
          <img :src="post.featuredImage"/>
        </div>
        <div class="body-container">
          <post-details :post="post" :featured="true" :showGuest="true"/>
        </div>
      </div>
    </router-link>
  </div>
</template>


<script>
import PostDetails from '@/components/post/PostPreview/PostPreviewCopy'
import { postPrettyUrl } from '@/utils/post.utils'

export default {
  name: "featured-item",
  components: { PostDetails },
  props: {
    post: {
      type: Object,
      required: true,
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
h5
  text-transform uppercase
  font-size .8rem
  font-weight 700
.featured-section
  margin 50px 0
.featured-post
  @media (min-width 900px)
    justify-content space-between
    display flex
      flex-direction row
      align-items center
  .img-container
    margin 0 auto
    width 100%
    justify-content flex-start
    overflow hidden
    @media (min-width 900px)
      flex-basis 50%
    img
      width 100%
      transition all .2s
  .body-container
    @media (min-width 900px)
      text-align: left;
      flex-basis: 50%;
      padding-left: 5rem
  &:hover
    img
      transform scale(1.05)

</style>









