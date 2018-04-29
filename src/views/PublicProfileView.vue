<template>
  <div class="container">
    <template v-if="loading">
      <spinner :show="loading"></spinner>
    </template>
    <template v-else-if="error">
      <div class="bg-danger"> Error: {{ error }}</div>
    </template>
    <template v-else>
      <profile-details
        :userData="user"
      ></profile-details>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ProfileDetails from '@/components/ProfileDetails.vue'
import Spinner from '@/components/Spinner.vue'

export default {
  name: 'public-profile-view',
  components: {
    ProfileDetails,
    Spinner
  },
  data () {
    return {
      loading: false,
      error: null,
      user: null
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    // re-fetch if route changes
    '$route': 'fetchData'
  },

  methods: {
    ...mapActions(['fetchPublicProfileData']),
    async fetchData () {
      this.loading = true
      try {
        const response = await this.fetchPublicProfileData({ userId: this.userId })
        this.user = response.data
      }
      catch (error) {
        this.error = error.response.data.message
      }
      finally {
        this.loading = false
      }
    }
  },

  computed: {
    ...mapState({
      userId (state) {
        return state.route.params.id
      }
    })
  }
}
</script>
