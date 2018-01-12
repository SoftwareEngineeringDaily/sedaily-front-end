<template>
  <div class='comment'>
    <span class='content'>
      <div>
        <voting-arrows
          :upvoteHandler="upvoteHandler"
          :upvoted="comment.upvoted"
          :score="comment.score">
        </voting-arrows>
        <img :src='avatar(comment)' class='avatar'/>
        {{username(comment)}}  <span class='comment-date'> {{date(comment)}} </span>
      </div>
      <div v-if='!comment.deleted' class='comment-content'>
        {{comment.content}}
      </div>
      <div v-else>
        <i>Comment has been deleted</i>
      </div>
      <div class='delete' v-if='this.isMyComment && !comment.deleted' @click='remove'>
        Delete
      </div>
    </span>
    <hr />
  </div>
</template>

<script>
/* @flow */

import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import VotingArrows from 'components/VotingArrows.vue'

export default {
  name: 'comment-view',
  components: { VotingArrows },
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
    username (comment: {content: string, dateCreated: string, author: {name: string} }) {
      if (comment.author) {
        return comment.author.name
      } else {
        // Means we just made this comment
        return this.me.name
      }
    },

    avatar (comment: {content: string, dateCreated: string, author: {name: string, avatarUrl: string} }) {
      // If we just made this comment, no author is defined:
      const author = comment.author ? comment.author : this.me
      return author.avatarUrl == null ? this.placeholderAvatar : author.avatarUrl
    },

    date (comment: {content: string, dateCreated: string, author: {name: string} }) {
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

.avatar
  width 50px

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

.profile-img
  width 80px
  height 80px

.content
  margin-left 20px
</style>
