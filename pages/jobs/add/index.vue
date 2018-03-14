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
    async submitCreateJob (job) {
      this.loading = true

      try {
        await this.$axios.post('/jobs', job)

        this.$toast.show('Successfully Posted!')
        this.$router.push('/jobs')
      } catch (err) {
        this.error = err.response.data.message
      }
     
      this.loading = false
    }
  }
}
</script>
