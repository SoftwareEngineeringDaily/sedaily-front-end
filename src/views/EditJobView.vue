<template>
  <div v-if="job.isDeleted">
    <div class="bg-warning"> You previously deleted the job: {{ job.title }}</div>
  </div>
  <div v-else>
    <div v-if="isLoggedIn">
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
import JobForm from '@/components/JobForm.vue'
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
    ...mapActions(['fetchMyProfileData', 'updateJob', 'fetchJob', 'deleteJob']),
    fetchData () {
      this.loading = true
      const promiseActions = [this.fetchJob({ jobId: this.jobId })]
      if (this.isLoggedIn) {
        promiseActions.push(this.fetchMyProfileData())
      }

      Promise.all(promiseActions).then((responses) => {
        if (responses[0].data.postedUser !== responses[1].data._id) {
          this.error = 'Unauthorized'
          return
        }
        this.job = responses[0].data
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
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      jobId (state) {
        return state.route.params.id
      }
    })
  }
}
</script>

