<template>
  <div class="container">
    <div v-if="loading" class="profile-loading"><spinner :show="loading"/></div>
    <div v-else-if="error" class="bg-danger"> Error: {{ error }}</div>
    <div v-else class="profile-view col-md-12">
      <profile-details :userData="user" />
      <profile-activities
        :userData="user"
        :activities="activities"
        :activityDays="activityDays" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ProfileDetails from '@/components/profile/ProfileDetails'
import ProfileActivities from './ProfileActivities'
import Spinner from '@/components/Spinner'

export default {
  name: 'public-profile-view',
  components: {
    ProfileDetails,
    ProfileActivities,
    Spinner
  },
  data () {
    return {
      loading: false,
      error: null,
      user: null,
      activities: null,
      activityDays: 0
    }
  },

  mounted () {
    this.fetchData()
  },

  methods: {
    ...mapActions(['fetchPublicProfileData']),
    async fetchData () {
      this.loading = true
      try {
        const response = await this.fetchPublicProfileData({ userId: this.userId })
        if (response.data) {
           this.user = response.data.user || {}
           this.activities = response.data.activities || {}
           this.activityDays = response.data.activityDays
        }
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
<style lang="stylus" scoped>
  .container
    .profile-loading
      text-align center
</style>
