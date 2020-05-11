<template>
  <div class="topicpage-maintainer">
    <div class="maintainers" v-if="users.length">
      <div class="avatars">
        <router-link
          v-for="user in users"
          :key="user._id"
          :to="profileRoute(user)">
          <Avatar width="28px" :user="user" />
        </router-link>
      </div>

      Maintained by

      <div class="labels">
        <router-link v-for="user in users" :to="profileRoute(user)" :key="user._id" class="link">
          {{user.name}} {{user.lastName || ''}}
        </router-link>
      </div>
    </div>
    <div v-if="!isMaintainer" @click="topicSelect" class="link-button">
      Become a maintainer
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar'
export default {
  name: 'topic-page-maintainer',

  components: {
    Avatar,
  },

  props: {
    users: {
      type: Array,
      default: () => [],
    },
    isMaintainer: {
      type: Boolean,
      default: false,
    },
    topicSelect: {
      type: Function,
      default: () => {},
    },
  },

  methods: {
    profileRoute (user) {
      return {
        name: 'PublicProfile',
        params: {
          id: user._id
        },
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.topicpage-maintainer
  margin 0 0 40px
  font-size 14px

.maintainers
  display flex
  align-items center

.avatars
  display flex

  & > a
    margin-right -10px
    padding 4px
    background-color #ffffff
    border-radius 24px

    .avatar
      background-color #ffffff
      border-radius 16px

    &:last-child
      margin-right 10px

.link
  display inline-block
  text-decoration underline

.link-button
  cursor pointer
  display inline-block
  margin-top 10px
  padding 4px 12px
  color #a591ff
  border 1px solid #a591ff
  border-radius 18px

  &:hover
    color #ffffff
    background-color #a591ff

.labels .link
  &::before
    content ' ,'

  &:first-child
    margin-left 4px

    &::before
      content ''

</style>
