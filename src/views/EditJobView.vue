<template>
  <div>
    <job-form
      :header="'Update Job:'"
      :submitFunction="submitUpdateJob"
      :editingJob="true"
      :jobData="job"
    >
    </job-form>
    <spinner :show="loading"></spinner>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import JobForm from '@/components/JobForm.vue'
import { mapActions, mapState } from 'vuex'
// TODO: disable if userId is not the same as postingUser
export default {
  name: 'add-job-view',
  data () {
    return {
      loading: false,
      job: null
    }
  },
  created () {
    this.fetchInitialData()
  },
  watch: {
    // re-fetch if route changes
    '$route': 'fetchInitialData'
  },
  components: {
    JobForm,
    Spinner
  },
  methods: {
    ...mapActions(['updateJob', 'fetchJob']),
    fetchInitialData () {
      this.loading = true
      this.fetchJob({ jobId: this.jobId })
        .then((response) => {
          this.job = response.data
        }).catch((error) => {
          alert('There was an error fetching data: ' + error)
        }).finally(() => {
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
          alert('There was an error updating the job: ' + error)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  computed: {
    ...mapState({
      jobId (state) {
        return state.route.params.id
      }
    })
  }
}
</script>

