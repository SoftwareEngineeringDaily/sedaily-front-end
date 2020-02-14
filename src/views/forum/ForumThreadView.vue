<template>
  <div>
    <div class="spinner-holder">
      <spinner :show="isLoading"></spinner>
    </div>

    <div v-if="isDeleting">
      Are you sure you want to delete your thread?
      <br />
      <br />
      <button @click="confirmDelete" class='btn btn-warning'> Confirm Delete </button>
      <button @click="cancelDelete" class='btn btn-link'> Cancel </button>
    </div>
    <div v-if="!isDeleting">
      <div v-if="forumThread">
        <forum-thread-body
          :title="forumThread.title"
          :podcastEpisode="forumThread.podcastEpisode"
          :content="forumThread.content" />

        <last-edited-info :lastEditedTimestamp="lastEdited" />
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
              :entityId="forumThreadId"
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
import LastEditedInfo from '@/components/LastEditedInfo.vue'
import { parseIdsIntoComments } from '@/utils/comment.utils.js'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'forum-thread-view',
  components: {
    Spinner,
    CommentsList,
    CommentCompose,
    LastEditedInfo,
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
          .startOf('second').fromNow()
      }
    },
    isMyThread () {
      if (this.forumThread) {
        /*
        if (this.me.isAdmin) {
          return true
        }
        */
        return this.me._id === this.forumThread.author._id
      } else {
        return false
      }
    },
    forumThreadId () {
      return this.$route.params.id
    },
    lastEdited () {
      return this.forumThread.dateLastEdited
    },
    comments () {
      const parentCommentIds = this.entityComments[this.$route.params.id] || []
      return parseIdsIntoComments({
        entityParentCommentIds: parentCommentIds,
        commentsMap: this.commentsMap
      })
    },
    metaDescription() {
      const maxLength = 400;
      const { forumThread: { content: description }} = this
      if (description.length > maxLength) {
        return description.substr(0, maxLength-3) + '...'
      }
      return description
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
    const title = `${this.forumThread.title} | Software Daily`
    const { metaDescription} = this
    return {
      title,
      meta: [
        this.metaTag('og:title', title),
        this.metaTag('og:url', location.href),
        this.metaTag('description', metaDescription),
        this.metaTag('og:description', metaDescription)
      ]
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../css/variables'
.simple-link
  cursor pointer
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
