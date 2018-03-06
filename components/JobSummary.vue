<template>
  <div class="job-summary">
    <div class="row job-title">
      <nuxt-link :to="'/jobs/' + job._id">
        {{ job.title }} - {{ job.employmentType }}
      </nuxt-link>
    </div>
    <div class="row">
      {{ job.companyName }} - {{ job.location }}
      <span v-if="job.remoteWorkingConsidered">&nbsp;(Remote Ok)</span>
    </div>
    <div class="row job-short-description">
      {{ shortDescription }}
    </div>
  </div>
</template>

<script>
/* @flow */
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
  }
}
</script>

<style scoped lang="stylus">
@import '../assets/stylus/variables'

.job-summary
  margin-bottom 30px
.job-title
  font-size 1.2em
  background idle-background
  &:hover
    background primary-color
    a
      color white
  a
    color primary-color
.job-short-description
  color #999
  font-size 0.85em
</style>
