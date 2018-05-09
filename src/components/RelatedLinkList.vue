<template>
  <div>
    <h4 class='section-title'> Related Links </h4>
    <div v-for="relatedLink in relatedLinks" class="related-links-list" :key="relatedLink._id">
      <div @click="logLink(relatedLink.url)">
        <related-link :relatedLink="relatedLink"></related-link>
      </div>
    </div>
  </div>
</template>

<script>
import RelatedLink from '@/components/RelatedLink.vue'

export default {
  name: 'related-link-list',
  components: { RelatedLink },
  props: {
    relatedLinks: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      loading: true,
      username: null
    }
  },
  methods: {
    logLink (url) {
      console.log(url)
    }
  }
}
</script>

<style scoped lang="stylus">
.related-links-list
  margin 20px 0px
</style>
