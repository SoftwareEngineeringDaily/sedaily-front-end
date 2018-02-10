<template>
  <div class="container">
    <spinner :show="loading"></spinner>
    <div class="row">
      <div class="col-md-10 offset-md-1">
        <h4 class="row">{{ job.title }}</h4>
        <div class="row">
          <span v-if="!isLoggedIn">
            <router-link to="/login">
              Log in to Apply
            </router-link>
          </span>
          <span v-else-if="ownJobPosting">
            <router-link :to="'/edit-job/' + jobId">
              Edit Job
            </router-link>
          </span>
          <span v-else>
            <button class="btn call-to-action">
              Apply
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
  name: 'job-view',
  data () {
    return {
      loading: false,
      job: null
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    // re-fetch if route changes
    '$route': 'fetchData'
  },
  components: {
    Spinner
  },
  methods: {
    ...mapActions(['updateJob', 'fetchJob', 'deleteJob']),
    fetchData () {
      this.loading = true
      this.fetchJob({ jobId: this.jobId })
        .then((response) => {
          this.job = response.data
        }).catch((error) => {
          alert('There was an error fetching data: ' + error)
        }).finally(() => {
          this.loading = false
        })
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      jobId (state) {
        return state.route.params.id
      },
      me (state) {
        return state.me
      },
      ownJobPosting () {
        return this.me._id === this.job.postedUser
      }
    })
  }
}
</script>

