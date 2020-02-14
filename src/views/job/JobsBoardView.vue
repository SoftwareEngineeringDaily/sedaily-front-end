
<template>
  <div class="container-fluid">
    <div v-if="error" class="bg-danger">
      {{ error }}
    </div>
    <div class="row justify-content-center">
      <h1 class="col-12 text-center">Jobs Board</h1>
    </div>
    <div class="row justify-content-center add-job-link">
        <router-link class="col-12 text-center" v-if="isLoggedIn" to="/add-job">
          Employers: Post a Job
        </router-link>
        <router-link class="col-12 text-center" v-else to="/login">
          Login to Apply or Post a Job
        </router-link>
    </div>
    <div class="row justify-content-center">
      <spinner :show="loading"></spinner>
    </div>
    <br>
    <div class="row">
      <div class="col-sm-12 offset-sm-1 col-md-8 offset-md-2">
        <div class="row justify-content-center">
        <div class="form-group col-sm-5">
          <input
            class="form-control"
            type="text"
            placeholder="Title or Company..."
            id="keywordSearchInput"
            name="keywordSearch"
            v-model="keywordSearch"
            @keydown.enter="search"
          />
        </div>
        <div class="form-group col-sm-5">
          <input
            class="form-control"
            type="text"
            placeholder="Location or Remote..."
            id="locationSearchInput"
            name="locationSearch"
            v-model="locationSearch"
            @keydown.enter="search"
          />
        </div>
        <div class="form-group col-sm-2 job-search-button">
          <!--<div class="row align-items-center">-->
            <button
              v-if="filtered"
              class="btn button-submit"
              @click="clearSearch"
            >Clear
            </button>
            <button
              v-else
              class="btn button-submit"
              @click="search"
              :disabled="!locationSearch && !keywordSearch"
            >Search
            </button>
          <!--</div>-->
        </div>
        </div>
      </div>
      <div class="col-sm-10 offset-sm-1 col-md-8 offset-md-2">
        <job-summary v-for="job in displayedJobs" :key="job._id" :job="job">
        </job-summary>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import Spinner from '@/components/Spinner'
import JobSummary from '@/components/job/JobSummary'
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
      filtered: false,
      locationSearch: '',
      keywordSearch: '',
      displayedJobs: []
    }
  },
  beforeMount () {
    this.loading = true
    this.fetchJobsList()
      .then(() => {
        this.error = null
        this.displayedJobs = this.jobs
      })
      .catch((error) => {
        this.error = 'Error: ' + error.response.data.message
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    ...mapActions(['fetchJobsList']),
    // TODO: determine best approach to search
    search () {
      if (!this.keywordSearch && !this.locationSearch) {
        // if both blank clear search instead
        return this.clearSearch()
      }
      this.filtered = true
      const keywordSearchRe = !this.keywordSearch ? null : new RegExp(this.keywordSearch, 'i')
      const locationSearchRe = !this.locationSearch ? null : new RegExp(this.locationSearch, 'i')
      const includeRemote = this.locationSearch.trim().toLowerCase() === 'remote'
      this.displayedJobs = this.jobs.filter((job) => {
        const keywordResult = keywordSearchRe === null ? true : job.title.search(keywordSearchRe) >= 0 || job.companyName.search(keywordSearchRe) >= 0
        const locationResult = locationSearchRe === null ? true : job.location.search(locationSearchRe) >= 0 || includeRemote && job.remoteWorkingConsidered
        return keywordResult && locationResult
      })
    },
    clearSearch () {
      this.keywordSearch = ''
      this.locationSearch = ''
      this.filtered = false
      this.displayedJobs = this.jobs
    }
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
@import '../../css/variables'

.add-job-link
  a
    color accent-color

.job-search-button
  text-align: center

</style>
