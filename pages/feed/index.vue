<template>
  <div>
    <h1> Feed </h1>

    <div class="feed-list">
      <feed-item
        v-for="feedItem in feed"
        :key="feedItem._id"
        :feed-item="feedItem" />
    </div>
  </div>
</template>

<script>
import FeedItem from '~/components/FeedItem.vue'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    FeedItem
  },
  data () {
    return {
      loading: true
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
  fetch ({ store }) {
    return store.dispatch('fetchMyFeed', { userId: this.me && this.me._id })
  },
  methods: {
    ...mapActions(['fetchMyFeed'])
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
