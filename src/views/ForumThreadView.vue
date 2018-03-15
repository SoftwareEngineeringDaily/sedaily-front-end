<template>
  <div>
    <div v-if="forumThread">
      Forum Thread Deatails:

      {{forumThread.title}}
      <p>
        {{forumThread.content}}
      </p>

      <div class="row">
        <div class="col-md-12">
          <comment-compose v-if="isLoggedIn"></comment-compose>
        </div>
      </div>
      <br />
      <br />
      <div class="row">
        <div class="col-md-12">
          <h3 class='section-title'> Comments </h3>
          <comments-list :comments='comments'></comments-list>
        </div>

            </div>
    </div>
  </div>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import CommentsList from '@/components/CommentsList.vue'
import CommentCompose from '@/components/CommentCompose.vue'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'forum-thread-view',
  components: { Spinner, CommentsList, CommentCompose },
  data () {
    return {
      loading: true
    }
  },

  computed: {
    ...mapGetters(['isLoggedIn']),
    forumThread () {
      return this.$store.state.forumThreads[this.$route.params.id]
    },
    comments () {
      return this.entityComments[this.$route.params.id] || []
    },
    ...mapState({
      entityId (state) {
        return state.route.params.id
      },
      threadId (state) {
        return state.route.params.id
      },
      entityComments (state) {
        return state.entityComments
      }
    })
  },

  methods: {
    ...mapActions(['fetchForumThread', 'commentsFetch'])
  },
  beforeMount () {
    this.fetchForumThread({
      id: this.entityId
    })

    // Fetch comments
    this.commentsFetch({
      entityId: this.entityId
    })
  }
}
</script>
