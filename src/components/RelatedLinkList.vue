<template>
  <div>
    <h4> Related Links </h4>
    <div v-for="relatedLink in relatedLinks" class="related-links-list">
      <related-link :relatedLink="relatedLink"> </related-link>
    </div>
</div>
</template>

<script>
import RelatedLink from '@/components/RelatedLink.vue'
// import { mapActions, mapState } from 'vuex'
export default {
  name: 'related-link-list',
  components: {RelatedLink},
  props: ['relatedLinks'],
  data () {
    return {
      loading: true,
      username: null
    }
  }
}
</script>

<style scoped>
.related-links-list {
  margin: 20px 0px;
}
</style>
