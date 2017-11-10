<template>
  <div>
    <div v-for="relatedLink in relatedLinks">
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
</style>
