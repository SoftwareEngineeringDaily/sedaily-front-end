<template>
  <div class="job-summary">
    <div class="row job-title">
      <div class="col-12">
        <router-link :to="'/jobs/' + job._id">
          {{ job.title }} - {{ job.employmentType }}
        </router-link>
      </div>

    </div>
    <div class="row">
       <div class="col-12">
        {{ job.companyName }} - {{ job.location }}
        <span v-if="job.remoteWorkingConsidered">&nbsp;(Remote Ok)</span>
       </div>
    </div>
    <div class="row job-short-description">
      <div class="col-12">
          {{ shortDescription }}
      </div>
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
  methods: {
  }
}
</script>

<style scoped lang="stylus">
@import './../../css/variables'

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
