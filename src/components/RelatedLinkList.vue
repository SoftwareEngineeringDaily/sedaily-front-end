<template>
  <div>
    <h4 class="mt-2">Related Links </h4>
    <related-link :relatedLink="relatedLink" v-for="relatedLink in relatedLinks" :key="relatedLink._id" />
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
  }
}
</script>