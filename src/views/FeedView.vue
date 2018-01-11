
<template>
  <div>
    <h1> Feed </h1>
    <br />
      <feed-item v-for="feedItem in feed" :key="feedItem._id" :feedItem="feedItem" />
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
        this.fetchMyFeed({ userId: this.me._id })
          .then((feedItems) => {
            this.loading = false
          })
      })
  },
  methods: {
    ...mapActions(['fetchMyProfileData', 'fetchMyFeed'])
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


<style scoped lang="stylus">
  h1 {
    text-align: center;
    margin: 30px auto;
  }
</style>
