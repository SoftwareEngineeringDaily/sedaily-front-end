<template>
  <div class="job-summary">
    <router-link :to="'/jobs/' + job._id" class="job-title">
      {{ job.title }} - {{ job.employmentType }}
    </router-link>
    <div class="job-short-description">
      <div>{{ job.companyName }} - {{ job.location }} <span v-if="job.remoteWorkingConsidered">&nbsp;(Remote Ok)</span></div>
      <p>{{ shortDescription }}</p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'JobSummary',
  props: {
    job: {
      type: Object,
      required: true
    }
  },
  computed: {
    displayDate () {
      return moment(this.job.postedDate).format('MMMM Do, YYYY')
    },
    displayLocation () {
      const remoteSuffix = this.job.remoteWorkingConsidered ? ' | Remote Ok' : ''
      return this.job.location + remoteSuffix
    },
    shortDescription () {
      if (this.job.description.length < 200) {
        return this.job.description
      } else {
        return this.job.description.substring(0, 200) + '...'
      }
    }
  },
}
</script>

<style scoped lang="stylus">
@import '../../css/variables'

.job-summary
  margin-bottom 30px

.job-title
  display block
  padding 0.2rem 0.5rem
  font-size 1.2em
  background idle-background

  &:hover
    color #ffffff
    background primary-color
    text-decoration none

.job-short-description
  padding 0.2rem 0.5rem
  font-size 14px
  color #222

  p
    color #999

</style>
