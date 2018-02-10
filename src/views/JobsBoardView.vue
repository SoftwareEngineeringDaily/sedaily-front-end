
<template>
  <div class="container">
    <div v-if="error" class="bg-danger">
      {{ error }}
    </div>
    <div class="row justify-content-center">
      <h1 class="col-4 text-center">Jobs Board</h1>
    </div>
    <div class="row justify-content-center add-job-link">
        <router-link class="col-4 text-center" v-if="isLoggedIn" to="/add-job">
          Employers: Post a Job
        </router-link>
        <router-link class="col-4 text-center" v-else to="/login">
          Login to Apply or Post a Job
        </router-link>
    </div>
    <div class="row justify-content-center">
      <spinner :show="loading"></spinner>
    </div>
    <br>
    <div class="row">
      <div class="col-sm-8 offset-sm-2 col-md-6 offset-md-3">
        <job-summary v-for="job in jobs" :key="job._id" :job="job">
        </job-summary>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import Spinner from '@/components/Spinner.vue'
import JobSummary from '@/components/JobSummary.vue'
export default {
  name: 'jobs-board-view',

  components: {
    Spinner,
    JobSummary
  },

  data () {
    return {
      loading: false,
      error: null
    }
  },
  beforeMount () {
    this.loading = true
    this.fetchJobsList()
      .then(() => {
        this.error = null
      })
      .catch((error) => {
        this.error = 'Error: ' + error.response.data.message
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    ...mapActions(['fetchJobsList'])
  },

  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      jobs (state) {
        return state.jobs
      }
    })
  }
}
</script>
<style scoped lang="stylus">
@import './../css/variables'

.add-job-link
  a
    color accent-color
</style>
