<template>
  <div class="comment">
    <span class="content">
      <div>
        <voting-arrows
          :upvote-handler="upvoteHandler"
          :upvoted="comment.upvoted"
          :score="comment.score" />

        <profile-label :user-data="user(comment)">
          <span class="comment-date"> {{ date(comment) }} </span>
        </profile-label>
      </div>
      <div
        v-if="!comment.deleted"
        class="comment-content">
        {{ comment.content }}
      </div>
      <div v-else>
        <i>Comment has been deleted</i>
      </div>
      <div
        v-if="isMyComment && !comment.deleted"
        class="delete"
        @click="remove">
        Delete
      </div>
    </span>
    <hr>
  </div>
</template>

<script>
/* @flow */

import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import VotingArrows from '~/components/VotingArrows.vue'
import ProfileLabel from '~/components/ProfileLabel.vue'

export default {
  components: { VotingArrows, ProfileLabel },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      isRootLevelComment () {
        return !this.comment.parentComment
      },

      placeholderAvatar (state) {
        return state.placeholderAvatar
      },

      me (state) {
        return state.auth.user
      },

      isMyComment (state) {
        return this.me._id === this.comment.author._id
      }
    })
  },
  methods: {
    ...mapActions(['likeComment', 'removeComment', 'commentsFetch']),
    upvoteHandler () {
      this.likeComment({
        id: this.comment._id,
        parentCommentId: this.comment.parentComment,
        postId: this.comment.post
      })
    },
    remove () {
      this.removeComment({
        id: this.comment._id
      })
        .then(() => {
          this.commentsFetch({
            postId: this.comment.post
          })
        })
        .catch((error) => {
          console.log(error)
          alert('Error deleting :(')
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
.comment-content
  padding 10px
  padding-left 60px

.arrow
  color #888
  &:hover
    cursor pointer
    color #3F58AF

  &.active
    color #3F58AF !important
    &:hover
      cursor pointer
      color #888

.comment-date
  padding-left 10px
  color #ccc

.comment
  display flex

.delete
  color red
  &:hover
    cursor pointer

.content
  margin-left 20px
</style>
