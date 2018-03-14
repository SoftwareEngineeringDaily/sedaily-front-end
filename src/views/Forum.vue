<template>
  <div>
    <h1> Forum </h1>
    <div class="forum-threads">
      <forum-thread-summary />
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
