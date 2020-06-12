<template>
  <div>
    <div v-if="loading" class="center">
      <spinner :show="loading"></spinner>
    </div>
    <div v-else-if="error" class="bg-danger">
      Error: {{ error }}
    </div>
    <div v-else>

      <profile-details
        :userData="me"
        :ownProfile="true" />

      <div class="profile-footer" v-if="hasConnections">
        <label class="text-muted">Connect:</label>

        <a
          v-if="me.twitter"
          :href="`https://twitter.com/${me.twitter}`"
          :title="me.twitter"
          target="_blank"
          rel="external nofollow">
          <i class="fa fa-twitter fa-2x" />
        </a>

        <a
          v-if="me.website"
          :href="me.website | externalUrl"
          :title="me.website | host"
          target="_blank"
          rel="external nofollow">
          <i class="fa fa-globe fa-2x" />
        </a>
      </div>

      <div class="row">
        <div class="profile-item col-md-8">
          <profile-activities
            :userData="me"
            :activities="activities"
            :activityDays="activityDays" />
        </div>

        <div class="profile-item col-md-4">
          <profile-topics v-if="me" :user="me" />
        </div>
      </div>

    </div>
  </div>
</template>

<script type="text/javascript">
import { mapActions, mapState } from 'vuex'
import ProfileDetails from '@/components/profile/ProfileDetails'
import ProfileActivities from './ProfileActivities'
import ProfileTopics from './ProfileTopics'
import Spinner from '@/components/Spinner'

export default {
  name: 'profile-view',

  components: {
    ProfileDetails,
    ProfileActivities,
    ProfileTopics,
    Spinner
  },

  data () {
    return {
      loading: false,
      error: null,
      badges: null,
      activities: null,
      activityDays: 0
    }
  },

  computed: {
    ...mapState({
      me (state) {
        return state.me
      },
      alreadySubscribed (state) {
        return (
          state.me &&
          state.me.subscription &&
          state.me.subscription.active
        )
      },
    }),

    hasConnections () {
      return (this.me && (this.me.twitter || this.me.website))
    },
  },

  watch: {
    me (newData) {
      if (newData && newData._id) this.fetchData()
    }
  },

  mounted () {
    this.fetchData()
  },

  methods: {
    ...mapActions([
      'fetchPublicActivities',
    ]),

    async fetchData () {
      if (!this.me || !this.me._id) {
        return;
      }

      this.loading = true

      try {
        const response = await this.fetchPublicActivities({ userId: this.me._id })

        if (response.data) {
           this.activities = response.data.activities
           this.badges = response.data.badges || []
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
}
</script>
<style lang="stylus">
@import '../../css/variables'

.center
  text-align center
  margin 5vh 0

.profile-footer
  display flex
  align-items center
  justify-content flex-start
  margin-top -2rem
  margin-bottom 2rem
  padding 1rem 10px
  border-top 1px solid #e9ecef
  border-bottom 1px solid #e9ecef

  .fa-twitter:hover
    color #1da1f2

  .fa-globe:hover
    color #a591ff

  label
    margin-bottom 0

  & > *
    margin-right 1.5rem

.settings
  display inline-block
  font-weight 600

  &:hover
    color primary-color

.bg-danger
  text-align center
  color #ffffff
  padding 10px
  font-size 16px
  font-weight 600

</style>
