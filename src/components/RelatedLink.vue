<template>
  <div class='link-holder'>
    <p> {{relatedLink.title}} </p>
    <a :href="url" target="_blank"
    rel="external nofollow"
    > {{relatedLink.url}} </a>
  </div>
</template>

<script>
// import { mapActions, mapState } from 'vuex'
export default {
  name: 'related-link',
  props: ['relatedLink'],
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
