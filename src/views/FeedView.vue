
<template>
<v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
  <div>
    <feed-item v-for="feedItem in feed" :key="feedItem._id" :feedItem="feedItem" />    
  </div>
</v-flex>
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
