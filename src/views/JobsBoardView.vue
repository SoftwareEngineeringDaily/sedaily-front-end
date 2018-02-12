
<template>
  <div class="container">
    <div v-if="error" class="bg-danger">
      {{ error }}
    </div>
    <div class="row justify-content-center">
      <h1 class="col-10 text-center">Jobs Board</h1>
    </div>
    <div class='search-bar'>
      <input
        class='search-bar-input'
        type='text'
        placeholder='Search...'
        v-model='searchTerm'/>
    </div>
    <div class="row justify-content-center add-job-link">
        <router-link class="col-10 text-center" v-if="isLoggedIn" to="/add-job">
          Employers: Post a Job
        </router-link>
        <router-link class="col-10 text-center" v-else to="/login">
          Login to Apply or Post a Job
        </router-link>
    </div>
    <div class="row justify-content-center">
      <spinner :show="loading"></spinner>
    </div>
    <br>
    <div class="row">
      <div class="col-sm-8 offset-sm-2 col-md-6 offset-md-3">
        <job-summary v-for="job in filteredJobs" :key="job._id" :job="job">
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
      error: null,
      searchTerm: ''
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
    // TODO: determine preferred searching method
    ...mapState({
      jobs (state) {
        return state.jobs
      },
      filteredJobs () {
        if (this.searchTerm.trim() === '') {
          return this.jobs
        } else {
          const searchRe = new RegExp(this.searchTerm.trim(), 'i')
          return this.jobs.filter((job) => {
            return job.title.search(searchRe) >= 0 || job.companyName.search(searchRe) >= 0 || job.location.search(searchRe) >= 0
          })
        }
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

.search-bar
  input
    width 100%
    margin 20px 0
    padding 10px
    font-size 2rem
    font-weight 100
    color #C4C4C4
    padding-left 20px
    border none
    border-bottom 1px solid #ccc
</style>
