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
        :user-data="me"
        :own-profile="true" />
      <hr>
      <h4
        v-if="feed.length > 0"
        class="row">
        Your Feed
      </h4>
      <div class="row">
        <feed-item
          v-for="feedItem in feed"
          :key="feedItem._id"
          :feed-item="feedItem" />
      </div>
    </template>
  </div>
</template>

<script>
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
      error: null
    }
  },
  computed: {
    ...mapState({
      me ({ auth }) {
        return auth ? auth.user : null
      },
      feed (state) {
        return state.feed
      }
    })
  },
  fetch ({ store, params }) {
    this.loading = true

    return store.dispatch('fetchProfileFeed', { userId: store.state.auth.user._id })
      .then(() => {
        this.loading = false
        this.error = null
      })
  },
  methods: {
    ...mapActions(['fetchProfileFeed'])
  }
}
</script>
