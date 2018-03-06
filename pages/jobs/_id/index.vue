<template>
  <div v-if="job">
    <job-apply-modal
      :id="'jobApplyModal'"
      :title="job.title"
      :job-id="job._id" />
    <div class="container">
      <div class="row">
        <div v-if="loading">
          <spinner :show="loading" />
        </div>
        <div v-else-if="error">
          <div class="bg-danger"> Error: {{ error }}</div>
        </div>
        <div v-else-if="job.isDeleted">
          <div class="bg-warning"> You previously deleted the job: {{ job.title }}</div>
        </div>
        <div
          v-else
          class="col-md-10 offset-md-1">
          <h4 class="row">{{ job.title }} - {{ job.employmentType }}</h4>
          <div class="row">{{ job.companyName }} - {{ job.location }}
            <span v-if="job.remoteWorkingConsidered">&nbsp;(Remote Ok)</span>
          </div>
          <br>
          <div class="row job-link">
            <span v-if="!isLoggedIn">
              <nuxt-link to="/login">
                Login to Apply
              </nuxt-link>
            </span>
            <span v-else-if="ownJobPosting">
              <nuxt-link :to="'/jobs/edit/' + job._id">
                Edit Job Posting
              </nuxt-link>
            </span>
            <span v-else>
              <button
                class="btn button-submit"
                data-toggle="modal"
                data-target="#jobApplyModal">
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
import Spinner from '~/components/Spinner.vue'
import JobApplyModal from '~/components/JobApplyModal.vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  components: {
    Spinner,
    JobApplyModal
  },
  data () {
    return {
      loading: false,
      error: null
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      job (state) {
        return state.job
      },
      me ({ auth }) {
        return auth ? auth.user : null
      },
      ownJobPosting () {
        return this.me._id === this.job.postedUser
      },
      date () {
        return moment(this.job.postedDate).format('MMMM Do, YYYY')
      }
    })
  },
  fetch ({ store, params }) {
    return store.dispatch('fetchJob', { jobId: params.id })
  }
}
</script>

<style scoped lang="stylus">
@import '../../../assets/stylus/variables'

.job-link
  a
    color accent-color

.job-description
  white-space: pre-wrap;

.job-date
  font-size 0.9em
  color #999
</style>
