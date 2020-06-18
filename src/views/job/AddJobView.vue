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
import JobForm from '@/components/job/JobForm'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'add-job-view',

  data () {
    return {
      loading: false,
      error: null
    }
  },

  created () {
    if (!this.isLoggedIn) {
      this.error = 'Unauthorized'
    }
  },

  components: {
    JobForm,
  },

  methods: {
    ...mapActions(['createJob']),

    submitCreateJob (data) {
      this.loading = true
      console.log('data ', data)
      this.createJob(data)
        .then(() => {
          this.$toasted.success('Successfully Posted!')
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
    ...mapGetters(['isLoggedIn'])
  }
}
</script>

