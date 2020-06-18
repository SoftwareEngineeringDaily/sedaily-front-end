<template>
  <div v-if="job && job.isDeleted">
    <div class="bg-warning"> You previously deleted the job: {{ job.title }}</div>
  </div>
  <div v-else>
    <div v-if="isLoggedIn && job">
      <job-form
        :header="'Update Job:'"
        :submitCallback="submitUpdateJob"
        :deleteCallback="submitDeleteJob"
        :editingJob="true"
        :jobData="job"
        :loading="loading"
      >
      </job-form>
    </div>
    <div v-if="error">
      <div class="bg-danger"> Error: {{ error }}</div>
    </div>
  </div>
</template>

<script>
import JobForm from '@/components/job/JobForm'
import { mapGetters, mapActions, mapState } from 'vuex'
// TODO: disable if userId is not the same as postingUser
export default {
  name: 'add-job-view',
  data () {
    return {
      loading: false,
      job: null,
      error: null
    }
  },
  created () {
    if (!this.isLoggedIn) {
      this.error = 'Unauthorized'
      return
    }
    this.fetchData()
  },
  watch: {
    // re-fetch if route changes
    '$route': 'fetchData'
  },
  components: {
    JobForm
  },
  methods: {
    // TODO: once profile issue resolved, don't fetch profile here
    // https://github.com/SoftwareEngineeringDaily/sedaily-front-end/issues/239
    ...mapActions(['updateJob', 'fetchJob', 'deleteJob']),
    fetchData () {
      this.loading = true
      this
        .fetchJob({ jobId: this.jobId })
        .then(response => {
          if (response.data.postedUser !== this.me._id) {
            this.error = 'Unauthorized'
            return
          }

          this.job = response.data
          this.error = null
        })
        .catch((error) => {
          this.error = error.response.data.message
        })
        .finally(() => {
          this.loading = false
        })
    },
    submitUpdateJob (data) {
      this.loading = true
      this.updateJob({
        jobId: this.jobId,
        ...data,
      })
        .then(() => {
          this.$toasted.success('Successfully Edited!')
          this.$router.push('/jobs')
        })
        .catch((error) => {
          this.error = error.response.data.message
        })
        .finally(() => {
          this.loading = false
        })
    },
    submitDeleteJob () {
      this.loading = true
      this.deleteJob({ jobId: this.jobId })
        .then(() => {
          this.$toasted.success('Successfully Deleted!')
          this.$router.push('/jobs')
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
      me (state) {
        return state.me
      },
      jobId (state) {
        return state.route.params.id
      }
    })
  }
}
</script>

