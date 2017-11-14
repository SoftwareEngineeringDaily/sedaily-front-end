<template>
  <div class='link-holder'>

    <div class='voting' style='display:inline-block; height: 100%;'>
      <span class="score">
        <span class='arrow' v-bind:class="{ active: relatedLink.upvoted }"
        style='margin-left: 1px;' @click='upvoteHandler'>▲</span>
        <br>
        {{ relatedLink.score || 0}}
      </span>
    </div>

    <a :href="url" target="_blank"
    rel="external nofollow"
    > {{relatedLink.title}} </a>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'related-link',
  props: ['relatedLink'],
  methods: {
    ...mapActions(['upvoteRelatedLink']),
    upvoteHandler () {
      this.upvoteRelatedLink({
        id: this.relatedLink._id,
        postId: this.relatedLink.post
      })
    }
  },
  computed: {
    url () {
      // Turn url into clickable
      const {url} = this.relatedLink
      let newUrl = url
      if (url.indexOf('://') === -1) {
        newUrl = '//' + url
      }
      return newUrl
    }
  }
}
</script>

<style scoped>
  .link-holder {
    padding-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;

  }
</style>
