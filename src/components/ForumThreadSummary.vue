<template>
  <div class='forum-summary-container row'>

    <span class="col-sm-1">
      <voting-arrows
      :upvoteHandler="upvoteHandler"
      :upvoted="forumThread.upvoted"
      :score="forumThread.score">
    </voting-arrows>
  </span>
    <span class="col-sm-8">
      <div class='forum-summary-title'>
        <router-link :to="'/forum/' + forumThread._id"> {{forumThread.title}} </router-link>
      </div>
      <div class='forum-summary-misc'>
        by <span>{{forumThread.author.name}}</span>
        <span class='misc-detail' >{{creationDate}} </span>
        <span class='comments-count misc-detail'>
          <router-link :to="'/forum/' + forumThread._id"
          class='forum-summary-misc'>
             {{forumThread.commentsCount}} comments
           </router-link>
         </span>
         <span v-if="isMyCreation" class='misc-detail'>
          <span @click='removeMyThread'>Delete</span>
        </span>
      </div>
    </span>
</div>
</template>

<script>
import moment from 'moment'
import VotingArrows from 'components/VotingArrows.vue'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'ForumThreadSummary',
  components: {
    VotingArrows
  },
  props: {
    forumThread: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  methods: {
    ...mapActions(['forumThreadLike']),

    removeMyThread () {
      console.log('remove!!!!!!!')
    },

    upvoteHandler () {
      this.forumThreadLike({
        id: this.forumThread._id
      })
    }
  },
  computed: {
    ...mapState({
      me (state) {
        return state.me
      }
    }),

    isMyCreation () {
      if (!this.me._id) return false
      console.log('forumThread', this.forumThread)
      return this.me._id === this.forumThread.author._id
    },

    creationDate () {
      if (this.forumThread) {
        return moment(this.forumThread.dateCreated)
          .startOf('hour').fromNow()
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.forum-summary-container
  padding 1rem
  .forum-summary-title a
    font-weight 300
    font-size 1.5rem
    color #591f94
.forum-summary-misc
  font-size 1em
  color darkgrey
.misc-detail
  padding-left 1rem
</style>
