<template>
  <div class='forum-summary-container row'>
    <span class="profile-avatar">
      <profile-label
        :userData="forumThread.author"
        :showName="false" />
    </span>

    <span class='votes-container'>
      <voting-arrows
        :upvoteHandler="upvoteHandler"
        :upvoted="forumThread.upvoted"
        :score="forumThread.score">
      </voting-arrows>
    </span>

    <span class="content-holder">
      <span class='forum-summary-title'>
        <router-link :to="'/forum/' + forumThread._id"> {{forumThread.title}} </router-link>
      </span>
      <div class='forum-thread-misc'>
        Posted by
        <span class="author">
          <router-link :to="'/profile/' + forumThread.author._id">
            {{forumThread.author.name}}
          </router-link>
        </span>
        <div class="bullet-point">&#9679;</div>
        <span class='misc-detail'><span class="date">{{creationDate}}</span></span>
        <div class="bullet-point">&#9679;</div>

        <span class='comments-count misc-detail'>
          <router-link :to="'/forum/' + forumThread._id" class="comments-count-link">
            <span class="fa fa-comments" aria-hidden="true"></span> {{forumThread.commentsCount}} comments
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
@import '../css/variables'

.forum-summary-container
  font-family Roboto
  .forum-summary-title a
    color primary-color
    font-weight bold
    font-size 1.0rem
  .forum-summary-title a:hover
    text-decoration none
    color #5D4AB2
  .forum-summary-title a:visited
    color #5D4AB2

.content-holder
  max-width 63%
.content-holder a:hover
  transition color .15s ease
  text-decoration none
  color #000
  opacity .7

.forum-thread-misc
  font-size 0.8rem
  color darkgrey
  margin-top 3px
  margin-bottom 1rem
.forum-thread-misc a
  opacity .5

.author
  font-weight bold
  color #a9a9a9a
.comments-count-link
  font-weight bold
  color #666
.comments-count-link a:hover
  color primary-color
.bullet-point
  display inline-flex
  font-size 0.65em
  min-height 20px
  margin-left 5px
  margin-right 5px
.profile-avatar
  padding-left 20px
  padding-top 12px
.misc-detail .date
  font-style italic

.votes-container
  padding-top 3px
.votes-container
  color primary-color

@media (min-width: 576px)
  .votes-container
    padding 0px 10px
    padding-left 15px


</style>
