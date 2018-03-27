<template>
  <div>
    <div v-if="forumThread">
      <forum-thread-body
      :title="forumThread.title"
      :content="forumThread.content"></forum-thread-body>
      <div class='forum-thread-misc'>
        Posted by <span>{{forumThread.author.name}}</span>
        <div class="bullet-point">&#9679;</div>
        <span class='misc-detail'>{{creationDate}}</span>
        <div class="bullet-point">&#9679;</div>
        <span class='comments-count misc-detail'> {{forumThread.commentsCount}} comments</span>
      </div>

      <div class="row">
        <div class="col-md-12">
          <comment-compose v-if="isLoggedIn" :rootEntityType='"forumthread"'></comment-compose>
        </div>
      </div>
      <br />
      <br />
      <div class="row">
        <div class="col-md-12">
          <h3 class='section-title'> Comments </h3>
          <comments-list :comments='comments' :rootEntityType='"forumthread"'></comments-list>
        </div>

            </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Spinner from '@/components/Spinner.vue'
import CommentsList from '@/components/CommentsList.vue'
import CommentCompose from '@/components/CommentCompose.vue'
import ForumThreadBody from '@/components/ForumThreadBody.vue'
import { parseIdsIntoComments } from '@/utils/comment.utils.js'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'forum-thread-view',
  components: { Spinner, CommentsList, CommentCompose, ForumThreadBody },
  data () {
    return {
      loading: true
    }
  },

  computed: {
    ...mapGetters(['isLoggedIn']),
    creationDate () {
      if (this.forumThread) {
        return moment(this.forumThread.dateCreated)
          .startOf('hour').fromNow()
      }
    },
    forumThread () {
      return this.$store.state.forumThreads[this.$route.params.id]
    },
    comments () {
      const parentCommentIds = this.entityComments[this.$route.params.id] || []
      return parseIdsIntoComments({
        entityParentCommentIds: parentCommentIds,
        commentsMap: this.commentsMap
      })
    },
    ...mapState({
      entityId (state) {
        return state.route.params.id
      },
      threadId (state) {
        return state.route.params.id
      },
      commentsMap (state) {
        return state.comments
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

<style lang="stylus" scoped>
@import '../css/variables'


.forum-thread-misc
  font-size 0.8rem
  color darkgrey
  margin-bottom 2rem

.bullet-point
  display inline-flex
  font-size 0.65em
  min-height 20px
  margin-left 5px
  margin-right 5px

</style>
