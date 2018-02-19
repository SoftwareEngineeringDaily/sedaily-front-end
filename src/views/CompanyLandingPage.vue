<template>
  <div class="login-view container">
    <company-header
    companyName="Company Z"
    headerImage="http://softwareengineeringdaily.com/wp-content/uploads/2018/02/box1200x630.jpg" />
  </div>
</template>

<script>

import CompanyHeader from '@/components/CompanyHeader.vue'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'CompanyLandingPage',

  components: {
    CompanyHeader
  },

  computed: {
    ...mapState({
    })
  },

  beforeMount () {
    const localUrl = this.$route.params.company
    console.log(localUrl)
    this.companiesFetchByLocalUrl(localUrl)
      .then((company) => {
        console.log(company)
        const {
          companyName,
          description
        } = company
        this.companyName = companyName
        this.description = description

        // Fetch the jobs:
        return this.jobsSearch({ companyName })
          .then((jobs) => {
            console.log('jobs', jobs)
          })
      })
      .catch(() => {
        this.error = 'An error occured.'
      })
  },

  data () {
    return {
      error: null,
      description: null,
      companyName: null,
      jobs: []
    }
  },

  methods: {
    ...mapActions(['companiesFetchByLocalUrl', 'jobsSearch'])
  }
}
</script>

<style lang="stylus">
.container
  margin-top 45px
</style>
