<template>
  <div class="related-container" v-if="relatedLinks">
    <h6 class="section-title">{{ headline }}</h6>
    <div v-for="relatedLink in relatedLinks" class="related-links-list" :key="relatedLink._id">
      <related-link :relatedLink="relatedLink"></related-link>
    </div>
    <slot />
  </div>
</template>

<script>
import RelatedLink from '@/components/related/RelatedLink'
import RelatedLinkCompose from '@/components/related/RelatedLinkCompose'

export default {
  name: 'related-link-list',
  components: {
    RelatedLink,
    RelatedLinkCompose,
  },
  props: {
    headline: {
      type: String,
    },
    relatedLinks: {
      type: Array,
      default: () => [],
      required: true
    },
    isLoggedIn: {
      type: Boolean,
      required: true
    },
  },
  data () {
    return {
      loading: true,
      username: null
    }
  },
}
</script>

<style scoped lang="stylus">
h4
  font-weight 400
.section-title
  margin-top 0
  font-size 0.8rem
.related-container
  margin 0 0 40px
  padding 2rem
  background #e9ecef
</style>
