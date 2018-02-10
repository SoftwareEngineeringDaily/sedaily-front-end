<template>
  <div>
    <div class="row">
        <div class="col-6">
          <router-link :to="'/jobs/' + job._id">
            {{ job.title }}
          </router-link>
        </div>
        <div class="col-3">
          {{ job.companyName }}
        </div>
        <div class="job-posted-date col-3">
          Posted: {{ displayDate }}
        </div>
        <div class="col-6">
          {{ job.employmentType }}
        </div>
        <div class="col-3">
          {{ displayLocation }}
        </div>
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
  },
  methods: {
  }
}
</script>

<style scoped lang="stylus">
.job-posted-date, .job-short-description
  color: #999
  font-size: 0.85em
</style>
