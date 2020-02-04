<template>
  <div class="primary-post-header">
    <div class="header-title">
      <h1 v-if="post.title">{{ post.title.rendered }}</h1>
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
}
</script>

<style lang="stylus" scoped>
.primary-post-header
  display flex

.header-title
  width 100%
  h1
    margin 15px 0
    font-weight 800
    font-size 2.7rem

@media (max-width 600px)
  .header-title
    h1
      font-size 2rem
</style>
