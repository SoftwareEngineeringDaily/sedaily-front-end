<template>
  <div class="container">
    <template v-if="error">
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

export default {
  components: {
    FeedItem,
    ProfileDetails
  },
  async asyncData ({ store, params, $axios }) {
    const profileResponse = await $axios.get(`/users/${params.id}`)
    const feedResponse = await $axios.get(`/feed/profile-feed/${userId}`)

    return {
      user: profileResponse.data,
      feed: feedResponse.data,
      error: ''
    }
  }
}
</script>
