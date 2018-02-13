<template>
  <div class="login-view container">
    <jobs-company-listing-header
    companyName="Company Z"
    headerImage="http://softwareengineeringdaily.com/wp-content/uploads/2018/02/box1200x630.jpg" />
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
