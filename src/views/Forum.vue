<template>
  <div class='forum'>
    <div
      class="row"
      v-if="isLoggedIn">
      <div class="col-sm-10 ">
        <button
          @click="$router.push('/new-thread')"
          class="create-post">
          <i class="material-icons create-post-icon">border_color</i>
          <span class="create-post-text">Create New Post</span>
        </button>
      </div>
    </div>
    <spinner v-if="loading" :show="loading"></spinner>
    <div class="row" v-else>
      <div class="forum-threads col-sm-12">
        <forum-thread-summary
          v-for="forumThread in forumThreads"
          :key="forumThread._id"
          :forumThread="forumThread"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Spinner from '@/components/Spinner.vue'
import ForumThreadSummary from '@/components/ForumThreadSummary'

export default {
  name: 'forum',
  components: {
    ForumThreadSummary,
    Spinner
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
        if (!state.forumThreadIdsList) return []
        const threads = state.forumThreadIdsList.map((id) => state.forumThreads[id])
        return threads
      }
    })
  }
}

</script>

<style scoped lang="stylus">
@import '../css/variables'

.create-post
  padding 10px 20px
  border 2px solid primary-color
  border-radius 5px
  background-color white
  color primary-color
  cursor pointer
  display flex
  align-items center
  justify-content center

.create-post-text
  align-self center
  margin-left 5px
  height 100%
  font-weight bold
  font-size 0.9em

.forum-threads
  margin-top 40px



@media (min-width: 768px)
  .forum
    margin-left 30px


</style>
