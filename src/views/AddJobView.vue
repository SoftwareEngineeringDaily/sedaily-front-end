<template>
  <div>
    <div v-if="isLoggedIn">
      <job-form
        :header="'Post a New Job:'"
        :submitCallback="submitCreateJob"
        :loading="loading">
      </job-form>
    </div>
    <div v-if="error">
      <div class="bg-danger"> Error: {{ error }}</div>
    </div>
  </div>
</template>

<script>
import JobForm from '@/components/JobForm.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'add-job-view',
  data () {
    return {
      loading: false,
      error: null
    }
  },
  components: {
    JobForm
  },
  created () {
    if (!this.isLoggedIn) this.error = 'Unauthorized'
  },
  computed: {
    ...mapGetters([
      'isLoggedIn'
    ])
  },
  methods: {
    ...mapActions([
      'createJob'
    ]),

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
          this.$toasted.show('Successfully Posted!')
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

