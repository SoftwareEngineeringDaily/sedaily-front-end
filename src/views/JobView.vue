<template>
  <div>
    <job-apply-modal
      :id="'jobApplyModal'"
      :title="job.title"
      :jobId="jobId"
    ></job-apply-modal>
    <div class="container">
      <div class="row">
        <div v-if="loading">
          <spinner :show="loading"></spinner>
        </div>
        <div v-else-if="error">
          <div class="bg-danger"> Error: {{ error }}</div>
        </div>
        <div v-else-if="job.isDeleted">
          <div class="bg-warning"> You previously deleted the job: {{ job.title }}</div>
        </div>
        <div v-else class="col-md-10 offset-md-1">
          <h4 class="row">{{ job.title }} - {{ job.employmentType }}</h4>
          <div class="row">{{ job.companyName }} - {{ job.location }}
            <span v-if="job.remoteWorkingConsidered">&nbsp;(Remote Ok)</span>
          </div>
          <br>
          <div class="row job-link">
            <span v-if="!isLoggedIn">
              <router-link to="/login">
                Login to Apply
              </router-link>
            </span>
            <span v-else-if="ownJobPosting">
              <router-link :to="'/edit-job/' + jobId">
                Edit Job Posting
              </router-link>
            </span>
            <span v-else>
              <button class="btn button-submit" data-toggle="modal" data-target="#jobApplyModal">
                Apply to Job
              </button>
            </span>
          </div>
          <div class="row job-description">
              {{ job.description }}
          </div>
          <div class="row job-date">
            Posted on {{ date }}
          </div>
          <br>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Spinner from '@/components/Spinner.vue'
import JobApplyModal from '@/components/JobApplyModal.vue'
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
  name: 'job-view',
  data () {
    return {
      loading: false,
      job: null,
      error: null
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    // re-fetch if route changes
    '$route': 'fetchData'
  },
  components: {
    Spinner,
    JobApplyModal
  },
  methods: {
    // TODO: once profile issue resolved, don't fetch profile here
    // https://github.com/SoftwareEngineeringDaily/sedaily-front-end/issues/239
    ...mapActions(['fetchMyProfileData', 'fetchJob']),
    fetchData () {
      this.loading = true
      const promiseActions = [this.fetchJob({ jobId: this.jobId })]
      if (this.isLoggedIn) {
        promiseActions.push(this.fetchMyProfileData())
      }

      Promise.all(promiseActions).then((responses) => {
        this.job = responses[0].data
        this.error = null
      })
        .catch((error) => {
          this.error = error.response.data.message
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      jobId (state) {
        return state.route.params.id
      },
      me (state) {
        return state.me
      },
      ownJobPosting () {
        return this.me._id === this.job.postedUser
      },
      date () {
        return moment(this.job.postedDate).format('MMMM Do, YYYY')
      }
    })
  }
}
</script>

<style scoped lang="stylus">
@import './../css/variables'

.job-link
  a
    color accent-color

.job-description
  white-space: pre-wrap;

.job-date
  font-size 0.9em
  color #999
</style>
