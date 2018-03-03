<template>
  <div class="container">
    <div
      v-if="error"
      class="bg-danger">
      {{ error }}
    </div>
    <div class="row justify-content-center">
      <h1 class="col-10 text-center">Jobs Board</h1>
    </div>
    <div class="row justify-content-center add-job-link">
      <nuxt-link
        v-if="isLoggedIn"
        class="col-10 text-center"
        to="/jobs/add">
        Employers: Post a Job
      </nuxt-link>
      <nuxt-link
        v-else
        class="col-10 text-center"
        to="/login">
        Login to Apply or Post a Job
      </nuxt-link>
    </div>
    <div class="row justify-content-center">
      <spinner :show="loading" />
    </div>
    <br>
    <div class="row">
      <div class="col-sm-10 offset-sm-1 col-md-8 offset-md-2">
        <div class="row justify-content-center">
          <div class="form-group col-sm-5">
            <input
              id="keywordSearchInput"
              v-model="keywordSearch"
              class="form-control"
              type="text"
              placeholder="title or company..."
              name="keywordSearch"
              @keydown.enter="search">
          </div>
          <div class="form-group col-sm-5">
            <input
              id="locationSearchInput"
              v-model="locationSearch"
              class="form-control"
              type="text"
              placeholder="location or remote..."
              name="locationSearch"
              @keydown.enter="search">
          </div>
          <div class="form-group col-sm-2 job-search-button">
            <!--<div class="row align-items-center">-->
            <button
              v-if="isFiltered"
              class="btn button-submit"
              @click="clearSearch"
            >Clear
            </button>
            <button
              v-else
              :disabled="!locationSearch && !keywordSearch"
              class="btn button-submit"
              @click="search">
              Search
            </button>
            <!--</div>-->
          </div>
        </div>
      </div>
      <div class="col-sm-8 offset-sm-2 col-md-6 offset-md-3">
        <job-summary
          v-for="job in displayedJobs"
          :key="job._id"
          :job="job" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import Spinner from '~/components/Spinner.vue'
import JobSummary from '~/components/JobSummary.vue'

export default {
  components: {
    Spinner,
    JobSummary
  },

  data () {
    return {
      loading: false,
      error: null,
      isFiltered: false,
      locationSearch: '',
      keywordSearch: '',
      displayedJobs: []
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      jobs (state) {
        return state.jobs
      }
    })
  },
  fetch ({ store }) {
    this.loading = true
    return store.dispatch('fetchJobsList')
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
      const keywordSearchRe = this.keywordSearch.trim() === '' ? null : new RegExp(this.keywordSearch.trim(), 'i')
      const locationSearchRe = this.locationSearch.trim() === '' ? null : new RegExp(this.locationSearch.trim(), 'i')
      const includeRemote = this.locationSearch.trim().toLowerCase() === 'remote'
      this.filtered = true
      this.displayedJobs = this.jobs.filter((job) => {
        return (
          keywordSearchRe && (job.title.search(keywordSearchRe) >= 0 || job.companyName.search(keywordSearchRe) >= 0) ||
          (locationSearchRe && job.location.search(locationSearchRe) >= 0) ||
          (includeRemote && job.remoteWorkingConsidered)
        )
      })
    },
    clearSearch () {
      this.keywordSearch = ''
      this.locationSearch = ''
      this.filtered = false
      this.displayedJobs = this.jobs
    }
  }
}
</script>

<style scoped lang="stylus">
@import '../../assets/stylus/variables'

.add-job-link
  a
    color accent-color

.job-search-button
  text-align: center

</style>
