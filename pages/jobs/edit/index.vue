<template>
  <div v-if="job.isDeleted">
    <div class="bg-warning"> You previously deleted the job: {{ job.title }}</div>
  </div>
  <div v-else>
    <div v-if="isLoggedIn">
      <job-form
        :header="'Update Job:'"
        :submit-callback="submitUpdateJob"
        :delete-callback="submitDeleteJob"
        :editing-job="true"
        :job-data="job"
        :loading="loading" />
    </div>
    <div v-if="error">
      <div class="bg-danger"> Error: {{ error }}</div>
    </div>
  </div>
</template>

<script>
import JobForm from '~/components/JobForm.vue'
import { mapGetters, mapActions, mapState } from 'vuex'

// TODO: disable if userId is not the same as postingUser
export default {
  components: {
    JobForm
  },
  middleware: 'auth',
  data () {
    return {
      loading: false,
      job: null,
      error: null
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      me ({ auth }) {
        return auth ? auth.user : null
      },
      jobId (state) {
        return state.route.params.id
      }
    })
  },
  watch: {
    // re-fetch if route changes
    '$route': 'fetchData'
  },
  created () {
    if (!this.isLoggedIn) {
      this.error = 'Unauthorized'
      return
    }
    this.fetchData()
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
          if (responses.data.postedUser !== this.me._id) {
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
    submitUpdateJob ({
      title,
      description,
      employmentType,
      location,
      remoteWorkingConsidered,
      applicationEmailAddress,
      companyName,
      tags
    }) {
      this.loading = true
      this.updateJob({
        jobId: this.jobId,
        title,
        description,
        employmentType,
        location,
        remoteWorkingConsidered,
        applicationEmailAddress,
        companyName,
        tags
      })
        .then(() => {
          alert('Successfully Edited!')
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
          alert('Successfully Deleted!')
          this.$router.push('/jobs')
        })
        .catch((error) => {
          this.error = error.response.data.message
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

