<template>
  <div class="container">
    <template v-if="loading">
      <spinner :show="loading" />
    </template>
    <template v-else-if="error">
      <div class="bg-danger"> Error: {{ error }}</div>
    </template>
    <template v-else>
      <profile-details
        v-if="user"
        :user-data="user" />
    </template>
    <hr>
    <h4
      v-if="feed.length > 0"
      class="row">
      User's Feed
    </h4>
    <div class="row">
      <feed-item
        v-for="feedItem in feed"
        :key="feedItem._id"
        :feed-item="feedItem" />
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapActions, mapState } from 'vuex'
import FeedItem from '~/components/FeedItem.vue'
import ProfileDetails from '~/components/ProfileDetails.vue'
import Spinner from '~/components/Spinner.vue'

export default {
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
  computed: {
    ...mapState({
      feed (state) {
        return state.feed
      }
    })
  },
  fetch ({ store, params }) {
    this.loading = true
      Promise.all([
        store.dispatch('fetchPublicProfileData', { userId: params.id }),
        store.dispatch('fetchProfileFeed', { userId: params.id })
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
}
</script>
