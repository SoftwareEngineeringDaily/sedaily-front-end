<template>
  <div class="topicpage-history">
    <div class="topicpage-history-event" v-for="event in pageHistory" :key="event._id">
      <div class="time">{{dateFormat(event.dateCreated)}}</div>
      <avatar width="30px" height="30px" :user="event.user" />
      <div class="name">{{event.user.name}}</div>
      <div class="event">{{getHistoryEvent(event)}}</div>
    </div>
    <button v-if="canLoadMore" class="load-more" @click="loadMore()">Load more</button>
  </div>
</template>

<script>
import moment from 'moment'
import Avatar from '@/components/Avatar'

export default {
  name: 'topic-page-activities',
  components: {
    Avatar,
  },
  props: {
    history: {
      type: Array
    }
  },
  data () {
    return {
      perPage: 8,
      total: 8
    }
  },
  computed: {
    pageHistory () {
      return this.history.slice(0, this.total)
    },

    canLoadMore () {
      return this.history.length > this.pageHistory.length
    }
  },
  methods: {
    loadMore () {
      this.total += this.perPage
    },

    dateFormat (date) {
      if (moment().isSame(date, 'day')) return moment(date).format('[Today, ]HH[h]mm')
      return moment(date).format('MMMM Do, YYYY')
    },

    getHistoryEvent (history) {
      let event = '-'
      switch(history.event) {
        case 'edit': event = 'Edited content'; break
        case 'editLogo': event = 'Updated logo'; break
        case 'publish': event = 'Published'; break
        case 'unpublish': event = 'Unpublished'; break
        case 'selfAssign': event = 'Self assigned as maintainer'; break
        case 'revisionRecover': event = 'Recovered version'; break
      }
      return history.revision ? `${event} (v${history.revision})` : event
    },
  }
}
</script>

<style scoped lang="stylus">
@import '~@/css/variables'

.topicpage-history
  margin 30px 0

  &-event
    display flex
    margin-bottom 10px
    line-height 30px
    background-color #f8f9fa
    padding 10px

    .time
      width 120px
      color #6c757d
      font-size 12px

    .event
      flex 2

    .name
      margin-left 10px
      flex 1
      color #6c757d
  
  .load-more
    width 100%
    background-color transparent
    outline 0
    color #666

    &:hover
      background-color #f4f4f4
      border-color #f4f4f4
</style>
