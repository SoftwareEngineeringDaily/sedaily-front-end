<template>
  <div>
    <div v-for="comment in comments">
    </div>
  </div>
</template>

<script>
/* @flow */
import moment from 'moment'
import { mapState } from 'vuex'
export default {
  name: 'comments-list',
  props: ['comments'],
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
