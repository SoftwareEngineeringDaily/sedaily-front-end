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
    <hr>
    <h4 v-if="feed.length > 0" class="row">
      User's Feed
    </h4>
    <div class="row">
      <feed-item v-for="feedItem in feed" :key="feedItem._id" :feedItem="feedItem">
      </feed-item>
    </div>
  </div>
</template>
<script type="text/javascript">
import { mapActions, mapState } from 'vuex'
import FeedItem from '@/components/FeedItem.vue'
import ProfileDetails from '@/components/ProfileDetails.vue'
import Spinner from '@/components/Spinner.vue'

export default {
  name: 'public-profile-view',
  components: {
    FeedItem,
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
    ...mapActions(['fetchPublicProfileData', 'fetchProfileFeed']),
    fetchData () {
      this.loading = true
      Promise.all([
        this.fetchPublicProfileData({ userId: this.userId }),
        this.fetchProfileFeed({ userId: this.userId })
      ])
        .then((responses) => {
          /* TODO: Discuss best approach for managing fetched data's state
             in vuex if it's just being displayed and not interacted with:
             not in vuex like this.user or in vuex like feed below
           */
          this.user = responses[0].data
        })
        .catch((error) => {
          this.error = error.response.data.message
        })
        .finally(() => {
          this.loading = false
        })
    }
  },

  computed: {
    ...mapState({
      userId (state) {
        return state.route.params.id
      },
      feed (state) {
        return state.feed
      }
    })
  }
}
</script>
