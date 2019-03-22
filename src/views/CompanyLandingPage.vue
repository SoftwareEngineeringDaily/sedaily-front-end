<template>
  <div class="container text-center">
    <div v-if="error">
      {{error}}
    </div>
    <company-header
    :companyName="companyName"
    :description="description"
    :externalUrl="externalUrl"
    :headerImage="imageUrl" />

    <div class="col-sm-8 offset-sm-2 col-md-6 offset-md-3">
      <job-summary v-for="job in jobs" :key="job._id" :job="job">
      </job-summary>
    </div>

  </div>

</template>

<script>

import CompanyHeader from '@/components/CompanyHeader.vue'
import JobSummary from '@/components/JobSummary.vue'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'CompanyLandingPage',

  components: {
    CompanyHeader,
    JobSummary
  },

  computed: {
    ...mapState({
    })
  },

  beforeMount () {
    const localUrl = this.$route.params.company
    this.companiesFetchByLocalUrl(localUrl)
      .then((company) => {
        const {
          companyName,
          imageUrl,
          description,
          externalUrl
        } = company
        this.companyName = companyName
        this.description = description
        this.imageUrl = imageUrl
        this.externalUrl = externalUrl

        // Fetch the jobs:
        return this.jobsSearch({ companyName })
          .then((jobs) => {
            this.jobs = jobs
          })
      })
      .catch(() => {
        this.error = 'An error occured.'
      })
  },

  data () {
    return {
      error: null,
      description: '',
      companyName: '',
      imageUrl: '',
      externalUrl: '',
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
