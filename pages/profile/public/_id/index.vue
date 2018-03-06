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
import Spinner from '~/components/Spinner.vue'

export default {
  components: {
    FeedItem,
    ProfileDetails,
    Spinner
  },
  asyncData ({ store, params }) {
    return Promise.all([
        store.dispatch('fetchPublicProfileData', { userId: params.id }),
        store.dispatch('fetchProfileFeed', { userId: params.id })
      ])
        .then((responses) => {
          /* TODO: Discuss best approach for managing fetched data's state
             in vuex if it's just being displayed and not interacted with:
             not in vuex like this.user or in vuex like feed below
           */
          return {
            user: responses[0].data,
            error: ''
          }
        }).
        catch(err => {
          return {
            error: err,
            user: null
          }
        })
  },
  computed: {
    ...mapState({
      feed (state) {
        return state.feed
      }
    })
  }
}
</script>
