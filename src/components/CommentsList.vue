<template>
  <div>
    <div v-for="comment in comments">
      <div class='comment'>
        <img class='profile-img' src='http://lorempixel.com/80/80/'>
        <span class='content'>
          <div>
            {{username(comment)}}  <span class='comment-date'> {{date(comment)}} </span>
          </div>
          {{comment.content}}
        </span>
      </div>
      <hr />
    </div>
  </div>
</template>

<script>
/* @flow */
import moment from 'moment'
export default {
  name: 'comments-list',
  props: ['comments'],
  methods: {
    username (comment: {content: string, dateCreated: string, author: {username: string} }) {
      if (comment.author && comment.author.username) {
        return comment.author.username
      } else {
        return 'You'
      }
    },
    date (comment: {content: string, dateCreated: string, author: {username: string} }) {
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
