<template>
  <div>
    <div class="spinner-holder">
      <spinner :show="isLoading"></spinner>
    </div>

    <div v-if="isDeleting">
      Are you sure you want to delete your thread?
      <button @click="confirmDelete"> Confirm Delete </button>
      <button @click="cancelDelete"> Cancel </button>
    </div>
    <div v-if="!isDeleting">
      <div v-if="forumThread">
        <forum-thread-body
          :title="forumThread.title"
          :content="forumThread.content" />

        <div v-if='lastEdited' class='last-edited'>
          Last Edited: {{lastEdited}}
        </div>
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
          <span class='delete simple-link' v-if='this.isMyThread' @click='remove'>
            Delete
          </span>

          <div class="bullet-point" v-if='this.isMyThread'>&#9679;</div>
          <span class='edit simple-link' v-if='this.isMyThread' @click='edit'>
            Edit
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
      isLoadingComments: false,
      isDeleting: false
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn','metaTag']),
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
    lastEdited () {
      if (this.forumThread && this.forumThread.dateLastEdited) {
        return moment(this.forumThread.dateLastEdited)
          .startOf('hour').fromNow()
      } else {
        return false
      }
    },
    forumThreadContentSummary() {
      const maxLength = 400;
      if (this.forumThread.content.length > maxLength) {
        return this.forumThread.content.substr(0, maxLength-3) + '...'
      }
      return this.forumThread.content
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
      this.isDeleting =  true
    },
    cancelDelete () {
      this.isDeleting = false
    },
    confirmDelete () {
      this.forumThreadDelete( {
        id: this.threadId
      }).then(() => {
        this.$router.replace('/forum')
      })
    },
    edit () {
        this.$router.replace(`/forum/edit-thread/${this.threadId}`)
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
  },
  metaInfo() {
    // wait for forumThread before updating meta
    if (!this.forumThread) {
      return {}
    }
    return {
      meta: [
        this.metaTag('og:title', this.forumThread.title),
        this.metaTag('og:url', location.href),
        this.metaTag('og:description', this.forumThreadContentSummary)
      ]
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../css/variables'
.simple-link
  cursor pointer

.last-edited
  padding: 5px 10px;
  background: #ffffed;
  border: 1px solid #efeccd;
  width: 70%;
  border-radius: 14px;
  font-family: Roboto-Italic;
  margin-bottom: 20px;

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
