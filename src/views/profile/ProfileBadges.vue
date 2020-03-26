<template>
  <div class="display-badges col-md-6" v-if="badges">
    <activity-header>{{completeCount}} Badges</activity-header>
    <ul class="badges">
      <li
        v-for="badge in badges"
        :key="badge.label"
        :class="{ 'is-complete': badge.completed }"
        class="badge badge-podcast">

        <i class="fa fa-2x" :class="badge.icon" />

        <div class="badge-content">
          <div class="badge-label">{{badge.label}}</div>
          <div class="badge-progress">
            <div
              class="badge-progress-bar"
              :style="{ width: `${badge.percent}%` }" />
          </div>
        </div>

      </li>
    </ul>
  </div>
</template>

<script>
import moment from 'moment'
import keys from 'lodash/keys'
import ActivityHeader from '@/components/profile/ActivityHeader'

export default {
  name: 'profile-badges',

  props: {
    badges: {
      type: Array,
    },
  },

  components: {
    ActivityHeader,
  },

  computed: {
    completeCount () {
      return this.badges.filter(b => b.completed).length
    }
  },
}
</script>

<style lang="stylus" scoped>
.display-badges
  margin-left auto
  margin-right auto
  padding 10px

.badges
  overflow auto
  display flex
  align-items center
  justify-content flex-start
  margin-bottom 0
  padding-left 0
  padding-bottom 1rem

.badge
  display flex
  align-items center
  margin-right 0.6rem
  padding 0.6rem 1rem
  color: #bbbbbb
  font-size 13px
  border 2px solid #bbbbbb
  border-radius 4px

  .fa
    margin-right 0.8rem

  &.is-complete
    color #ffffff
    background-color #77E6B6
    border-color #77E6B6

    .badge-progress
      display none

.badge-progress
  display block
  margin-top 6px
  background-color transparent
  border 1px solid #bbbbbb
  border-radius 4px

  .badge-progress-bar
    display block
    height 4px
    background-color #bbbbbb
    border-radius 4px

</style>
