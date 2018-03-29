<template>
  <div class='container'>
    <div class="row">
      <div class="col-md-1">
        <voting-arrows
        :upvoteHandler="upvoteHandler"
        :upvoted="comment.upvoted"
        :score="comment.score"></voting-arrows>
      </div>

      <div class="col-md-11">
        <span v-if='!comment.deleted' class='comment-content'>
          {{comment.content}}
        </span>
        <span v-else>
          <i>Comment has been deleted</i>
        </span>
      </div>
    </div>

    <div class='row'>
      <div class='col-md-8 offset-md-1'>
        <profile-label :userData="user(comment)">
        </profile-label>
        <span class='comment-date'> {{date(comment)}} </span>

        <span class='delete' v-if='this.isMyComment && !comment.deleted' @click='remove'>
          Delete
        </span>

      </div>
    </div>
    <div class='row' v-if="allowsReplies">
      <comment-reply v-if="isLoggedIn"
      :isReply='true' :parentComment='comment' :rootEntityType='rootEntityType'></comment-reply>

    </div>
  </div>
</template>

<script>
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
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      isRootLevelComment () {
        return !this.comment.parentComment
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
        return moment(comment.dateCreated).format('LL')
      } else {
        return 'Now'
      }
    }
  }
}
</script>

<style scoped lang="stylus">


.comment-date
  padding-left 10px
  color #ccc


.delete
  color red
  &:hover
    cursor pointer

</style>
