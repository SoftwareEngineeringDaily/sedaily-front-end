
<template>
  <div>
    <h1> Feed </h1>
    <div class="feed-list">
      <feed-item v-for="feedItem in feed" :key="feedItem._id" :feedItem="feedItem" />
    </div>
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
    return this
      .fetchMyFeed({ userId: this.me._id })
      .then((feedItems) => {
        this.loading = false
      })
  },
  methods: {
    ...mapActions(['fetchMyFeed'])
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
h1
  text-align center
  margin 30px auto

.feed-list
  display flex
  flex-direction column
  justify-content space-around
</style>
