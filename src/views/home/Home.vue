<template>
  <div class="home-container">
    <topic-list />
    <router-view />
  </div>
</template>

<script>
import { TopicList } from '@/components/topic'

export default {
  components: {
    TopicList,
  },
  name: 'home'
}
</script>

<style lang="stylus" scoped>
.home-container
  max-width 1050px
  margin 0 auto

@media (max-width 750px)
  .home-container
    flex-direction column

</style>
