<template>
  <div class="primary-post-header">
    <!--<div class="header-title" v-bind:style="{ 'background-image': 'url(' + imageStyle + ')' }">-->
    <div class="header-title">
      <h1>{{ post.title.rendered }}</h1>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true
    },
  },
  computed: {
    featuredImage () {
      return this.post.featuredImage
      ? this.post.featuredImage
      : 'https://softwareengineeringdaily.com/wp-content/uploads/2015/08/sed_logo_updated.png'
    },
    imageStyle () {
      return this.featuredImage
    },
  }
}
</script>

<style lang="stylus" scoped>
.primary-post-header
  display flex
  padding-top 2rem

.header-title
  width 100%
  h1
    margin 15px 20px
    font-weight 600
    font-size 2.5rem

@media (max-width 600px)
  .header-title
    h1
      font-size 2rem
</style>
