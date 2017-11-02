<template>
  <div class='comment'>
    <span class='content'>
      <div>
        {{username(comment)}}  <span class='comment-date'> {{date(comment)}} </span>
      </div>
      {{comment.content}}
    </span>
    <hr />
  </div>
</template>

<script>
/* @flow */
import moment from 'moment'
import { mapState } from 'vuex'
export default {
  name: 'comment-view',
  props: ['comment'],
  computed: {
    ...mapState({
      isRootLevelComment () {
        return !this.comment.parentComment
      },
      me (state) {
        return state.me
      }
    })
  },
  methods: {
    username (comment: {content: string, dateCreated: string, author: {name: string} }) {
      if (comment.author) {
        return comment.author.name
      } else {
        // Means we just made this comment
        return this.me.name
      }
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

<style scoped>
.comment-date {
  padding-left: 10px;
  color: #ccc;
}
.comment {
  display: flex;
}
.profile-img {
  width: 80px;
  height: 80px;
}
.content {
  margin-left: 20px;
}
</style>
