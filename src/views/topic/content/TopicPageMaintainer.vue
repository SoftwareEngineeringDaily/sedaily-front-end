<template>
  <div class="topicpage-maintainer" v-if="users.length">
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
    }
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
  display flex
  align-items center
  font-size 14px
  margin 0 0 20px

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
  margin-right -3px
  text-decoration underline

  &::before
    content ' ,'

  &:first-child
    margin-left 4px

    &::before
      content ''

</style>
