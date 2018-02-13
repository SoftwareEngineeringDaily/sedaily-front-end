<template>
  <div class="login-view container">
    <jobs-company-listing-header />
  </div>


</template>

<script>

import JobsCompanyListingHeader from '@/components/JobsCompanyListingHeader.vue'
export default {
  name: 'JobsLandingPage',

  components: {
    JobsCompanyListingHeader
  },

  data () {
    return {
    }
  },

  methods: {
  }
}
</script>

<style lang="stylus">
.container
  margin-top 45px
</style>
