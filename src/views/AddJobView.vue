<template>
  <div>
    <job-form
      :header="'Post a New Job:'"
      :submitCallback="submitCreateJob"
      :loading="loading">
    </job-form>
  </div>
</template>

<script>
import JobForm from '@/components/JobForm.vue'
import { mapActions } from 'vuex'
export default {
  name: 'add-job-view',
  data () {
    return {
      loading: false
    }
  },

  components: {
    JobForm
  },
  methods: {
    ...mapActions(['createJob']),
    submitCreateJob ({
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
      this.createJob({
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
          alert('Successfully Posted!')
          this.$router.push('/jobs')
        })
        .catch((error) => {
          alert('There was an error posting the job: ' + error)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  computed: {
  }
}
</script>

