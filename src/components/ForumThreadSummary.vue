<template>
  <div class='forum-summary-container row'>
    <span class="col-sm-1 profile-avatar">
      <profile-label
        :userData="forumThread.author"
        :showName="false" />
    </span>

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
      <div class='forum-thread-misc'>
        Posted by <span>{{forumThread.author.name}}</span>
        <div class="bullet-point">&#9679;</div>
        <span class='misc-detail'>{{creationDate}}</span>
        <div class="bullet-point">&#9679;</div>

        <span class='comments-count misc-detail'>
          <router-link :to="'/forum/' + forumThread._id" class="comments-count-link">
            {{forumThread.commentsCount}} comments
          </router-link>
        </span>
      </div>
    </span>
</div>
</template>

<script>
import moment from 'moment'
import VotingArrows from 'components/VotingArrows.vue'
import ProfileLabel from 'components/ProfileLabel.vue'
import { mapActions } from 'vuex'

export default {
  name: 'ForumThreadSummary',
  components: {
    ProfileLabel,
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
    upvoteHandler () {
      this.forumThreadLike({
        id: this.forumThread._id
      })
    }
  },
  computed: {
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
  .forum-summary-title a
    font-weight 300
    font-size 1.0rem

.forum-thread-misc
  font-size 0.8rem
  color darkgrey
  margin-bottom 1rem

.comments-count-link
  color #a9a9a9
.bullet-point
  display inline-flex
  font-size 0.65em
  min-height 20px
  margin-left 5px
  margin-right 5px
.profile-avatar
  padding-left 50px
  padding-top 12px
</style>
