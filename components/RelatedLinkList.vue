<template>
  <div>
    <h4 class="section-title"> Related Links </h4>
    <div
      v-for="relatedLink in relatedLinks"
      :key="relatedLink._id"
      class="related-links-list">
      <related-link :related-link="relatedLink" />
    </div>
  </div>
</template>

<script>
import RelatedLink from '~/components/RelatedLink.vue'

export default {
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
  }
}
</script>

<style scoped lang="stylus">
.related-links-list
  margin 20px 0px
</style>
