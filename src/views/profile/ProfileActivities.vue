<template>
  <div class="display-activities col-md-6">
    <template v-if="activities">
      <div class="activity-header">Last {{activityDays}} days of activities</div>
      <div v-for="(items, date) in activities" class="activity-group" :key="date">
        <div class="activity-group-date">{{groupDateFormat(date)}}</div>
        <div class="activity-group-content">
          <div v-for="(activity, index) in items" :key="index" class="activity-container">
            <div class="time">{{timeFormat(activity.dateCreated)}}</div>
            <div class="content">
              <div v-if="isComment(activity)">Added a new comment</div>
              <div v-if="isHighlight(activity)">Highlighted and commented</div>
              <div v-if="isRelatedLink(activity)">Added a related link</div>
              <div v-if="isRelatedEpisode(activity)">Added a related episode</div>
              in <a :href="activity.post.url">{{activity.post.title}}</a>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'profile-activities',
  props: {
    activities: {
      type: Object
    },
    activityDays: {
      type: Number
    },
  },
  methods: {
    isComment (act) {
      return act.activityType === 'comment' && !act.highlight
    },
    isHighlight (act) {
      return act.activityType === 'comment' && act.highlight
    },
    isRelatedLink (act) {
      return act.activityType === 'relatedLink' && act.type === 'link'
    },
    isRelatedEpisode (act) {
      return act.activityType === 'relatedLink' && act.type === 'episode'
    },
    groupDateFormat (date) {
      const day = moment(date);
      if (day.format('YYYYMMDD') === moment().format('YYYYMMDD')) return 'Today'
      return moment(date).format('MMMM Do, YYYY')
    },
    timeFormat (date) {
      return moment(date).format('HH[h]mm[m]')
    }
  }
}
</script>

<style lang="stylus" scoped>
  .display-activities
    margin-left auto
    margin-right auto
    padding 10px

  .activity-header
    font-size 20px
    text-align center
    padding 20px 0
    text-transform uppercase
    font-weight 600

  .activity-group 
    display flex
    margin 10px 0
  
  .activity-group-date
    width 170px
    font-weight 700
    text-align right
  
  .activity-group-content
    flex 1

    .activity-container
      display flex
      margin-bottom 15px

      .time
        width 100px
        text-align center
        color #6c757d

      .content
        flex 1

        a
          text-decoration none
          color #6c757d
          text-decoration underline

</style>
