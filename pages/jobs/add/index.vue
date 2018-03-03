<template>
  <div>
    <div v-if="isLoggedIn">
      <job-form
        :header="'Post a New Job:'"
        :submit-callback="submitCreateJob"
        :loading="loading" />
    </div>
    <div v-if="error">
      <div class="bg-danger"> Error: {{ error }}</div>
    </div>
  </div>
</template>

<script>
import JobForm from '~/components/JobForm.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    JobForm
  },
  data () {
    return {
      loading: false,
      error: null
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn'])
  },
  created () {
    if (!this.isLoggedIn) {
      this.error = 'Unauthorized'
    }
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
          this.error = error.response.data.message
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
