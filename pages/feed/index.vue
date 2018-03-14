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
import uniqBy from 'lodash/uniqBy'
import { mapState } from 'vuex'

export default {
  components: {
    FeedItem
  },  
  computed: {
    ...mapState({
      me ({ auth }) {
        return auth ? auth.user : null
      }
    })
  },
  async asyncData ({ $axios }) {
    const feedResponse = await $axios.get('/feed')
    return {
      feed: uniqBy(feedResponse.data, f => f._id)
    }
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
