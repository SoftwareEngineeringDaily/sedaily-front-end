
<template>
  <div class="container">
    <spinner :show="loading"></spinner>
    <h4 class="row"> Jobs Board </h4>
    <div class="row">
      <router-link v-if="isLoggedIn" to="/add-job">
        Post a Job
      </router-link>
      <router-link v-else to="/login">
        Login to Post a Job
      </router-link>
    </div>
    <job-summary v-for="job in jobs" :key="job._id" :job="job">
    </job-summary>
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
      loading: true
    }
  },
  beforeMount () {
    this.fetchJobsList()
      .then(() => {
        this.loading = false
      })
      .catch((error) => {
        alert('Error: ' + error)
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
</style>
