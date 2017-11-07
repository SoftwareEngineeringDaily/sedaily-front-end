<template>
  <div class='comment'>
    <span class='content'>
      <div>

        <div class='voting' style='display:inline-block; height: 100%;'>
          <span class="score">
            <span class='arrow' v-bind:class="{ active: comment.upvoted }"
            style='margin-left: 1px;' @click='upvoteHandler'>▲</span>
            <br>
            {{ comment.score || 0}}
          </span>
        </div>

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
    upvoteHandler () {
    },

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

<style scoped lang="stylus">


.arrow
  color #888
  &:hover
    cursor pointer
    color #ff6600

  &.active
    color #ff6600 !important
    &:hover
      cursor pointer
      color #888


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
