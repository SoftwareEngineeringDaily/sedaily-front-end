<template>
  <div class='forum-summary-container row'>
    <span class="profile-avatar">
      <div v-if="podcastEpisode">
        <img
        class='podcast-icon'
        src="@/assets/icons/podcast.png"
        />
      </div>
      <profile-label v-else
        :userData="forumThreadLocal.author"
        :showName="false" />
    </span>

    <span class='votes-container'>
      <voting-arrows
        :upvoteHandler="upvoteHandler"
        :upvoted="forumThreadLocal.upvoted"
        :score="forumThreadLocal.score">
      </voting-arrows>
    </span>

    <span class="content-holder">
      <span class='forum-summary-title'>
        <router-link :to="'/forum/' + forumThreadLocal._id"> {{forumThreadLocal.title}} </router-link>
      </span>
      <div class='forum-thread-misc'>
        Posted by
        <span>
          <router-link :to="'/profile/' + forumThreadLocal.author._id">
            {{forumThreadLocal.author.name}}
          </router-link>
        </span>
        <div class="bullet-point">&#9679;</div>
        <span class='misc-detail'>{{lastAcitivityDate}}</span>
        <div class="bullet-point">&#9679;</div>

        <span class='comments-count misc-detail'>
          <router-link :to="'/forum/' + forumThreadLocal._id" class="comments-count-link">
            {{forumThreadLocal.commentsCount}} comments
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
    return {
      forumThreadLocal: this.forumThread
    }
  },
  methods: {
    ...mapActions(['forumThreadLike']),
    upvoteHandler () {
      this.forumThreadLike({
        id: this.forumThread._id
      }).then(({ data }) => {
        const forumThread = data.entity
        this.forumThreadLocal = forumThread
      })
    }
  },
  computed: {
    podcastEpisode () {
      if (this.forumThread && this.forumThread.podcastEpisode) {
        return this.forumThread.podcastEpisode
      } else {
        return false
      }
    },
    lastAcitivityDate () {
      if (this.forumThread) {
        return moment(this.forumThread.dateLastAcitiy)
          .startOf('hour').fromNow()
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import '../css/variables'

.forum-summary-container
  font-family inherit
  .forum-summary-title a
    color #000
    font-weight 300
    font-size 1.0rem
    &:visited
      color #a9a9a9
  .forum-summary-title a:hover
    text-decoration none
    color primary-color

.forum-thread-misc
  font-size 0.8rem
  color darkgrey
  margin-top 3px
  margin-bottom 1rem

.forum-thread-misc a
  text-decoration none

.content-holder
  max-width 83%
.misc-detail a
  color #a9a9a9
  &:hover
    color idle-foreground
.bullet-point
  display inline-flex
  font-size 0.65em
  min-height 20px
  margin-left 5px
  margin-right 5px
.profile-avatar
  padding-left 20px
  padding-top 12px

.votes-container
  padding-top 3px

.podcast-icon
  max-width 30px
.podcast-icon:hover
  opacity 0.5



@media (min-width: 576px)
  .votes-container
    padding 0px 10px
    padding-left 15px
@media (max-width: 576px)
  .content-holder
    max-width 63%


</style>
