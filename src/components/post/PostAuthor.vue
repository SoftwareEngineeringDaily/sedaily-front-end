<template>
  <div v-if="typeof post.author == 'object'" class="post-author">
    <img :src="post.author.image" :title="post.author.name" />
    <a :href="post.author.url" :title="post.author.name" target="_blank">{{post.author.name}}</a>
  </div>
</template>

<script>
export default {
  name: "post-author",
  props: {
    post: {
        type: Object,
        required: true
      }
  }
}
</script>

<style lang="stylus" scoped>
.post-author
  display flex
  align-items center
  margin-top 10px
  img
    width auto
    height 32px
    margin-right 10px
</style>
