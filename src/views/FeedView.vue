<template>
  <div>
    <br />
    <br />
    <div class="feed-list">
      <feed-item-wrapper v-for="feedItem in feed" :key="feedItem._id" :feedItem="feedItem" />
    </div>
    <div class="forum-more">
      <br />
      <br />
      <h4>
        <router-link
          to="/forum"
          exact
        >
          Check out the Forum
        </router-link>
      </h4>
    </div>
  </div>
</template>

<script>
import FeedItemWrapper from '@/components/feed/FeedItemWrapper'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'feed-view',

  components: {
    FeedItemWrapper
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
.forum-more
  padding-left 60px
</style>
