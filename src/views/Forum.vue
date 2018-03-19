<template>
  <div>
    <h1 class='col-md-12'> Forum </h1>
    <br />
    <div class='col-md-7'>
    <forum-thread-compose v-if="isLoggedIn"></forum-thread-compose>
    </div>
    <div class="forum-threads col-md-12">
      <forum-thread-summary v-for="forumThread in forumThreads" :key="forumThread._id" :forumThread="forumThread"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import ForumThreadSummary from '@/components/ForumThreadSummary'
import ForumThreadCompose from '@/components/ForumThreadCompose'
export default {
  name: 'forum',
  components: {
    ForumThreadSummary,
    ForumThreadCompose
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
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      forumThreads (state) {
        return state.forumThreadsList
      }
    })
  }
}

</script>

<style scoped lang="stylus">
.forum-threads
  margin-top 30px
</style>
