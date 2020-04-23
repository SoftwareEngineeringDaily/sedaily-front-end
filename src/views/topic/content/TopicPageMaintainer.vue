<template>
  <div v-if="user" class="topicpage-maintainer">
    <router-link :to="profile"><Avatar width="40px" :user="user" /></router-link>
    Maintained by <router-link :to="profile" class="link">{{user.name}} {{user.lastName || ''}}</router-link>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar'
export default {
  name: 'topic-page-maintainer',
  components: {
    Avatar
  },
  props: {
    user: {
      type: Object
    }
  },
  computed: {
    profile () {
      return { name: 'PublicProfile', params: { id: this.user._id } }
    }
  }
}
</script>

<style scoped lang="stylus">
  .topicpage-maintainer
    font-size 16px
    margin 20px 0

    .avatar
      margin-right 10px
    
    .link
      text-decoration underline
</style>
