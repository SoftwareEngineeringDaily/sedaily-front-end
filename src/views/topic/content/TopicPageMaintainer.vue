<template>
  <div v-if="user" class="topicpage-maintainer">
    <Avatar width="40px" :user="user" />
    Maintained by {{user.name}}
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
  }  
}
</script>

<style scoped lang="stylus">
  .topicpage-maintainer
    font-size 16px
    margin 20px 0

    .avatar
      margin-right 10px
</style>
