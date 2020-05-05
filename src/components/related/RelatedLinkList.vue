<template>
  <div class="related-container" v-if="relatedLinks">
    <h6 class="section-title">{{ headline }}</h6>
    <div v-for="relatedLink in relatedLinks" class="related-links-list" :key="relatedLink._id">
      <related-link
        :relatedLink="relatedLink"
        :isTruncated="isTruncated" />
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
    isTruncated: {
      type: Boolean,
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
  margin 0 0 10px
  font-size 0.8rem

.related-container
  margin 0 0 20px
  padding 1.5rem
  background #e9ecef

</style>
