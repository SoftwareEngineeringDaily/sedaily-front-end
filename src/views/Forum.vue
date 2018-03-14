<template>
  <div>
    <h1> Forum </h1>
    <div class="forum-threads">
      <forum-thread-summary v-for="forumThread in forumThreads" :key="forumThread._id" :thread="forumThread"/>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ForumThreadSummary from '@/components/ForumThreadSummary'
export default {
  name: 'forum',
  components: {
    ForumThreadSummary
  },
  data () {
    return {
      loading: true
    }
  },

  beforeMount () {
    return this.fetchForumThreads()
      .then(() => {
        this.loading = false
      })
      .catch((error) => {
        console.log('error fetching threads', error)
      })
  },

  methods: {
    ...mapActions(['fetchForumThreads'])
  },
  computed: {
    ...mapState({
      forumThreads (state) {
        return state.forumThreads
      }
    })
  }

}

</script>

<style scoped lang="stylus">
</style>
