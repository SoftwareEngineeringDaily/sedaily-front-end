<template>
  <div class="display-activities" v-if="activities">
    <activity-header>Last {{activityDays}} Days of Activities</activity-header>
    <div v-for="(items, date) in activities" class="activity-group" :key="date">
      <div class="activity-group-date">{{groupDateFormat(date)}}</div>
      <div class="activity-group-content">
        <div v-for="(activity, index) in items" :key="index" class="activity-container">

          <div v-if="activity.entity" class="content">
            <p class="activity-label text-ellipsis">
              Added a {{activityType(activity)}} in <router-link :to="activity.entity.url">{{activity.entity.title}}</router-link>
            </p>
            <div v-if="activity.activityType === 'comment'" class="comment comment-item">
              <CommentContent :comment="comment(activity)" />
            </div>
            <div v-if="activity.activityType === 'relatedLink'" class="comment comment-item">
              {{activity.title}} <a :href="activity.url">({{activity.url}})</a>
            </div>
            <div v-if="activity.activityType === 'answer'" class="comment comment-item">
              {{activity.content.slice(0, 240)}}{{activity.content.length > 240 ? '...' : ''}}
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import marked from 'marked'
import ProfileLabel from '@/components/profile/ProfileLabel'
import ActivityHeader from '@/components/profile/ActivityHeader'
import CommentContent from '@/components/comment/CommentContent'

export default {
  name: 'profile-activities',

  props: {
    activities: {
      type: Object
    },
    activityDays: {
      type: Number
    },
    userData: {
      type: Object,
      default: function () {
        return {
          _id: '',
          username: '',
          avatarUrl: '',
          bio: '',
          name: '',
          website: ''
        }
      }
    },
  },

  components: {
    ProfileLabel,
    ActivityHeader,
    CommentContent,
  },

  methods: {
    activityType (act) {
      if (act.activityType === 'comment' && !act.highlight) {
        return 'new comment'
      }

      if (act.activityType === 'comment' && act.highlight) {
        return 'highlight and comment'
      }

      if (act.activityType === 'relatedLink' && act.type === 'link') {
        return 'related link'
      }

      if (act.activityType === 'relatedLink' && act.type === 'episode') {
        return 'related episode'
      }

      if (act.activityType === 'answer') {
        return 'new answer'
      }
    },

    groupDateFormat (dateCreated) {
      const isToday = moment(dateCreated).isSame(moment(), 'day')
      const duration = moment(dateCreated).startOf('second').fromNow()
      const date = moment(dateCreated).format('MMMM Do, YYYY')

      return `${isToday ? 'Today' : date}` // | ${duration}`
    },

    comment (activity) {
      return {
        ...activity,
        author: this.userData,
      }
    },
  }
}
</script>

<style lang="stylus" scoped>
.display-activities
  margin-left auto
  margin-right auto
  padding 10px

.activity-label
  margin-bottom 0.5rem

.activity-group
  margin 10px 0 40px

.activity-group-date
  position sticky
  z-index 1
  top 83px
  padding 0.5rem 0
  font-weight 700
  background-color #fff

.activity-group-content
  flex 1

.activity-container
  margin-bottom 15px

  .time
    color #6c757d

.content
  flex 1

  a
    text-decoration none
    color #6c757d
    text-decoration underline

.comment
  margin-bottom 18px
  padding-bottom 8px

  >>> a
    word-break break-all

  >>> p
    margin-bottom 0

.comment-item
  position relative
  margin-bottom 20px
  padding 10px 15px
  background-color #f8f9fa

  &.text-center
    text-align center

.text-ellipsis
  overflow hidden
  white-space nowrap
  text-overflow ellipsis

@media (max-width 660px)
  .activity-group-date
    top 122px

</style>
