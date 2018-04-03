<template>
  <div class='comment-holder'>
    <div class="row ">
      <span class="arrows voting-container">
        <voting-arrows
        :upvoteHandler="upvoteHandler"
        :upvoted="comment.upvoted"
        :score="comment.score"></voting-arrows>
      </span>

      <span class="col-md-8 content-area" v-html="compiledMarkdown">
      </span>
    </div>

    <div class='row misc-detail'>
      <div class=''>
        <profile-label :userData="user(comment)">
        </profile-label>

        <div class="bullet-point">&#9679;</div>

        <span class='comment-date'> {{date(comment)}} </span>

        <div v-if="allowsReplies && isLoggedIn" class="bullet-point">&#9679;</div>

        <span v-if="!isReplying && isLoggedIn">
          <span v-if="allowsReplies" class='link' @click="isReplying=!isReplying">Reply</span>
        </span>
        <span v-if="isReplying && isLoggedIn" class='link' @click="isReplying=!isReplying">Cancel</span>

        <div class="bullet-point" v-if='this.isMyComment && !comment.deleted'>&#9679;</div>

        <span class='delete' v-if='this.isMyComment && !comment.deleted' @click='remove'>
          Delete
        </span>

      </div>
    </div>
    <div class='row' v-if="allowsReplies && isReplying">
      <comment-reply v-if="isLoggedIn"
      :isReply='true' :parentComment='comment' :rootEntityType='rootEntityType'></comment-reply>

    </div>
  </div>
</template>

<script>
import marked from 'marked'
import moment from 'moment'
import { mapState, mapActions, mapGetters } from 'vuex'
import VotingArrows from 'components/VotingArrows.vue'
import ProfileLabel from 'components/ProfileLabel.vue'
import CommentReply from 'components/CommentReply.vue'

export default {
  name: 'comment-view',
  components: { VotingArrows, ProfileLabel, CommentReply },
  props: {
    comment: {
      type: Object,
      required: true
    },
    allowsReplies: {
      type: Boolean,
      default: false
    },
    rootEntityType: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      isReplying: false
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      isRootLevelComment () {
        return !this.comment.parentComment
      },

      compiledMarkdown () {
        marked.setOptions({
          breaks: true
        })
        return marked(this.comment.content)
      },

      placeholderAvatar (state) {
        return state.placeholderAvatar
      },

      me (state) {
        return state.me
      },

      isMyComment (state) {
        return this.me._id === this.comment.author._id
      }
    })
  },
  methods: {
    ...mapActions(['likeComment', 'removeComment', 'commentsFetch']),
    upvoteHandler () {
      console.log('entity::', this.comment.rootEntity, this.comment)
      this.likeComment({
        id: this.comment._id,
        parentCommentId: this.comment.parentComment,
        entityId: this.comment.rootEntity
      })
    },
    remove () {
      this.removeComment({
        id: this.comment._id
      })
        .then(() => {
          this.commentsFetch({
            entityId: this.comment.rootEntity
          })
        })
        .catch((error) => {
          console.log(error)
          this.$toasted.error('Error deleting :(')
        })
    },
    user (comment) {
      if (comment.author) {
        return comment.author
      } else {
        // Means we just made this comment
        return this.me
      }
    },

    date (comment) {
      if (comment.dateCreated) {
        return moment(comment.dateCreated).startOf('hour').fromNow()
      } else {
        return 'Now'
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import '../css/variables'

.content-area {
  /deep/ a {
    color: primary-color;
  }
}

.voting-container
  margin-top 20px
.comment-holder
  margin-bottom -30px
.content-area
  margin-top 20px
  margin-bottom 20px
  word-break break-all
  color #777
  max-width 65%
.misc-detail
  color #9B9B9B
  font-size 14px
  margin-left 45px
.link
  color primary-color
  font-family Roboto-Medium
  cursor pointer
  padding 5px 8px

.comment-date
  padding-left 10px

.delete
  font-family Roboto-Medium
  padding-left 10px
  &:hover
    color #8E0505
    cursor pointer


.bullet-point
  display inline-flex
  font-size 0.65em
  min-height 20px
  margin-left 5px
  margin-right 5px

</style>
