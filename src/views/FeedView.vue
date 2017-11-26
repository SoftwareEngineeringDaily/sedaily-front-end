
<template>
  <div>
    <br />
        <h1>My Feed </h1>
        Hello
        <br />
        <br />
        <feed-item v-for="feedItem in feed" :key="feedItem._id" :feedItem="feedItem">
        </feed-item>
    <br />
  </div>
</template>

<script>
import FeedItem from '@/components/FeedItem.vue'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'feed-view',

  components: {
    FeedItem
  },

  data () {
    return {
      loading: true
    }
  },

  beforeMount () {
    this.fetchMyProfileData()
    .then(() => {
      this.fetchMyFeed({userId: this.me._id})
        .then((feedItems) => {
          console.log(feedItems)
          this.loading = false
        })
    })
  },
  methods: {
    ...mapActions([ 'fetchMyProfileData', 'fetchMyFeed' ])
  },

  computed: {
    ...mapState({
      me (state) {
        return state.me
      },
      feed (state) {
        return state.feed
      }
    })
  }
}
</script>
