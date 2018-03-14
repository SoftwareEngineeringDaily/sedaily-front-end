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
    async submitUpdateJob (job) {
      this.loading = true

      try {
        await this.$axios.put(`/jobs/${this.job._id}`, job)

        this.$toast.show('Successfully Edited!')
        this.$router.push('/jobs')
      } catch (err) {
        this.error = err.response.data.message
      }
      
      this.loading = false
    },
    async submitDeleteJob () {
      this.loading = true

      try {
        await this.$axios.delete(`/jobs/${this.job._id}`)

        this.$toast.show('Successfully Deleted!')
        this.$router.push('/jobs')
      } catch (err) {
        this.error = err.response.data.message
      }
      
      this.loading = false
    }
  }
}
</script>

