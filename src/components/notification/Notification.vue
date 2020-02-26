<template>
  <span class="active-without-border">
    <div>
      <b-dropdown class="notification" right variant="link" size="lg" no-caret>
        <template slot="button-content">
          <BellIcon class="notification-icon"/>
          <div class="badge" v-if="unread">{{unread}}</div>
        </template>
        <div v-if="!this.lastShowNotifications.length" class="no-data">
          You have no notifications
        </div>
        <b-dropdown-item 
        v-for="item in this.lastShowNotifications" 
        :key="item._id" 
        active-class=""
        :class="[item.read ? 'read' : 'unread']"
        :to="item.notification.data.url">
          <div class="date">{{formatDate(item.dateCreated)}}</div>
          <div class="title">{{item.notification.title}}</div>
          <div class="body">{{item.notification.body}}</div>
        </b-dropdown-item>        
      </b-dropdown>
    </div>
  </span>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import BellIcon from './BellIcon'

export default {
  name: "notification",
  data: () => ({
    lastShowNotifications: [],
    shown: false
  }),
  components: { 
    BellIcon 
  },
  mounted() {
    this.$root.$on('bv::dropdown::show', bvEvent => {
      this.lastShowNotifications = this.notifications
      if (this.unread) this.markRead()
      this.shown = true
    })
    this.$root.$on('bv::dropdown::hide', bvEvent => {
      this.shown = false
    })
  },
  props: {},
  computed: {
    ...mapState(['notifications']),
    unread () {
      const unread = this.notifications.filter(n => !n.read);
      return unread.length;
    }
  },
  watch :{
    notifications (newNotifications, oldNotifications) {
      if (this.shown) {
        const newOnes = newNotifications.filter((item) => {
          return !this.lastShowNotifications.find(old => old._id === item._id)
        })
        if (newOnes.length) {
          this.lastShowNotifications = newOnes.concat(this.lastShowNotifications)
          this.markRead()
        }
      }
    }
  },
  methods: {
    markRead () {
      setTimeout(() => {
        this.$nextTick(() => { this.$store.dispatch('notification.markread.all') })
      }, 1000);
    },
    formatDate (date) {
      const notificationDate = moment(date)
      if (notificationDate.format('YYYYMMDD') === moment().format('YYYYMMDD')) return notificationDate.format('HH[h]mm[m]')
      return notificationDate.format('MMMM Do, YYYY')
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../css/variables'
  .notification >>> .dropdown-menu 
    max-height 50vh
    overflow auto
  
  .notification-icon 
    height 32px
    width 32px
  
  .badge
    position absolute
    background-color #a591ff
    font-size 12px
    text-decoration none
    color #ffffff
    padding 4px 6px
    z-index 10
  
  .inner .badge
    top 5px
    right 6px
  
  .inner-mobile .badge
    top -3px
    right -11px
  
  .notification >>> .dropdown-menu 
    padding 0

  .notification >>> li:not(:last-child)
    border-bottom 1px solid #c5c5c5

  .notification >>> li a
    border-left 3px solid transparent
    user-select: none;
  
  .notification >>> .dropdown-item:active
    font-weight: inherit;
    background-color #ffffff
    color primary-color

  .notification >>> li.read a
    background-color #f8f9fa

  .notification >>> li.unread a
    background-color #ffffff
    border-left 3px solid #a591ff

  .notification >>> li.read a:hover
    border-left 3px solid #eaecef
  
  .notification >>> .no-data
    text-align center
    padding 20px 0
    width 350px 

  .date 
    font-size 12px
    color #808080
    text-align right

  .title 
    font-size 16px
    font-weight 500
    margin 10px 0
    width 350px
    white-space normal

  .body
    font-size 14px
    width 350px
    white-space normal
    font-style italic 

</style>
