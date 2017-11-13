<template>
  <div>
    <a :href="relatedLink.url" target="_blank"> {{relatedLink.url}} </a>
  </div>
</template>

<script>
// import { mapActions, mapState } from 'vuex'
export default {
  name: 'related-link',
  props: ['relatedLink']
}
</script>

<style scoped>
</style>
