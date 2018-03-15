<template>
  <div>
    <div v-if="forumThread">
      Forum Thread Deatails:

      {{forumThread.title}}
      <p>
        {{forumThread.content}}
      </p>
  </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      loading: true
    }
  },

  computed: {
    forumThread () {
      return this.$store.state.forumThreads[this.$route.params.id]
    },

    ...mapState({
      threadId (state) {
        return state.route.params.id
      }
    })
  },

  methods: {
    ...mapActions(['fetchForumThread'])
  },
  beforeMount () {
    this.fetchForumThread({
      id: this.threadId
    })
  }
}
</script>
