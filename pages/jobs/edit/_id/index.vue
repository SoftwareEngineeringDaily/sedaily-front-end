<template>
  <div v-if="job.isDeleted">
    <div class="bg-warning"> You previously deleted the job: {{ job.title }}</div>
  </div>
  <div v-else>
    <div v-if="isLoggedIn && job">
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
      loading: false
    }
  },
  async asyncData ({ $axios, params }) {
    try {
      const jobResponse = await $axios.get(`/jobs/${params.id}`)
      return {
        job: jobResponse.data,
        error: null
      }
    } catch (err) {
      return {
        job: null,
        error: err
      }
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      me ({ auth }) {
        return auth ? auth.user : null
      }
    })
  },
  methods: {
    // TODO: once profile issue resolved, don't fetch profile here
    // https://github.com/SoftwareEngineeringDaily/sedaily-front-end/issues/239
    ...mapActions(['updateJob', 'deleteJob']),
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
        jobId: this.job._id,
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
          this.$toast.show('Successfully Edited!')
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
      this.deleteJob({ jobId: this.job._id })
        .then(() => {
          this.$toast.show('Successfully Deleted!')
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

