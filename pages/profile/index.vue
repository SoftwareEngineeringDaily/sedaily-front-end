<template>
  <div class="container">
    <template v-if="me">
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

export default {
  components: {
    FeedItem,
    ProfileDetails
  },
  async asyncData ({ store, $axios }) {
    const profileResponse = await $axios.get(`/users/${store.state.auth.user._id}`)
    const feedResponse = await $axios.get(`/feed/profile-feed/${store.state.auth.user._id}`)

    return {
      me: profileResponse.data,
      feed: feedResponse.data,
      error: ''
    }
  }
}
</script>
