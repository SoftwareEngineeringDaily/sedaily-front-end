<template>
  <div>
    <div class="spinner-holder">
      <spinner :show="isLoading"></spinner>
    </div>
    <div v-if="forumThread">
      <forum-thread-body
        :title="forumThread.title"
        :content="forumThread.content" />

      <div class='forum-thread-misc'>
        Posted by
        <span>
          <router-link :to="'/profile/' + forumThread.author._id">
            {{forumThread.author.name}}
          </router-link>
        </span>
        <div class="bullet-point">&#9679;</div>
        <span class='misc-detail'>{{creationDate}}</span>
        <div class="bullet-point">&#9679;</div>
        <span class='comments-count misc-detail'> {{forumThread.commentsCount}} comments</span>

        <div class="bullet-point" v-if='this.isMyThread'>&#9679;</div>
        <span class='delete' v-if='this.isMyThread' @click='remove'>
          Delete
        </span>

      </div>

      <div class="row">
        <div class="col-md-9">
          <comment-compose
            v-if="isLoggedIn"
            :rootEntityType='"forumthread"' />
        </div>
      </div>

      <br>
      <br>

      <div class="row">
        <div class="col-md-12">
          <comments-list
            :comments='comments'
            :rootEntityType='"forumthread"'
            :loading="isLoadingComments" />
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
  components: {
    Spinner,
    CommentsList,
    CommentCompose,
    ForumThreadBody
  },
  data () {
    return {
      isLoading: false,
      isLoadingComments: false
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
    isMyThread () {
      if (this.forumThread) {
        if (this.me.isAdmin) {
          return true
        }
        return this.me._id === this.forumThread.author._id
      } else {
        return false
      }
    },
    comments () {
      const parentCommentIds = this.entityComments[this.$route.params.id] || []
      return parseIdsIntoComments({
        entityParentCommentIds: parentCommentIds,
        commentsMap: this.commentsMap
      })
    },
    ...mapState({
      me (state) {
        return state.me
      },
      entityId (state) {
        return state.route.params.id
      },
      threadId (state) {
        return state.route.params.id
      },
      forumThread (state) {
        return state.forumThreads[state.route.params.id]
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
    ...mapActions([
      'fetchForumThread',
      'commentsFetch',
      'forumThreadDelete'
    ]),
    remove () {
      this.forumThreadDelete( {
        id: this.threadId
      }).then(() => {
        this.$router.replace('/forum')
      })
    },
    refreshThread () {
      this.isLoading = true

      this.fetchForumThread({
        id: this.entityId
      })
        .finally(() => {
          this.isLoading = false
        })

      this.isLoadingComments = true
      // Fetch comments
      this.commentsFetch({
        entityId: this.entityId
      })
        .finally(() => {
          this.isLoadingComments = false
        })
    }
  },
  beforeMount () {
    this.refreshThread()
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
